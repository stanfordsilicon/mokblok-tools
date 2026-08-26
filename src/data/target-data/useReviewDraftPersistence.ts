import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { TargetDataStatus, Vote } from './types';

import type { PersistedTranslationInfo, ReviewDraftResponse, TranslationEdit } from './types';

type Props = {
  hasUserChanges: boolean;
  targetLanguage: string;
  targetDataStatus: TargetDataStatus;
  translationEdits: Record<string, TranslationEdit>;
};

export default function useReviewDraftPersistence({
  hasUserChanges,
  targetLanguage,
  targetDataStatus,
  translationEdits,
}: Props) {
  const { status: sessionStatus } = useSession();
  const [persistedEntries, setPersistedEntries] = useState<PersistedTranslationInfo[]>([]);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (sessionStatus !== 'authenticated' || !targetLanguage) {
      setPersistedEntries([]);
      setIsDraftLoaded(sessionStatus !== 'loading');
      return;
    }

    let cancelled = false;
    setPersistedEntries([]);
    setIsDraftLoaded(false);

    void fetch(`/api/review-drafts/${encodeURIComponent(targetLanguage)}`)
      .then(async (response) => {
        const body = (await response.json().catch(() => null)) as ReviewDraftResponse | null;
        if (!response.ok || !body?.success) return [];
        return Array.isArray(body.entries) ? body.entries : [];
      })
      .catch(() => [])
      .then((entries) => {
        if (cancelled) return;
        setPersistedEntries(entries);
        setIsDraftLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [sessionStatus, targetLanguage]);

  const changedEntries = useMemo(
    () =>
      Object.values(translationEdits)
        .filter(
          (entry) =>
            entry.edit !== undefined ||
            entry.comment !== undefined ||
            (entry.vote ?? Vote.Unknown) !== Vote.Unknown,
        )
        .map((entry) => ({
          id: entry.id,
          ...(entry.edit !== undefined ? { edit: entry.edit } : {}),
          ...(entry.comment !== undefined ? { comment: entry.comment } : {}),
          ...((entry.vote ?? Vote.Unknown) !== Vote.Unknown ? { vote: entry.vote } : {}),
        })),
    [translationEdits],
  );

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    if (
      !hasUserChanges ||
      sessionStatus !== 'authenticated' ||
      !targetLanguage ||
      !isDraftLoaded ||
      targetDataStatus !== TargetDataStatus.Ready
    ) {
      return;
    }

    saveTimeoutRef.current = setTimeout(() => {
      void fetch(`/api/review-drafts/${encodeURIComponent(targetLanguage)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: changedEntries }),
      }).catch(() => {});
    }, 800);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [
    changedEntries,
    hasUserChanges,
    isDraftLoaded,
    sessionStatus,
    targetDataStatus,
    targetLanguage,
  ]);

  return {
    isDraftLoaded,
    persistedEntries,
  };
}
