'use client';

import { useEffect, type ReactNode } from 'react';
import { create } from 'zustand';

import { useURLParams } from '@settings/URLParams';

import { applyPersistedEntries } from './applyPersistedEntries';
import {
  type TargetDataContextType,
  type TranslationBaseline,
  type TranslationEdit,
} from './types';
import useReviewDraftPersistence from './useReviewDraftPersistence';
import { useWorksheetDataContext } from './WorksheetDataProvider';

type TargetDataStore = TargetDataContextType & {
  translationBaselines: Record<string, TranslationBaseline>;
  translationEdits: Record<string, TranslationEdit>;
  hasUserChanges: boolean;
  setTranslationBaselines(translationBaselines: Record<string, TranslationBaseline>): void;
  setTranslationEdits(translationEdits: Record<string, TranslationEdit>): void;
  resetTranslations(): void;
};

export const useTargetDataStore = create<TargetDataStore>((set) => ({
  translationBaselines: {},
  translationEdits: {},
  hasUserChanges: false,

  setTranslationBaselines: (translationBaselines) => set({ translationBaselines }),

  setTranslationEdits: (translationEdits) => set({ translationEdits }),

  resetTranslations: () => set({ translationEdits: {}, hasUserChanges: false }),

  editTranslation: (id, update) =>
    set((state) => ({
      hasUserChanges: true,
      translationEdits: {
        ...state.translationEdits,
        [id]: state.translationEdits[id]
          ? { ...state.translationEdits[id], ...update }
          : { id, ...update },
      },
    })),

  editTranslations: (ids, update) =>
    set((state) => {
      const translationEdits = { ...state.translationEdits };
      for (const id of ids) {
        translationEdits[id] = translationEdits[id]
          ? { ...translationEdits[id], ...update }
          : { id, ...update };
      }
      return { hasUserChanges: true, translationEdits };
    }),

  clearAllTranslations: () => set({ translationEdits: {}, hasUserChanges: false }),
}));

const TargetDataProvider = ({ children }: { children: ReactNode }) => {
  const { targetLanguage } = useURLParams();
  const { targetDataStatus, translationBaselines } = useWorksheetDataContext();

  const translationEdits = useTargetDataStore((state) => state.translationEdits);
  const hasUserChanges = useTargetDataStore((state) => state.hasUserChanges);
  const setTranslationBaselines = useTargetDataStore((state) => state.setTranslationBaselines);
  const setTranslationEdits = useTargetDataStore((state) => state.setTranslationEdits);
  const resetTranslations = useTargetDataStore((state) => state.resetTranslations);

  const { isDraftLoaded, persistedEntries } = useReviewDraftPersistence({
    hasUserChanges,
    targetLanguage,
    targetDataStatus,
    translationEdits,
  });

  // Loading Triggers
  useEffect(() => {
    if (!isDraftLoaded) return;
    resetTranslations();
    setTranslationEdits(applyPersistedEntries({}, persistedEntries));
  }, [isDraftLoaded, persistedEntries, resetTranslations, setTranslationEdits]);

  useEffect(() => {
    setTranslationBaselines(translationBaselines);
  }, [setTranslationBaselines, translationBaselines]);

  useEffect(() => resetTranslations(), [resetTranslations, targetLanguage]);

  return children;
};

export default TargetDataProvider;
