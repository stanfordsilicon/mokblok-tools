import type { Role } from './roles';

// The labels are re-declared here rather than imported from @/lib/roles
// because this component is rendered inside a client component
// (AccountBadge) and that module pulls in the MongoDB driver — a value
// import would drag the driver into the client bundle. `type Role` is erased
// at compile time, so the type import is free.
const LABELS: Record<Role, string> = {
  user: 'User',
  moderator: 'Moderator',
  admin: 'Admin',
};

// Admin takes the SILICON purple (the app's "this is special" colour);
// moderator takes the muted green-ink, so the tier is visible at a glance
// even though it currently grants nothing.
const STYLES: Record<Role, string> = {
  user: 'border-(--silicon-line) text-(--silicon-ink-soft)',
  moderator: 'border-(--silicon-green-ink) text-(--silicon-green-ink)',
  admin: 'border-(--silicon-purple) text-(--silicon-purple)',
};

/**
 * The role chip. Rendered from `session.user.role`, which is a UI
 * convenience: it can lag the database by up to ROLE_TTL_MS, and nothing
 * privileged is gated on it. Renders nothing for plain users — "User" is the
 * absence of a badge, not a badge.
 */
export function RoleBadge({
  role,
  showUser = false,
  className = '',
}: {
  role: Role;
  /** Render a chip for the plain "user" role too (the admin user table wants
   * a value in every row; a header does not). */
  showUser?: boolean;
  className?: string;
}) {
  if (role === 'user' && !showUser) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STYLES[role]} ${className}`}
    >
      {LABELS[role]}
    </span>
  );
}
