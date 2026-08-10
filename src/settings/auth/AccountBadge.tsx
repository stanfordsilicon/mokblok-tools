// Account indicator for the home page. Client component because it reads the
// session; SessionProvider in app/layout.tsx supplies it.
//
// Handles both states on purpose: with "/" in the proxy.ts matcher only the
// signed-in branch is reachable, but keeping the signed-out branch means this
// still behaves correctly if the home page is ever made public again.
'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useCallback } from 'react';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { RoleBadge } from './RoleBadge';

export default function AccountBadge() {
  const { uitext } = useInterfaceTranslation();
  const { data: session, status } = useSession();
  const { updateURLParams, admin } = useURLParams();
  const updateAdminMode = useCallback(
    () => updateURLParams({ admin: !admin }),
    [updateURLParams, admin],
  );

  // Hold the space while the session resolves so the header doesn't jump.
  if (status === 'loading') {
    return <div className="h-12 w-52 rounded-2xl bg-(--silicon-panel) animate-pulse" />;
  }

  if (session?.user) {
    // UI convenience only (see lib/roles.ts): /admin re-verifies against the
    // database, so a stale claim here can at worst offer a link that lands
    // on a 403 — it can never grant anything.
    const role = session.user.role ?? 'user';

    return (
      <div className="flex items-center gap-3 rounded-2xl border border-(--silicon-line) bg-white px-4 py-2.5 shadow-sm">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold text-(--silicon-purple)">
            {uitext('auth.signedInAs')}
            <RoleBadge role={role} />
          </p>
          <p className="truncate text-sm font-medium text-(--silicon-ink)">{session.user.email}</p>
          {role === 'admin' && (
            <button
              onClick={updateAdminMode}
              className="text-xs font-semibold text-(--silicon-purple) underline-offset-2 hover:underline"
            >
              {admin ? uitext('settings.viewingAsAdmin') : uitext('settings.viewingAsRegularUser')}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="shrink-0 rounded-xl border border-(--silicon-line-strong) px-3 py-1.5 text-xs font-semibold text-(--silicon-ink) transition hover:border-(--silicon-purple) hover:text-(--silicon-purple)"
        >
          {uitext('auth.signOut')}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn('google')}
      className="rounded-xl bg-(--silicon-brown) px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-(--silicon-purple) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--silicon-purple)"
    >
      {uitext('auth.signInToSaveProgress')}
    </button>
  );
}
