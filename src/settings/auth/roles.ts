// Role-based privilege helpers -- the DATABASE-BACKED half. The pure half (the
// level table itself) lives in ./user-levels, which imports nothing and is
// therefore safe for client components; this file re-exports all of it, so a
// server-side caller still has exactly one module to import.
//
// A role stored in the session/JWT is only a UI hint. Privileged actions
// always re-read the live role from MongoDB so demotions take effect
// immediately.
//
// Server only: importing values from this module into a client component would
// pull the MongoDB driver into the client bundle. Since the levels split out
// into ./user-levels there is no longer a reason to want to -- everything a
// client component needs (the level list, the labels, hasLevel) is over there,
// importable as a value.
import { ObjectId, type Document, type Filter } from 'mongodb';
import { NextResponse } from 'next/server';

import getMongoClient, { siliconDbName } from '../../mongodb';

import { asLevel, hasLevel, DEFAULT_LEVEL, LEVEL_LABELS, type UserLevel } from './user-levels';

// Everything pure, re-exported. Existing imports of Role, ROLES, ROLE_ORDER,
// ROLE_LABELS, DEFAULT_ROLE, isRole, asRole and hasRole keep resolving from
// './roles' exactly as they did before levels existed -- that is the whole
// point of the aliases at the bottom of user-levels.ts. Server-side code may
// keep importing from here; anything a client component pulls in must import
// from './user-levels' directly.
export * from './user-levels';

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
export async function getUserRole(identifier: string | null | undefined): Promise<UserLevel> {
  const filter = userFilter(identifier);
  if (!filter) return DEFAULT_LEVEL;

  const client = await getMongoClient();
  const doc = await client
    .db(siliconDbName())
    .collection('users')
    .findOne(filter, { projection: { role: 1 } });

  return asLevel(doc?.role);
}

// -- the guard ------------------------------------------------------------

export type RoleCheck =
  | {
      ok: true;
      role: UserLevel;
      /** The same value as `role`, under the level vocabulary. New code should
       * read this one; `role` stays for the existing call sites. */
      level: UserLevel;
      userId: string;
      email: string | null;
      name: string | null;
    }
  | { ok: false; status: 401 | 403; role: UserLevel; error: string };

/**
 * The single privileged-access gate for API routes and server-side UI.
 *
 * Resolves the session for identity, then reads the role straight from the
 * database. It never trusts the role claim stored in the session.
 *
 * `auth` is imported dynamically because auth.ts imports getUserRole() from
 * this module to enrich the session; a static import here would close that
 * cycle at module-evaluation time. The import is resolved once and cached by
 * the module registry, so this costs nothing after the first call.
 *
 * Unchanged for every existing caller: requireRole('admin') and
 * requireRole('moderator') mean exactly what they meant before levels arrived,
 * because both ids kept their labels and their relative order, and the two new
 * intermediate levels sit below moderator.
 */
export async function requireRole(requiredRole: UserLevel): Promise<RoleCheck> {
  const { auth } = await import('../../../auth');
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      ok: false,
      status: 401,
      role: DEFAULT_LEVEL,
      error: 'Not signed in',
    };
  }

  const role = await getUserRole(userId);
  if (!hasLevel(role, requiredRole)) {
    return {
      ok: false,
      status: 403,
      role,
      error: `Requires the ${LEVEL_LABELS[requiredRole]} role`,
    };
  }

  return {
    ok: true,
    role,
    level: role,
    userId,
    email: session.user.email ?? null,
    name: session.user.name ?? null,
  };
}

/** The JSON response an API route returns for a failed requireRole(). */
export function roleDenied(check: Extract<RoleCheck, { ok: false }>): NextResponse {
  return NextResponse.json({ error: check.error }, { status: check.status });
}
