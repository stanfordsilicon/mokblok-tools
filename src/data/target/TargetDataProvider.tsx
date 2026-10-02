'use client';

import { useEffect, type ReactNode } from 'react';
import { create } from 'zustand';

import { useURLParams } from '@settings/URLParams';

import { applyPersistedEntries } from './applyPersistedEntries';
import {
  Vote,
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

export const useTargetDataStore = create<TargetDataStore>((set, get) => ({
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

  getTranslationInfo: (entry) => {
    const { translationBaselines, translationEdits } = get();
    if (!entry) return { id: '', source: '', vote: Vote.Unknown };
    const baseline = translationBaselines[entry.id];
    if (!baseline) return { id: entry.id, source: '', vote: Vote.Unknown };
    const edit = translationEdits[entry.id];
    if (!edit) return { ...baseline, vote: Vote.Unknown };
    return { ...baseline, ...edit };
  },

  getTranslation: (entry, fallback = true) => {
    const info = get().getTranslationInfo(entry);
    return info.edit ?? info.translation ?? (fallback ? info.source : '');
  },

  getTranslations: (entries, scope = 'edited') => {
    const { translationBaselines, translationEdits } = get();
    const idSet = new Set(entries?.map((entry) => entry.id));
    if (scope === 'edited') {
      return Object.values(translationEdits)
        .filter((edit) => !entries || idSet.has(edit.id))
        .map((edit) => ({ ...translationBaselines[edit.id], ...edit }));
    }
    return Object.values(translationBaselines)
      .filter((baseline) => !entries || idSet.has(baseline.id))
      .map((baseline) => ({ ...baseline, ...translationEdits[baseline.id] }));
  },

  clearAllTranslations: () => set({ translationEdits: {}, hasUserChanges: false }),
}));

export const useTargetDataContext = (): TargetDataContextType => {
  const {
    editTranslation,
    editTranslations,
    getTranslation,
    getTranslationInfo,
    getTranslations,
    clearAllTranslations,
  } = useTargetDataStore();

  return {
    editTranslation,
    editTranslations,
    getTranslation,
    getTranslationInfo,
    getTranslations,
    clearAllTranslations,
  };
};

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
