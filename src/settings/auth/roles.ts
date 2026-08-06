// Role-based privilege system for the SILICON apps.
//
// INTENTIONALLY DUPLICATED: this file exists byte-identically in
// idli-main/src/lib/roles.ts and homescreen-webapp/lib/roles.ts. The two
// repos are deployed as separate Vercel projects with no shared package yet,
// and a copied 150-line module is a smaller cost than standing up a private
// npm package (or a git submodule) for one file. Both repos resolve
// "@/lib/mongodb" and "@/auth" to their own equivalents, which is what lets
// the copies stay identical -- see the note in each tsconfig.json. When a
// shared @silicon/* package does exist, this is the first thing to move into
// it; until then, EDIT BOTH COPIES TOGETHER.
//
// THE RULE THIS MODULE ENFORCES: a role in a session/JWT is a UI
// convenience and nothing else. Every privileged action re-reads the role
// from the `users` collection through requireRole() below, so a demotion
// takes effect on the demoted user's very next request instead of whenever
// their token happens to expire.
// SERVER ONLY. This module pulls in the MongoDB driver, so a "use client"
// component may import `type Role` from it but must never import a value --
// a value import would drag the driver into the client bundle. The
// `server-only` package would enforce that mechanically, but neither repo
// has that dependency and this work adds none.
import { ObjectId, type Document, type Filter } from 'mongodb';
import { NextResponse } from 'next/server';

import getMongoClient, { siliconDbName } from '../../mongodb';

export type Role = 'user' | 'moderator' | 'admin';

/** Ordered low -> high. The order of this array is the dropdown's order. */
export const ROLES: readonly Role[] = ['user', 'moderator', 'admin'] as const;

/**
 * A users row with no `role` field IS a "user" -- there is deliberately no
 * migration backfilling this. Every read in both apps goes through asRole()
 * so a missing, null, or unrecognised value resolves here.
 */
export const DEFAULT_ROLE: Role = 'user';

/** The hierarchy. hasRole() is a >= comparison on these numbers, so granting
 * moderators a new capability later is a one-line change at the call site
 * (requireRole("admin") -> requireRole("moderator")) and nothing else. */
export const ROLE_ORDER: Record<Role, number> = {
  user: 0,
  moderator: 1,
  admin: 2,
};

export const ROLE_LABELS: Record<Role, string> = {
  user: 'User',
  moderator: 'Moderator',
  admin: 'Admin',
};

export function isRole(raw: unknown): raw is Role {
  return typeof raw === 'string' && (ROLES as readonly string[]).includes(raw);
}

/** Null-safe coercion: anything that isn't a known role is DEFAULT_ROLE. */
export function asRole(raw: unknown): Role {
  return isRole(raw) ? raw : DEFAULT_ROLE;
}

/** True when `userRole` sits at or above `requiredRole` in the hierarchy. */
export function hasRole(userRole: Role | string | null | undefined, requiredRole: Role): boolean {
  return ROLE_ORDER[asRole(userRole)] >= ROLE_ORDER[requiredRole];
}

// -- database reads -------------------------------------------------------

/** Escape a string for safe use inside a RegExp literal. */
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Build a users-collection filter from either an ObjectId string (the
 * session's user.id) or an email address. Email matching is
 * case-insensitive: Google normalises what it sends, but a role set by hand
 * through scripts/set-role.mjs shouldn't miss over capitalisation.
 */
export function userFilter(identifier: string | null | undefined): Filter<Document> | null {
  if (!identifier) return null;
  const value = identifier.trim();
  if (!value) return null;
  if (value.includes('@')) {
    return { email: { $regex: `^${escapeRegex(value)}$`, $options: 'i' } };
  }
  if (ObjectId.isValid(value) && value.length === 24) {
    return { _id: new ObjectId(value) };
  }
  return null;
}

/**
 * The CURRENT role, read live from the shared `silicon` database. Never
 * consults a token. Missing user, missing field, unknown string -> "user".
 */
export async function getUserRole(identifier: string | null | undefined): Promise<Role> {
  const filter = userFilter(identifier);
  if (!filter) return DEFAULT_ROLE;

  const client = await getMongoClient();
  const doc = await client
    .db(siliconDbName())
    .collection('users')
    .findOne(filter, { projection: { role: 1 } });

  return asRole(doc?.role);
}

// -- the guard ------------------------------------------------------------

export type RoleCheck =
  | {
      ok: true;
      role: Role;
      userId: string;
      email: string | null;
      name: string | null;
    }
  | { ok: false; status: 401 | 403; role: Role; error: string };

/**
 * THE single privileged-access gate for both apps: API routes, server
 * components, and route layouts all call this and nothing else.
 *
 * Resolves the session (for identity only), then reads the role straight
 * out of the database. The session's own `role` claim is never consulted
 * here -- that copy exists purely so the UI can render a badge without a
 * round trip, and trusting it would mean a demoted admin keeps their
 * powers until their JWT rolls over.
 *
 * `auth` is imported dynamically because auth.ts imports getUserRole() from
 * this module to enrich the session; a static import here would close that
 * cycle at module-evaluation time. The import is resolved once and cached by
 * the module registry, so this costs nothing after the first call.
 */
export async function requireRole(requiredRole: Role): Promise<RoleCheck> {
  const { auth } = await import('../../../auth');
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      ok: false,
      status: 401,
      role: DEFAULT_ROLE,
      error: 'Not signed in',
    };
  }

  const role = await getUserRole(userId);
  if (!hasRole(role, requiredRole)) {
    return {
      ok: false,
      status: 403,
      role,
      error: `Requires the ${ROLE_LABELS[requiredRole]} role`,
    };
  }

  return {
    ok: true,
    role,
    userId,
    email: session.user.email ?? null,
    name: session.user.name ?? null,
  };
}

/** The JSON response an API route returns for a failed requireRole(). */
export function roleDenied(check: Extract<RoleCheck, { ok: false }>): NextResponse {
  return NextResponse.json({ error: check.error }, { status: check.status });
}
