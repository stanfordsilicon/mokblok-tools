'use client';

import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

type RequestStatus = 'approved' | 'pending' | 'denied';

type LanguageRequest = {
  id: string;
  status: RequestStatus;
  requestedName: string;
  displayName: string;
  deniedReason: string | null;
  code: string | null;
};

type ApiResponse = {
  success?: boolean;
  error?: string;
  languages?: LanguageRequest[];
};

export default function LanguageRequestPanel() {
  const { uitext } = useInterfaceTranslation();
  const { status } = useSession();
  const { admin } = useURLParams();

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [languages, setLanguages] = useState<LanguageRequest[]>([]);

  const canUse = status === 'authenticated' && !admin;

  const loadRequests = useCallback(async () => {
    if (!canUse) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/languages');
      const body = (await response.json().catch(() => null)) as ApiResponse | null;
      if (!response.ok || !body?.success) {
        setError(body?.error ?? uitext('languageRequests.errors.load'));
        setLanguages([]);
        return;
      }
      setLanguages(body.languages ?? []);
    } catch {
      setError(uitext('languageRequests.errors.load'));
      setLanguages([]);
    } finally {
      setLoading(false);
    }
  }, [canUse, uitext]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const visibleRequests = useMemo(
    () => languages.filter((language) => language.status !== 'approved'),
    [languages],
  );

  async function submitRequest() {
    const requestedName = draft.trim();
    if (!requestedName) return;

    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/languages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestedName }),
      });
      const body = (await response.json().catch(() => null)) as ApiResponse | null;
      if (!response.ok || !body?.success) {
        setError(body?.error ?? uitext('languageRequests.errors.save'));
        return;
      }
      setDraft('');
      setOpen(false);
      await loadRequests();
    } catch {
      setError(uitext('languageRequests.errors.save'));
    } finally {
      setBusy(false);
    }
  }

  async function withdrawRequest(id: string) {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/languages/${id}`, { method: 'DELETE' });
      const body = (await response.json().catch(() => null)) as ApiResponse | null;
      if (!response.ok || !body?.success) {
        setError(body?.error ?? uitext('languageRequests.errors.remove'));
        return;
      }
      await loadRequests();
    } catch {
      setError(uitext('languageRequests.errors.remove'));
    } finally {
      setBusy(false);
    }
  }

  if (!canUse) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-semibold text-(--silicon-purple) underline-offset-2 hover:underline"
      >
        {uitext('languageRequests.trigger')}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="language-request-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div className="flex w-full max-w-xl flex-col gap-3 rounded-[1.5rem] border border-(--silicon-line) bg-white px-4 py-4 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  id="language-request-title"
                  className="text-sm font-semibold text-(--silicon-ink)"
                >
                  {uitext('languageRequests.title')}
                </p>
                <p className="text-sm text-(--silicon-ink-soft)">
                  {uitext('languageRequests.description')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-(--silicon-line-strong) px-3 py-1.5 text-sm font-semibold text-(--silicon-ink) transition hover:border-(--silicon-purple) hover:text-(--silicon-purple)"
              >
                {uitext('languageRequests.close')}
              </button>
            </div>

            <div className="flex flex-col gap-2 border-t border-(--silicon-line) pt-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-(--silicon-ink-soft)">
                {uitext('languageRequests.inputLabel')}
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  maxLength={120}
                  value={draft}
                  disabled={busy}
                  onChange={(event) => setDraft(event.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-(--silicon-line) bg-white px-3 py-2 text-sm outline-none focus:border-(--silicon-purple)"
                  placeholder={uitext('languageRequests.placeholder')}
                />
                <button
                  type="button"
                  disabled={busy || draft.trim().length === 0}
                  onClick={() => void submitRequest()}
                  className="rounded-xl bg-(--silicon-brown) px-4 py-2 text-sm font-semibold text-white transition hover:bg-(--silicon-purple) disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {busy ? uitext('languageRequests.sending') : uitext('languageRequests.send')}
                </button>
              </div>
              <p className="text-xs text-(--silicon-ink-soft)">{uitext('languageRequests.help')}</p>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-dashed border-(--silicon-purple) bg-(--silicon-panel) p-3 text-sm text-(--silicon-purple)"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-(--silicon-ink-soft)">
                {uitext('languageRequests.pendingTitle')}
              </p>
              {loading ? (
                <p className="text-sm text-(--silicon-ink-soft)">
                  {uitext('languageRequests.loading')}
                </p>
              ) : visibleRequests.length === 0 ? (
                <p className="text-sm text-(--silicon-ink-soft)">
                  {uitext('languageRequests.empty')}
                </p>
              ) : (
                visibleRequests.map((language) => (
                  <div
                    key={language.id}
                    className="flex flex-col gap-2 rounded-xl border border-(--silicon-line) bg-(--silicon-beige) px-3 py-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-(--silicon-ink)">
                          {language.displayName}
                        </p>
                        <p className="text-xs uppercase tracking-wider text-(--silicon-ink-soft)">
                          {language.status === 'pending'
                            ? uitext('languageRequests.status.pending')
                            : uitext('languageRequests.status.denied')}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void withdrawRequest(language.id)}
                        className="shrink-0 rounded-lg border border-(--silicon-line-strong) px-2.5 py-1 text-xs font-semibold text-(--silicon-ink) transition hover:border-(--silicon-purple) hover:text-(--silicon-purple)"
                      >
                        {language.status === 'pending'
                          ? uitext('languageRequests.withdraw')
                          : uitext('languageRequests.dismiss')}
                      </button>
                    </div>
                    {language.deniedReason && (
                      <p className="text-xs text-(--silicon-ink-soft)">
                        {uitext('languageRequests.deniedReason')} {language.deniedReason}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
