// User levels for the SILICON apps -- the PURE half of the privilege system.
//
// THIRD COPY. The canonical pair lives in idli-main/src/lib/user-levels.ts and
// homescreen-webapp/lib/user-levels.ts, which are byte-identical to each other.
// This copy is identical in CONTENT but not in bytes: those two repos have no
// prettier config and so format at prettier's defaults (double quotes, 80
// columns), while this repo pins singleQuote/printWidth 100 in package.json, so
// `npm run lint:fix` would rewrite any verbatim paste on its next run. Diff for
// meaning, not for bytes, and EDIT ALL THREE COPIES TOGETHER until a shared
// @silicon/* package exists.
//
// WHAT IS DELIBERATELY NOT PORTED: the siblings' copy also carries the scope
// system (SCOPE_PATTERN, asScopes, hasScope), the `disabled` deactivation flag,
// and the Viewer/canView visibility decision. Those drive IDLI's per-metric
// observatory visibility, which this app has no equivalent of -- porting them
// here would be untested dead code. Scopes are explicitly NOT a level in the
// source's own model ("a scoped grant, not a rung on the ladder"), so leaving
// them out does not make this an incomplete copy of the LEVEL table, which is
// what this file is for. If mokblok-tools ever needs visibility gating or
// account deactivation, port that half then, from the same source.
//
// WHY IT IS SEPARATE FROM roles.ts, AND WHY IT HAS ZERO IMPORTS
// roles.ts imports the MongoDB driver, so anything a client component touches
// has to stay out of it. This module imports NOTHING, so RoleBadge.tsx can
// import values from it and the bundler pulls in an array of plain objects and
// a few pure functions. roles.ts re-exports all of it, so a server-side caller
// still has one import to remember.
//
// THE RULE THIS MODULE DOES NOT CHANGE: a level in a session or a JWT is a UI
// convenience and nothing else. Everything here is pure -- it decides nothing
// on its own. The live value comes from requireRole() in roles.ts.

// -- the level table ------------------------------------------------------

export interface LevelDescriptor {
  /** Stored verbatim in users.role. Never renamed once it has been written to
   * a document -- there is no backfill, so a rename orphans everyone holding
   * the old string down to the default level. */
  id: string;
  /** Human label. NOTE: this app renders labels through i18n
   * (`auth.roles.<id>` in src/locales/*.json), not from here, so that the chip
   * translates. This field stays because it is what makes the array a faithful
   * copy of the canonical one, and it is the fallback wording whenever a
   * translation is missing. Keep the two in sync. */
  label: string;
  /** Position in the hierarchy. See the gap note below. */
  order: number;
  /** What holding this level actually means, in one sentence. */
  description: string;
}

/**
 * THE one place a level is defined. Adding a level is one entry here and
 * nothing else: the union type, the id list, the order map, the label map and
 * the chip styling all derive from this array.
 *
 * WHY THE ORDER VALUES ARE GAPPED (0, 10, 20, 30, 100 rather than 0..4)
 * `order` is compared, never stored -- users.role holds the id string. The gaps
 * mean a level can be inserted between two existing ones by picking a number in
 * the gap, with no renumbering of the levels around it and no rewrite of any
 * stored document. Admin is parked at 100 rather than 40 so "the top" stays the
 * top however many levels get added underneath it.
 *
 * WHY "user" IS STILL THE ID FOR "Public User"
 * The wording changed; the stored string did not. Ten of the thirteen rows in
 * the shared `silicon` users collection hold "admin" or "metrics_editor" today
 * and the rest hold nothing at all, but any row that ever held "user" must keep
 * resolving -- renaming the id to "public_user" would silently drop those
 * people to the default level in all three apps at once. Label, not id.
 */
