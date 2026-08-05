// Route protection (hardening req #2). Formerly middleware.ts — Next.js 16
// renamed the convention to proxy.ts. Same matcher, same behaviour.
//
// Instantiates NextAuth with ONLY the edge-safe config (no MongoDB adapter).
// Under proxy.ts that's no longer strictly required — proxy runs on the Node
// runtime, where the driver would load fine — but it's still the right call:
// it keeps the adapter (and a Mongo client) out of a path that runs on every
// matched request, when all this needs is JWT verification.
import { NextResponse } from 'next/server';
import NextAuth from 'next-auth';

import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  const { pathname, search, origin } = req.nextUrl;

  // auth() runs this callback on EVERY matched request and hands us the
  // session on req.auth (null when there's no valid JWT). Everything below
  // depends on that distinction — without it a signed-in user gets bounced to
  // the sign-in page exactly like a stranger, which reads as "sign in again"
  // forever, and every API call 401s even with a good session.
  const isSignedIn = Boolean(req.auth);

  // The sign-in page itself. Signed out, it has to render (bouncing it to
  // itself is an infinite loop); signed in, there's nothing left to do here,
  // so forward to wherever they were originally headed.
  if (pathname === '/auth/signin') {
    if (!isSignedIn) return NextResponse.next();

    const requested = req.nextUrl.searchParams.get('callbackUrl') ?? '/';
    // Resolve against our own origin and refuse anything that lands off-site,
    // so a crafted ?callbackUrl= can't turn this into an open redirect.
    const target = new URL(requested, origin);
    return NextResponse.redirect(target.origin === origin ? target : new URL('/', origin));
  }

  // Valid session → this layer has no further business with the request.
  if (isSignedIn) return NextResponse.next();

  // From here down the caller is NOT signed in.

  // API callers get a machine-readable 401, never an HTML redirect — the
  // survey client looks for exactly this status to show its "session expired"
  // message. (The route handler ALSO checks the session itself; this is the
  // outer fence, not the only one.)
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ success: false, error: 'Not signed in' }, { status: 401 });
  }

  // Page visits bounce to the Auth.js sign-in screen and come back to the
  // level they wanted after Google finishes. Same-origin path only (not
  // nextUrl.href) — it's what Auth.js expects and it keeps the URL readable.
  const signInUrl = new URL('/auth/signin', origin);
  signInUrl.searchParams.set('callbackUrl', pathname + search);
  return NextResponse.redirect(signInUrl);
});

export const config = {
  // Forces a sign in to access the survey. /auth/signin is matched too, so a
  // signed-in visitor who lands there gets forwarded on instead of being
  // asked to authenticate a second time.
  matcher: [
    '/',
    '/level/:path*',
    '/api/responses',
    '/api/drafts',
    '/api/related-language/:path*',
    '/api/progress',
    '/auth/signin',
  ],
};
