// Route protection.
//
// Use the adapter-free config here so every matched request only does JWT
// verification and never opens a MongoDB client.
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';

import { authConfig } from './auth.config';
import i18nConfig from './i18n.config';

const { auth } = NextAuth(authConfig);
const locales = [...i18nConfig.supportedLngs].sort((a, b) => b.length - a.length);
const localeMatcher = locales.join('|');

function getLocaleFromPathname(pathname: string) {
  return locales.find((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
}

function stripLocaleFromPathname(pathname: string) {
  const locale = getLocaleFromPathname(pathname);

  if (!locale) return pathname;
  if (pathname === `/${locale}`) return '/';

  return pathname.slice(locale.length + 1);
}

function withLocale(pathname: string, locale?: string) {
  if (!locale) return pathname;
  if (pathname === '/') return `/${locale}`;

  return `/${locale}${pathname}`;
}

export const proxy = auth((req) => {
  const { pathname, search, origin } = req.nextUrl;
  const locale = getLocaleFromPathname(pathname);
  const normalizedPathname = stripLocaleFromPathname(pathname);

  // auth() runs on every matched request and puts the verified session on
  // req.auth.
  const isSignedIn = Boolean(req.auth);

  // The sign-in page itself. Signed out, it has to render (bouncing it to
  // itself is an infinite loop); signed in, there's nothing left to do here,
  // so forward to wherever they were originally headed.
  if (normalizedPathname === '/auth/signin') {
    if (!isSignedIn) return NextResponse.next();

    const requested = req.nextUrl.searchParams.get('callbackUrl') ?? withLocale('/', locale);
    // Resolve against our own origin and refuse anything that lands off-site,
    // so a crafted ?callbackUrl= can't turn this into an open redirect.
    const target = new URL(requested, origin);
    return NextResponse.redirect(
      target.origin === origin ? target : new URL(withLocale('/', locale), origin)
    );
  }

  // Valid session → this layer has no further business with the request.
  if (isSignedIn) return NextResponse.next();

  // From here down the caller is NOT signed in.

  // API callers get a machine-readable 401 instead of an HTML redirect.
  if (normalizedPathname.startsWith('/api/')) {
    return NextResponse.json({ success: false, error: 'Not signed in' }, { status: 401 });
  }

  // Page visits bounce to the Auth.js sign-in screen and come back to the
  // level they wanted after Google finishes. Same-origin path only (not
  // nextUrl.href) — it's what Auth.js expects and it keeps the URL readable.
  const signInUrl = new URL(withLocale('/auth/signin', locale), origin);
  signInUrl.searchParams.set('callbackUrl', pathname + search);
  return NextResponse.redirect(signInUrl);
});

export const config = {
  // Match protected pages plus the sign-in page itself so signed-in visitors
  // can be forwarded away from it.
  matcher: [
    '/',
    `/:locale(${localeMatcher})`,
    '/level/:path*',
    `/:locale(${localeMatcher})/level/:path*`,
    '/api/responses',
    '/api/drafts',
    '/api/related-language/:path*',
    '/api/progress',
    '/auth/signin',
    `/:locale(${localeMatcher})/auth/signin`,
  ],
};
