import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { useURLParams } from '@settings/URLParams';

import useTranslationFromSourceLanguage from './sourcedata/useTranslationFromSourceLanguage';
import { useSourceDataContext } from './SourceDataProvider';
import { applyPersistedEntries } from './target-data/applyPersistedEntries';
import {
  type TargetDataContextType,
  TargetDataStatus,
  TranslationEdit,
  type TranslationInfo,
  Vote,
} from './target-data/types';
import useReviewDraftPersistence from './target-data/useReviewDraftPersistence';
import useTargetBaselineData from './target-data/useTargetBaselineData';
import useImportedWorksheets from './worksheets/useImportedWorksheets';

import type { DataEntry } from './DataTypes';

export type { TargetDataContextType } from './target-data/types';
export { TargetDataStatus, Vote };

export const TargetDataContext = createContext<TargetDataContextType>({
  importedWorksheets: {},
  getTranslation: () => '',
  getTranslationInfo: () => ({ id: '', source: '', vote: Vote.Unknown }),
  getTranslations: () => [],
  editTranslation: () => {},
  editTranslations: () => {},
  targetDataStatus: TargetDataStatus.LoadingBaselineData,
  targetXMLData: {},
});

export const useTargetDataContext = () => {
  const context = useContext(TargetDataContext);
  if (!context) throw new Error('useTargetDataContext must be used within a TargetDataProvider');
  return context;
};

const TargetDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { targetLanguage, importSource } = useURLParams();
  const { findDataEntry, dataEntries } = useSourceDataContext();
  const getTranslationFromSourceLanguage = useTranslationFromSourceLanguage();
  const { extraText, tsvRows, importedWorksheets } = useImportedWorksheets();
  const [translationEdits, setTranslationEdits] = useState<Record<string, TranslationEdit>>({});
  const [hasUserChanges, setHasUserChanges] = useState(false);

  const { alphabetData, targetDataStatus, targetXMLData, translationBaselines } =
    useTargetBaselineData({
      dataEntries,
      extraText,
      findDataEntry,
      getTranslationFromSourceLanguage,
      importSource,
      persistedEntries: [],
      targetLanguage,
      tsvRows,
    });

  const { isDraftLoaded, persistedEntries } = useReviewDraftPersistence({
    hasUserChanges,
    targetLanguage,
    targetDataStatus,
    translationEdits,
  });

  const getTranslationInfo = useCallback(
    (entry: DataEntry | undefined): TranslationInfo => {
      if (!entry) return { id: '', source: '', vote: Vote.Unknown };
      const baseline = translationBaselines[entry.id];
      if (!baseline) return { id: entry.id, source: '', vote: Vote.Unknown };
      const edit = translationEdits[entry.id];
      if (!edit) return { ...baseline, vote: Vote.Unknown };
      return { ...baseline, ...edit };
    },
    [translationBaselines, translationEdits],
  );

  const getTranslation = useCallback(
    (entry: DataEntry | undefined, fallback = true): string => {
      const info = getTranslationInfo(entry);
      return info.edit ?? info.translation ?? (fallback ? info.source : '');
    },
    [getTranslationInfo],
  );

  const editTranslation = useCallback(
    (id: string, update: Partial<TranslationEdit>) => {
      setHasUserChanges(true);
      setTranslationEdits((prev) => {
        const updatedTranslation = prev[id] ? { ...prev[id], ...update } : { id, ...update };
        return {
          ...prev,
          [id]: updatedTranslation,
        };
      });
    },
    [setTranslationEdits],
  );

  const editTranslations = useCallback(
    (ids: string[], update: Partial<TranslationEdit>) => {
      setHasUserChanges(true);
      setTranslationEdits((prev) => {
        const nextTranslations = { ...prev };
        for (const id of ids) {
          const updatedTranslation = nextTranslations[id]
            ? { ...nextTranslations[id], ...update }
            : { id, ...update };
          nextTranslations[id] = updatedTranslation;
        }
        return nextTranslations;
      });
    },
    [setTranslationEdits],
  );

  const getTranslations = useCallback(
    (entries?: DataEntry[]): TranslationInfo[] => {
      const idSet = new Set(entries?.map((entry) => entry.id));
      return Object.values(translationEdits)
        .filter((edit) => !entries || idSet.has(edit.id))
        .map((edit) => {
          const baseline = translationBaselines[edit.id];
          return { ...baseline, ...edit };
        });
    },
    [translationBaselines, translationEdits],
  );

  useEffect(() => {
    if (!isDraftLoaded) return;
    setTranslationEdits(applyPersistedEntries({}, persistedEntries));
    setHasUserChanges(false);
  }, [isDraftLoaded, persistedEntries]);

  useEffect(() => {
    setTranslationEdits({});
    setHasUserChanges(false);
  }, [targetLanguage]);

  const dataContext: TargetDataContextType = {
    alphabet: alphabetData,
    editTranslation,
    editTranslations,
    getTranslation,
    getTranslationInfo,
    getTranslations,
    importedWorksheets,
    targetDataStatus,
    targetXMLData,
  };

  return <TargetDataContext.Provider value={dataContext}>{children}</TargetDataContext.Provider>;
};

export default TargetDataProvider;
