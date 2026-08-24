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
  getTranslationInfo: () => ({ index: -1, source: '', vote: Vote.Unknown }),
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
  const [translationEdits, setTranslationEdits] = useState<Record<number, TranslationEdit>>({});

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
    targetLanguage,
    targetDataStatus,
    translationEdits,
  });

  const getTranslationInfo = useCallback(
    (entry: DataEntry | undefined): TranslationInfo => {
      if (!entry) return { index: -1, source: '', vote: Vote.Unknown };
      const baseline = translationBaselines[entry.index];
      if (!baseline) return { index: entry.index, source: '', vote: Vote.Unknown };
      const edit = translationEdits[entry.index];
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
    (index: number, update: Partial<TranslationEdit>) => {
      setTranslationEdits((prev) => {
        const updatedTranslation = prev[index]
          ? { ...prev[index], ...update }
          : { index, ...update };
        return {
          ...prev,
          [index]: updatedTranslation,
        };
      });
    },
    [setTranslationEdits],
  );

  const editTranslations = useCallback(
    (indices: number[], update: Partial<TranslationEdit>) => {
      setTranslationEdits((prev) => {
        const nextTranslations = { ...prev };
        for (const index of indices) {
          const updatedTranslation = nextTranslations[index]
            ? { ...nextTranslations[index], ...update }
            : { index, ...update };
          nextTranslations[index] = updatedTranslation;
        }
        return nextTranslations;
      });
    },
    [setTranslationEdits],
  );

  const getTranslations = useCallback(
    (entries?: DataEntry[]): TranslationInfo[] => {
      const indexSet = new Set(entries?.map((entry) => entry.index));
      return Object.values(translationEdits)
        .filter((edit) => !entries || indexSet.has(edit.index))
        .map((edit) => {
          const baseline = translationBaselines[edit.index];
          return { ...baseline, ...edit };
        });
    },
    [translationBaselines, translationEdits],
  );

  useEffect(() => {
    if (!isDraftLoaded) return;
    setTranslationEdits((prev) => applyPersistedEntries(prev, persistedEntries));
  }, [isDraftLoaded, persistedEntries, setTranslationEdits]);

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
