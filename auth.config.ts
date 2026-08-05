// Edge-safe half of the Auth.js config. Kept separate from auth.ts so the
// route-protection layer (proxy.ts) can verify JWTs without pulling in the
// MongoDB adapter — proxy runs on every matched request, and all it needs is
// the secret. Both halves share AUTH_SECRET, so the JWT minted by auth.ts
// verifies fine in proxy.ts.
import Google from 'next-auth/providers/google';

import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [Google],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: { strategy: 'jwt' },
} satisfies NextAuthConfig;
