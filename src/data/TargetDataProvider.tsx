import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { useURLParams } from '@settings/URLParams';

import InputSource from '@widgets/input/InputSource';

import { type AlphabetData, type DataEntry } from './DataTypes';
import { loadCLDRXML } from './loadCLDRXML';
import parseInheritance from './parseInheritance';
import { useSourceDataContext } from './SourceDataProvider';
import { Doc } from './tsvdocs/Doc';
import extractAlphabetData from './tsvdocs/ExtractAlphabet';
import useInputTSVs from './tsvdocs/useInputTSVs';

import type { TSVRowData } from './tsvdocs/TSVRowData';
import type { UseTSVState } from './tsvdocs/useTSVState';

export enum TargetDataStatus {
  Initial,
  InputFileChanged,
  Ready,
}

export type TargetDataContextType = {
  alphabet?: AlphabetData;
  inputTSVs: Partial<Record<Doc, UseTSVState>>;
  getTranslation(entry: DataEntry | undefined, fallback?: boolean): string;
  setTranslation(index: number, newTranslation: string): void;
  targetDataStatus: TargetDataStatus;
};

export const TargetDataContext = createContext<TargetDataContextType>({
  inputTSVs: {},
  alphabet: undefined,
  getTranslation: () => '',
  setTranslation: () => {},
  targetDataStatus: TargetDataStatus.Initial,
});

export const useTargetDataContext = () => {
  const context = useContext(TargetDataContext);
  if (!context) throw new Error('useTargetDataContext must be used within a TargetDataProvider');
  return context;
};

/**
 * This class controls data for the target language -- the language we want to collect translations for.
 */
const TargetDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { targetLanguage, inputSource } = useURLParams();
  const { sourceDataStatus, findDataEntry } = useSourceDataContext();
  const [targetDataStatus, setTargetDataStatus] = useState<TargetDataStatus>(
    TargetDataStatus.Initial,
  );

  const { extraText, tsvRows, inputTSVs } = useInputTSVs();
  const [alphabetData, setAlphabetData] = useState<AlphabetData | undefined>(undefined);
  const [translationsByIndex, setTranslationsByIndex] = useState<Record<number, string>>({});
  const [targetXMLData, setTargetXMLData] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      const data = await loadCLDRXML(targetLanguage).then(parseInheritance);
      setTargetXMLData(data);
    };
    loadData();
  }, []);

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
  const fillTranslationsFromTSV = useCallback(
    (rows: TSVRowData[]) => {
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
  const fillTranslationsFromXML = useCallback(
    (xmlData: Record<string, string>) => {
      const newTranslationsByIndex = Object.fromEntries(
        Object.entries(xmlData)
          .map(([xpath, translated]) => {
            const entry = findDataEntry({ xpath });
            if (entry && translated) return [entry.index, translated];
            return [];
          })
          .filter((v) => v.length > 0),
      );
      setTranslationsByIndex(newTranslationsByIndex);
      setTargetDataStatus(TargetDataStatus.Ready);
    },
    [findDataEntry],
  );

  // When the inputted data changes, refresh the data
  useEffect(() => {
    if (tsvRows.length === 0 || inputSource != InputSource.TSV) return;
    setTargetDataStatus(TargetDataStatus.InputFileChanged);
    setAlphabetData(extractAlphabetData(tsvRows, extraText));
    fillTranslationsFromTSV(tsvRows);
  }, [tsvRows, extraText, inputSource]);
  useEffect(() => {
    if (inputSource === InputSource.XML) {
      setTargetDataStatus(TargetDataStatus.InputFileChanged);
      fillTranslationsFromXML(targetXMLData);
    }
  }, [targetXMLData, inputSource]);
  useEffect(() => {
    if (inputSource === InputSource.Blank) {
      fillTranslationsFromXML({});
    }
  }, [tsvRows, inputSource]);

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