export const LEVELS = [
  {
    id: 'user',
    label: 'Public User',
    order: 0,
    description:
      'Anyone with an account. Sees every public observatory and can use the survey; holds no privileges beyond their own data.',
  },
  {
    id: 'beta',
    label: 'Beta Tester',
    order: 10,
    description:
      'Sees observatories marked beta-only, ahead of a public release. Grants no editing rights.',
  },
  {
    id: 'metrics_editor',
    label: 'Metrics Editor',
    order: 20,
    description:
      'Sees non-public observatories for the specific metrics listed in their scopes. A scoped grant, not a rung on the ladder.',
  },
  {
    id: 'moderator',
    label: 'Moderator',
    order: 30,
    description:
      'Everything a beta tester sees. Reserved for moderation duties; grants nothing further yet.',
  },
  {
    id: 'admin',
    label: 'Admin',
    order: 100,
    description:
      'Full administrative access: the dashboards, the audit log, level changes, and deactivating accounts. Sees everything, unconditionally.',
  },
] as const satisfies readonly LevelDescriptor[];

/**
 * Derived from LEVELS, so the type and the data can never disagree. A typo in a
 * call site (`hasLevel(x, "moderater")`) is a compile error rather than a
 * silent false.
 */
export type UserLevel = (typeof LEVELS)[number]['id'];

/** Ordered low -> high, which is also the admin dropdown's order. */
export const LEVEL_IDS: readonly UserLevel[] = LEVELS.map((level) => level.id);

/**
 * A users row with no `role` field IS "user" -- there is deliberately no
 * migration backfilling this. Every read goes through asLevel() so a missing,
 * null, or unrecognised value resolves here.
 */
export const DEFAULT_LEVEL: UserLevel = 'user';

/** The hierarchy. hasLevel() is a >= comparison on these numbers. */
export const LEVEL_ORDER: Record<UserLevel, number> = Object.fromEntries(
  LEVELS.map((level) => [level.id, level.order]),
) as Record<UserLevel, number>;

export const LEVEL_LABELS: Record<UserLevel, string> = Object.fromEntries(
  LEVELS.map((level) => [level.id, level.label]),
) as Record<UserLevel, string>;

export const LEVEL_DESCRIPTIONS: Record<UserLevel, string> = Object.fromEntries(
  LEVELS.map((level) => [level.id, level.description]),
) as Record<UserLevel, string>;

/**
 * The level with the highest `order`, computed rather than written down. That
 * is a rule about "the top of the hierarchy", not a rule about the string
 * "admin" -- hard-coding the string would quietly stop being true the day
 * somebody adds a level above it.
 */
export const HIGHEST_LEVEL: UserLevel = LEVELS.reduce((highest, level) =>
  level.order > highest.order ? level : highest,
).id;

export function isLevel(raw: unknown): raw is UserLevel {
  return typeof raw === 'string' && (LEVEL_IDS as readonly string[]).includes(raw);
}

/** Null-safe coercion: anything that isn't a known level is DEFAULT_LEVEL. */
export function asLevel(raw: unknown): UserLevel {
  return isLevel(raw) ? raw : DEFAULT_LEVEL;
}

/** True when `userLevel` sits at or above `requiredLevel` in the hierarchy. */
export function hasLevel(
  userLevel: UserLevel | string | null | undefined,
  requiredLevel: UserLevel,
): boolean {
  return LEVEL_ORDER[asLevel(userLevel)] >= LEVEL_ORDER[requiredLevel];
}

/** The descriptor for a level, coerced -- always returns something. */
export function levelDescriptor(raw: UserLevel | string | null | undefined): LevelDescriptor {
  const id = asLevel(raw);
  return LEVELS.find((level) => level.id === id) ?? LEVELS[0];
}

// -- backwards-compatible aliases ----------------------------------------

// The role vocabulary from the first pass, kept working so no call site had to
// churn when levels arrived. `Role` and `UserLevel` are the same type;
// `requireRole("admin")` and `requireRole("moderator")` mean exactly what they
// meant before, because "admin" and "moderator" kept their ids, their labels
// and their relative order. New code should prefer the level names -- these
// exist so the rename could be a widening rather than a migration.

export type Role = UserLevel;
export const ROLES: readonly Role[] = LEVEL_IDS;
export const ROLE_ORDER: Record<Role, number> = LEVEL_ORDER;
export const ROLE_LABELS: Record<Role, string> = LEVEL_LABELS;
export const DEFAULT_ROLE: Role = DEFAULT_LEVEL;

export const isRole = isLevel;
export const asRole = asLevel;
export const hasRole = hasLevel;
