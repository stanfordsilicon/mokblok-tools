// Auth.js's default Session type doesn't include user.id; we put the stable
// internal id there in auth.config.ts's session callback, so declare it here
// once instead of casting at every use site.
import { DefaultSession } from 'next-auth';

import type { Role } from './roles';

declare module 'next-auth' {
  interface Session {
    user: {
      /** Stable internal user id — the adapter's users._id as a string. */
      id: string;
      /**
       * UI CONVENIENCE ONLY. Copied off the JWT so a badge can render
       * without a database round trip; may be up to ROLE_TTL_MS stale.
       * Never gate a privileged action on this — use requireRole() from
       * lib/roles.ts, which re-reads the live value.
       */
      role: Role;
    } & DefaultSession['user'];
  }
}

// NOT `declare module "next-auth/jwt"`, despite that being the shape the
// Auth.js docs show. next-auth/jwt is a bare `export * from "@auth/core/jwt"`
// re-export with no JWT interface of its own, so augmenting it declares a
// second, unrelated interface and the callback keeps seeing JWT's
// `[key: string]: unknown` index signature — which makes `token.userId`
// resolve to `{}` and fail to assign to `session.user.id` under strict.
// Augmenting the module that actually declares the interface is what works.
// (Same note, same fix, as idli-main/src/types/next-auth.d.ts.)
declare module '@auth/core/jwt' {
  interface JWT {
    /** Set on first sign-in by the jwt callback; absent until then. */
    userId?: string;
    /** Live role at the time the claim was last refreshed. See auth.ts. */
    role?: Role;
    /** Date.now() of that refresh, so the TTL can be checked without a
     * second cookie or a database read. */
    roleCheckedAt?: number;
  }
}
