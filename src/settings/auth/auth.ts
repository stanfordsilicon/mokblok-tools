// Full Auth.js (NextAuth v5) setup. Imported by the auth route handler and by
// anything server-side that needs the session (app/api/responses/route.ts).
// NOT imported by middleware.ts — that uses auth.config.ts, see the note there.
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';

import { authConfig } from '../../../auth.config';
import getMongoClient, { siliconDbName } from '../../mongodb';

import { getUserRole } from './roles';

const ROLE_TTL_MS = 5 * 60 * 1000;

// Comma-separated ALLOWED_EMAILS from the env, normalised once per boot.
// Read lazily inside signIn (not at module top) so a missing env var fails a
// sign-in attempt with a clear denial rather than crashing the build.
function allowedEmails(): Set<string> {
  return new Set(
    (process.env.ALLOWED_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  // MongoDBAdapter accepts a () => Promise<MongoClient>, so we reuse the same
  // cached client as the responses route — one pool for the whole app.
  // databaseName is the shared SILICON database, NOT an app-specific one:
  // idli-main points its own Auth.js instance at these same collections
  // (users, accounts, sessions, verification_tokens), so someone who signs in
  // here and there is ONE users row with one id, not two. The session cookie
  // isn't shared — each app asks Google separately — but the identity behind
  // it is. homescreen_survey_responses / homescreen_survey_drafts live in the same db.
  // Under strategy: "jwt" the sessions collection simply stays empty; users
  // and accounts are the payoff — a durable internal user id (users._id) that
  // a second provider (Stanford SSO, magic link) can link onto later.
  adapter: MongoDBAdapter(getMongoClient, { databaseName: siliconDbName() }),

  callbacks: {
    ...authConfig.callbacks,

    // ALLOWLIST (hardening req #2). Runs before the adapter creates a user, so
    // a rejected address never gets a users row at all. Returning false sends
    // the browser to /auth/error?error=AccessDenied (friendly page, no trace).
    signIn({ user, profile }) {
      const email = (user.email ?? profile?.email ?? '').toLowerCase();
      if (!email) return false;
      return allowedEmails().has(email);
    },

    async jwt(params) {
      const token = (await authConfig.callbacks.jwt(params)) ?? params.token;

      const checkedAt = typeof token.roleCheckedAt === 'number' ? token.roleCheckedAt : 0;
      const stale = Date.now() - checkedAt > ROLE_TTL_MS;

      if (token.userId && (params.trigger === 'update' || token.role == null || stale)) {
        try {
          token.role = await getUserRole(token.userId);
          token.roleCheckedAt = Date.now();
        } catch (err) {
          console.error('Role lookup failed while minting a token:', err);
        }
      }

      return token;
    },
  },
});
