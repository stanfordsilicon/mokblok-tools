// Account indicator for the home page. Client component because it reads the
// session; SessionProvider in app/layout.tsx supplies it.
//
// Handles both states on purpose: with "/" in the proxy.ts matcher only the
// signed-in branch is reachable, but keeping the signed-out branch means this
// still behaves correctly if the home page is ever made public again.
'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useCallback } from 'react';

import LanguageDropdown from '@settings/selectors/LanguageDropdown';
import { useURLParams } from '@settings/URLParams';
import useAllowedTargetLanguages from '@settings/useAllowedTargetLanguages';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { RoleBadge } from './RoleBadge';

export default function AccountBadge() {
  const { uitext } = useInterfaceTranslation();
  const { data: session, status } = useSession();
  const { updateURLParams, admin, targetLanguage } = useURLParams();
  const allowedLanguages = useAllowedTargetLanguages();

  const updateAdminMode = useCallback(
    () => updateURLParams({ admin: !admin }),
    [updateURLParams, admin],
  );

  // Hold the space while the session resolves so the header doesn't jump.
  if (status === 'loading') {
    return (
      <div className="h-12 w-52 rounded-2xl bg-(--silicon-panel) animate-pulse">
        {uitext('auth.updatingSession')}
      </div>
    );
  }

  if (session?.user) {
    // UI convenience only (see lib/roles.ts): /admin re-verifies against the
    // database, so a stale claim here can at worst offer a link that lands
    // on a 403 — it can never grant anything.
    const role = session.user.role ?? 'user';

    return (
      <div className="flex flex-col items-start gap-1 rounded-2xl border border-(--silicon-line) bg-(--silicon-beige) px-4 py-2.5 shadow-sm">
        <div className="w-full flex items-center justify-between gap-2 text-sm uppercase font-semibold text-(--silicon-purple)">
          {uitext('auth.signedInAs')}
          <RoleBadge role={role} />
        </div>
        <div className="w-full flex flex-row justify-between gap-2 items-center">
          <span className="truncate text-sm font-medium">{session.user.email}</span>{' '}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="shrink-0 rounded-xl border border-(--silicon-line-strong) px-3 py-1.5 text-xs font-semibold text-(--silicon-ink) transition  "
          >
            {uitext('auth.signOut')}
          </button>
        </div>

        <div className="flex flex-row gap-2 text-xs">
          {allowedLanguages.length > 1 && (
            <LanguageDropdown
              current={targetLanguage}
              onChange={(newLanguage) => updateURLParams({ targetLanguage: newLanguage })}
              options={allowedLanguages}
              includeLocalizedName={false}
            />
          )}
          {role === 'admin' && (
            <button
              onClick={updateAdminMode}
              className="text-xs font-semibold text-(--silicon-purple) underline-offset-2"
            >
              {admin ? uitext('auth.viewingAsAdmin') : uitext('auth.viewingAsRegularUser')}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn('google')}
      className="rounded-xl bg-(--silicon-brown) px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-(--silicon-purple) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--silicon-purple)"
    >
      {uitext('auth.signInWhy')}
    </button>
  );
}
