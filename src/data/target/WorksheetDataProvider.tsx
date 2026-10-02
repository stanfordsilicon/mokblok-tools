import { createContext, useContext, useMemo } from 'react';

import { useSourceDataContext } from '@data/source/SourceDataProvider';
import useTranslationFromSourceLanguage from '@data/source/useTranslationFromSourceLanguage';

import { useURLParams } from '@settings/URLParams';

import useImportedWorksheets from '../worksheets/useImportedWorksheets';

import { TargetDataStatus, Vote, WorksheetDataContextType } from './types';
import useTargetBaselineData from './useTargetBaselineData';

export type { TargetDataContextType } from './types';
export { TargetDataStatus, Vote };

export const WorksheetDataContext = createContext<WorksheetDataContextType>({
  targetDataStatus: TargetDataStatus.LoadingBaselineData,

  importedWorksheets: {},
  targetXMLData: {},
  translationBaselines: {},
});

export const useWorksheetDataContext = () => {
  const context = useContext(WorksheetDataContext);
  if (!context)
    throw new Error('useWorksheetDataContext must be used within a WorksheetDataProvider');
  return context;
};

const WorksheetDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { targetLanguage, importSource } = useURLParams();
  const { findDataEntry, dataEntries } = useSourceDataContext();
  const getTranslationFromSourceLanguage = useTranslationFromSourceLanguage();

  const {
    extraText,
    tsvRows,
    importedWorksheets,
    worksheetError,
    worksheetsLoading,
    worksheetRevisions,
    reloadWorksheets,
  } = useImportedWorksheets();

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
      worksheetsLoading: worksheetsLoading || !!worksheetError,
    });

  const dataContext: WorksheetDataContextType = useMemo(
    () => ({
      importedWorksheets,
      worksheetError,
      worksheetsLoading,
      worksheetRevisions,
      reloadWorksheets,

      targetDataStatus,
      targetXMLData,
      alphabetData,
      translationBaselines,
    }),
    [
      importedWorksheets,
      worksheetError,
      worksheetsLoading,
      worksheetRevisions,
      reloadWorksheets,
      targetDataStatus,
      targetXMLData,
      alphabetData,
      translationBaselines,
    ],
  );

  return (
    <WorksheetDataContext.Provider value={dataContext}>{children}</WorksheetDataContext.Provider>
  );
};

export default WorksheetDataProvider;
