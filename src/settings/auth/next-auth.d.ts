// Add the stable internal user id and role to the Session type once here.
import { DefaultSession } from 'next-auth';

// From './user-levels', not './roles': the two export the same type, but
// roles.ts is server-only and this declaration is loaded everywhere.
import type { Role } from './user-levels';

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
      /** Target languages this contributor is explicitly assigned in this app. */
      languages: string[];
    } & DefaultSession['user'];
  }
}

// Augment `@auth/core/jwt` rather than `next-auth/jwt`; that's where the JWT
// interface is actually declared.
declare module '@auth/core/jwt' {
  interface JWT {
    /** Set on first sign-in by the jwt callback; absent until then. */
    userId?: string;
    /** Live role at the time the claim was last refreshed. See auth.ts. */
    role?: Role;
    /** Target languages this contributor is explicitly assigned in this app. */
    languages?: string[];
    /** Date.now() of that refresh, so the TTL can be checked without a
     * second cookie or a database read. */
    roleCheckedAt?: number;
  }
}
