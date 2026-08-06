// Role-based privilege helpers.
//
// A role stored in the session/JWT is only a UI hint. Privileged actions
// always re-read the live role from MongoDB so demotions take effect
// immediately.
//
// Server only: importing values from this module into a client component would
// pull the MongoDB driver into the client bundle.
import { ObjectId, type Document, type Filter } from 'mongodb';
import { NextResponse } from 'next/server';

import getMongoClient, { siliconDbName } from '../../mongodb';

export type Role = 'user' | 'moderator' | 'admin';

/** Ordered low -> high. The order of this array is the dropdown's order. */
export const ROLES: readonly Role[] = ['user', 'moderator', 'admin'] as const;

/**
 * A users row with no `role` field is treated as a regular user.
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
 * The single privileged-access gate for API routes and server-side UI.
 *
 * Resolves the session for identity, then reads the role straight from the
 * database. It never trusts the role claim stored in the session.
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
