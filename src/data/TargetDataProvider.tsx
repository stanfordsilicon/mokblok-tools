import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useURLParams } from '@settings/URLParams';
import type { UseStoredParamsReturn } from '@settings/useStoredParams';
import useStoredParams from '@settings/useStoredParams';

import { LoadableLanguage } from '@widgets/input/InputLanguageSelector';

import { type AlphabetData, type DataEntry, type RowData } from './DataTypes';
import { Doc, getDocFileSuffix, getDocFileType } from './Doc';
import extractAlphabetData from './ExtractAlphabet';
import { loadInputText, parseDoc1TSV } from './LoadInputData';
import { parseDoc2Part1, parseDoc2Part2, parseDoc2Part3 } from './ParseDoc2';
import { useSourceDataContext } from './SourceDataProvider';

export enum TargetDataStatus {
  Initial,
  InputTSVChanged,
  Ready,
}

export type TargetDataContextType = {
  alphabet?: AlphabetData;
  inputTSVs: Partial<Record<Doc, UseStoredParamsReturn<string>>>;
  getTranslation(entry: DataEntry | undefined, fallback?: boolean): string;
  setTranslation(index: number, newTranslation: string): void;
  targetDataStatus: TargetDataStatus;
};

export const TargetDataContext = createContext<TargetDataContextType | undefined>({
  inputTSVs: {},
  alphabet: undefined,
  getTranslation: () => '',
  setTranslation: () => {},
  targetDataStatus: TargetDataStatus.Initial,
});

export const useTargetDataContext = () => {
  const context = useContext(TargetDataContext);
  if (!context) throw new Error('useTargetDataContext must be used within an TargetDataProvider');
  return context;
};

/**
 * This class controls data for the target language -- the language we want to collect translations for.
 */
const TargetDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { sourceDataStatus } = useSourceDataContext();
  const [targetDataStatus, setTargetDataStatus] = useState<TargetDataStatus>(
    TargetDataStatus.Initial,
  );
  const { findDataEntry } = useSourceDataContext();
  const [extraText, setExtraText] = useState<string>('');
  const { targetLanguage } = useURLParams();
  const inputTSVs = {
    [Doc.Doc1]: useStoredParams('inputText_1', ''),
    [Doc.Doc2_1]: useStoredParams('inputText_2_1', ''),
    [Doc.Doc2_2]: useStoredParams('inputText_2_2', ''),
    [Doc.Doc2_3]: useStoredParams('inputText_2_3', ''),
    [Doc.Doc3]: useStoredParams('inputText_3', ''),
    [Doc.Doc4]: useStoredParams('inputText_4', ''),
  };
  const [alphabetData, setAlphabetData] = useState<AlphabetData | undefined>(undefined);
  const [translationsByIndex, setTranslationsByIndex] = useState<Record<number, string>>({});

  // TSV input files
  const loadTSVData = useCallback(
    (lang: string) => {
      // Reload all docs
      Object.values(Doc).map((doc) => {
        const filename = `input_tsvs/${lang}_${getDocFileSuffix(doc)}.${getDocFileType(doc)}`;
        loadInputText(filename)
          .then((data) => {
            if (data) inputTSVs[doc].setValue(data);
            else inputTSVs[doc].clear();
          })
          .catch((e) => {
            console.error(e);
            inputTSVs[doc].clear();
          });
      });
    },
    [inputTSVs],
  );
  useEffect(() => {
    if (targetLanguage && Object.values(LoadableLanguage).find((l) => l === targetLanguage))
      loadTSVData(targetLanguage);
  }, [targetLanguage]);

  // Automatically updates the TSV datasets when input changes
  const tsvRows = useMemo(() => {
    const doc1Rows = parseDoc1TSV(inputTSVs[Doc.Doc1]?.value ?? '');
    const doc2_1Rows = parseDoc2Part1(inputTSVs[Doc.Doc2_1]?.value ?? '');
    const doc2_2Rows = parseDoc2Part2(inputTSVs[Doc.Doc2_2]?.value ?? '');
    const doc2_3Rows = parseDoc2Part3(inputTSVs[Doc.Doc2_3]?.value ?? '');
    return [...doc1Rows, ...doc2_1Rows, ...doc2_2Rows, ...doc2_3Rows];
  }, [
    inputTSVs[Doc.Doc1]?.value,
    inputTSVs[Doc.Doc2_1]?.value,
    inputTSVs[Doc.Doc2_2]?.value,
    inputTSVs[Doc.Doc2_3]?.value,
  ]);
  useEffect(() => {
    setExtraText((inputTSVs[Doc.Doc3]?.value ?? '') + (inputTSVs[Doc.Doc4]?.value ?? ''));
  }, [inputTSVs[Doc.Doc3]?.value, inputTSVs[Doc.Doc4]?.value, setExtraText]);

  const getTranslation = useCallback(
    (entry: DataEntry | undefined, fallback = true): string => {
      if (!entry) return '';
      return translationsByIndex[entry.index] ?? (fallback ? entry.english : '');
    },
    [translationsByIndex],
  );
  const setTranslation = useCallback((index: number, newTranslation: string) => {
    setTranslationsByIndex((prev) => ({ ...prev, [index]: newTranslation }));
  }, []);
  const fillTranslations = useCallback(
    (rows: RowData[]) => {
      const newTranslationsByIndex = Object.fromEntries(
        rows
          .map((row) => {
            const key = row.key;
            const entry = findDataEntry({ ext_id: key }) ?? findDataEntry({ xpath: key });
            if (entry && row.translated) return [entry.index, row.translated];
            return [];
          })
          .filter((v) => v.length > 0),
      );
      setTranslationsByIndex(newTranslationsByIndex);
      setTargetDataStatus(TargetDataStatus.Ready);
    },
    [setTranslation, sourceDataStatus],
  );

  // When the inputted data changes, refresh the data
  useEffect(() => {
    setTargetDataStatus(TargetDataStatus.InputTSVChanged);
    setAlphabetData(extractAlphabetData(tsvRows, extraText));
    fillTranslations(tsvRows);
  }, [tsvRows, extraText]);

  const dataContext: TargetDataContextType = {
    alphabet: alphabetData,
    inputTSVs,
    getTranslation,
    setTranslation,
    targetDataStatus,
  };
  return <TargetDataContext.Provider value={dataContext}>{children}</TargetDataContext.Provider>;
};

export default TargetDataProvider;
