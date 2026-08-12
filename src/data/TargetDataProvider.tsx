import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useURLParams } from '@settings/URLParams';

import InputSource from '@widgets/input/InputSource';

import { type AlphabetData, type DataEntry } from './DataTypes';
import extractAlphabetFromXML from './extractAlphabetFromXML';
import { loadCLDRXML } from './loadCLDRXML';
import parseInheritance from './parseInheritance';
import useTranslationFromSourceLanguage from './sourcedata/useTranslationFromSourceLanguage';
import { useSourceDataContext } from './SourceDataProvider';
import { Doc } from './tsvdocs/Doc';
import extractAlphabetDataFromTSV from './tsvdocs/ExtractAlphabetFromTSV';
import useInputTSVs from './tsvdocs/useInputTSVs';

import type { TSVRowData } from './tsvdocs/TSVRowData';
import type { UseTSVState } from './tsvdocs/useTSVState';

export enum TargetDataStatus {
  WaitingOnSourceData,
  LoadingBaselineData,
  Ready,
}

export enum Vote {
  Unknown,
  Reject,
  Accept,
}

type TranslationInfo = {
  index: number;
  source: string;
  translation?: string;
  edit?: string;
  vote?: Vote;
  comment?: string;
};

export type TargetDataContextType = {
  alphabet?: AlphabetData;
  inputTSVs: Partial<Record<Doc, UseTSVState>>;
  getTranslation(entry: DataEntry | undefined, fallback?: boolean): string;
  getTranslationInfo(entry: DataEntry | undefined): TranslationInfo;
  translations: Record<number, TranslationInfo>;
  editTranslation(index: number, update: Partial<TranslationInfo>): void;
  targetXMLData: Record<string, string>; // Xpath to raw translations
  targetDataStatus: TargetDataStatus;
};

export const TargetDataContext = createContext<TargetDataContextType>({
  inputTSVs: {},
  alphabet: undefined,
  getTranslation: () => '',
  getTranslationInfo: () => ({ index: -1, source: '', vote: Vote.Unknown }),
  translations: {},
  editTranslation: () => {},
  targetDataStatus: TargetDataStatus.LoadingBaselineData,
  targetXMLData: {},
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
  const { findDataEntry, dataEntries } = useSourceDataContext();
  const getTranslationFromSourceLanguage = useTranslationFromSourceLanguage();

  const { extraText, tsvRows, inputTSVs } = useInputTSVs();
  const [alphabetData, setAlphabetData] = useState<AlphabetData | undefined>(undefined);
  const [translations, setTranslations] = useState<Record<number, TranslationInfo>>({});
  const [targetXMLData, setTargetXMLData] = useState<Record<string, string>>({});

  // Getters & setters of the data
  const getTranslationInfo = useCallback(
    (entry: DataEntry | undefined): TranslationInfo => {
      if (!entry) return { index: -1, source: '', vote: Vote.Unknown };
      return translations[entry.index];
    },
    [translations],
  );
  const getTranslation = useCallback(
    (entry: DataEntry | undefined, fallback = true): string => {
      const info = getTranslationInfo(entry);
      if (!info) return '';
      return info.edit ?? info.translation ?? (fallback ? info.source : '');
    },
    [getTranslationInfo],
  );
  const editTranslation = useCallback(
    (index: number, update: Partial<TranslationInfo>) => {
      setTranslations((prev) => {
        if (!prev[index]) return prev;
        // return a new object? could be computationally expensive
        return { ...prev, [index]: { ...prev[index], ...update } };
      });
    },
    [setTranslations],
  );

  // Fill data
  const makeBaselineTranslations = useCallback(() => {
    if (dataEntries.length === 0) return {};
    return dataEntries.reduce(
      (acc, entry) => {
        const source = getTranslationFromSourceLanguage(entry);
        acc[entry.index] = {
          index: entry.index,
          source: Array.isArray(source) ? source[0] : source,
          vote: Vote.Unknown,
        };
        return acc;
      },
      {} as Record<number, TranslationInfo>,
    );
  }, [dataEntries, getTranslationFromSourceLanguage]);
  const fillTranslationsFromTSV = useCallback(
    (rows: TSVRowData[]) => {
      const translationsByIndex = makeBaselineTranslations();
      if (!translationsByIndex) return;
      // Add the translations from the TSV
      const newTranslationsByIndex = rows.reduce((acc, row) => {
        const entry = findDataEntry({ ext_id: row.key }) ?? findDataEntry({ xpath: row.key });
        if (entry && row.translated) acc[entry.index].translation = row.translated;
        return acc;
      }, translationsByIndex);
      setTranslations(newTranslationsByIndex);
    },
    [makeBaselineTranslations, findDataEntry, setTranslations],
  );
  const fillTranslationsFromXML = useCallback(
    (xmlData: Record<string, string>) => {
      const translationsByIndex = makeBaselineTranslations();
      if (!translationsByIndex) return;
      const newTranslationsByIndex = Object.entries(xmlData).reduce((acc, [xpath, translated]) => {
        const entry = findDataEntry({ xpath });
        if (entry && translated) acc[entry.index].translation = translated;
        return acc;
      }, translationsByIndex);
      setTranslations(newTranslationsByIndex);
    },
    [findDataEntry, setTranslations, makeBaselineTranslations],
  );

  // Always load the CLDR data, reload when the target language changes
  useEffect(() => {
    loadCLDRXML(targetLanguage)
      .then(parseInheritance)
      .then((data) => setTargetXMLData(data));
  }, [targetLanguage]);

  // When the inputted data changes, refresh the data
  useEffect(() => {
    if (tsvRows.length === 0 || inputSource !== InputSource.TSV) return;
    setAlphabetData(extractAlphabetDataFromTSV(tsvRows, extraText));
    fillTranslationsFromTSV(tsvRows);
  }, [dataEntries.length, extraText, fillTranslationsFromTSV, inputSource, tsvRows]);
  useEffect(() => {
    if (inputSource !== InputSource.XML) return;
    setAlphabetData(extractAlphabetFromXML(targetXMLData));
    fillTranslationsFromXML(targetXMLData);
  }, [dataEntries.length, fillTranslationsFromXML, inputSource, targetXMLData]);
  useEffect(() => {
    if (inputSource !== InputSource.Blank) return;
    fillTranslationsFromXML({});
    setAlphabetData(undefined);
  }, [fillTranslationsFromXML, inputSource, tsvRows]);

  const targetDataStatus = useMemo(() => {
    if (dataEntries.length === 0) return TargetDataStatus.WaitingOnSourceData;
    if (inputSource === InputSource.TSV && tsvRows.length === 0)
      return TargetDataStatus.LoadingBaselineData;
    if (inputSource === InputSource.XML && Object.keys(targetXMLData).length === 0)
      return TargetDataStatus.LoadingBaselineData;
    return TargetDataStatus.Ready;
  }, [dataEntries.length, inputSource, tsvRows, targetXMLData]);

  const dataContext: TargetDataContextType = {
    alphabet: alphabetData,
    inputTSVs,
    getTranslation,
    getTranslationInfo,
    editTranslation,
    translations,
    targetDataStatus,
    targetXMLData,
  };
  return <TargetDataContext.Provider value={dataContext}>{children}</TargetDataContext.Provider>;
};

export default TargetDataProvider;
