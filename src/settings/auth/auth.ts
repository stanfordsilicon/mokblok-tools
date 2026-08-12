// Full Auth.js setup for route handlers and other server-side session reads.
// proxy.ts uses auth.config.ts instead so it can stay adapter-free.
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';

import { authConfig } from '../../../auth.config';
import getMongoClient, { siliconDbName } from '../../mongodb';

import { getUserRole } from './roles';

const ROLE_TTL_MS = 5 * 60 * 1000;

function isEmailAllowed(email: string): boolean {
  const allowedEmails = new Set(
    (process.env.ALLOWED_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
  const allowedEmailDomains = new Set(
    (process.env.ALLOWED_EMAIL_DOMAINS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
  return (
    allowedEmails.has(email) ||
    Array.from(allowedEmailDomains).some((domain) => email.endsWith(domain))
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  // Reuse the shared Mongo client so auth and app routes use one pool.
  // The shared SILICON database keeps a stable internal user id in `users`.
  adapter: MongoDBAdapter(getMongoClient, { databaseName: siliconDbName() }),

  callbacks: {
    ...authConfig.callbacks,

    // Reject unapproved addresses before the adapter creates a user row.
    signIn({ user, profile }) {
      const email = (user.email ?? profile?.email ?? '').toLowerCase();
      if (!email) return false;
      return isEmailAllowed(email);
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
