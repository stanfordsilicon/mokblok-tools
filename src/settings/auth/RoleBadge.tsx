import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { levelDescriptor, type UserLevel } from './user-levels';

// Imports VALUES from './user-levels', not './roles'. That is the whole point
// of the split: roles.ts pulls in the MongoDB driver, and this component
// renders inside a client component (AccountBadge).
//
// PALETTE. Deliberately NOT derived from the descriptor array: each app keeps
// its own colours. The hues follow IDLI's semantics so a chip means the same
// thing across the three apps — green for beta, amber for metrics editor, blue
// for moderator, the accent for admin — expressed in --silicon-* tokens.
//
// Typed as Record<UserLevel, string> rather than a lookup with a fallback, on
// purpose: adding a level to LEVELS is then a COMPILE ERROR here until somebody
// chooses what it looks like. A fallback would instead ship a new level as an
// anonymous grey chip that nobody notices is wrong.
const STYLES: Record<UserLevel, string> = {
  // "Public User" is the absence of privilege, so it gets the absence of colour.
  user: 'border-(--silicon-line) text-(--silicon-ink-soft)',
  // Green: reads as "new / in flight", which is what a beta tester is.
  beta: 'border-(--silicon-green-ink) text-(--silicon-green-ink)',
  // Amber. Distinct from moderator's blue because the two are NOT neighbours
  // on a ladder — a metrics editor holds a scoped grant, and giving it a colour
  // adjacent to moderator's would imply a rank it doesn't have.
  metrics_editor: 'border-(--silicon-orange-ink) text-(--silicon-orange-ink)',
  // Blue, matching IDLI's moderator tier. This chip was green before the new
  // levels arrived; green moved to beta, which is where IDLI puts it.
  moderator: 'border-(--silicon-blue-ink) text-(--silicon-blue-ink)',
  // The SILICON purple — the app's "this is special" colour.
  admin: 'border-(--silicon-purple) text-(--silicon-purple)',
};

/**
 * The level chip. Rendered from `session.user.role`, which is a UI
 * convenience: it can lag the database by up to ROLE_TTL_MS, and nothing
 * privileged is gated on it. Renders nothing for plain users — "Public User" is
 * the absence of a badge, not a badge.
 */
export function RoleBadge({
  role,
  showUser = false,
  className = '',
}: {
  role: UserLevel;
  /** Render a chip for the plain "user" level too (the admin user table wants
   * a value in every row; a header does not). */
  showUser?: boolean;
  className?: string;
}) {
  const { uitext } = useInterfaceTranslation();
  if (role === 'user' && !showUser) return null;

  return (
    <span
      // title carries the descriptor's one-line description, so whoever is
      // looking at a chip can find out what it grants without going to read
      // user-levels.ts. Not translated: the descriptions live in the shared
      // level table, and a half-translated tooltip is worse than an English one.
      title={levelDescriptor(role).description}
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STYLES[role]} ${className}`}
    >
      {uitext(`auth.roles.${role}`)}
    </span>
  );
}
