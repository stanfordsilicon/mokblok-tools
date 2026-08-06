import { createContext, useCallback, useContext, useEffect, useState } from 'react';

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
  Initial,
  InputFileChanged,
  Ready,
}

export enum Vote {
  Unknown,
  Reject,
  Accept,
}

type TranslationInfo = {
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
  editTranslation(index: number, newTranslation: string): void;
  voteOnTranslation(index: number, newVote: Vote): void;
  editTranslationComment(index: number, comment: string): void;
  targetXMLData: Record<string, string>; // Xpath to raw translations
  targetDataStatus: TargetDataStatus;
};

export const TargetDataContext = createContext<TargetDataContextType>({
  inputTSVs: {},
  alphabet: undefined,
  getTranslation: () => '',
  getTranslationInfo: () => ({ source: '' }),
  editTranslation: () => {},
  voteOnTranslation: () => {},
  editTranslationComment: () => {},
  targetDataStatus: TargetDataStatus.Initial,
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
  const { findDataEntry } = useSourceDataContext();
  const getTranslationFromSourceLanguage = useTranslationFromSourceLanguage();
  const [targetDataStatus, setTargetDataStatus] = useState<TargetDataStatus>(
    TargetDataStatus.Initial,
  );

  const { extraText, tsvRows, inputTSVs } = useInputTSVs();
  const [alphabetData, setAlphabetData] = useState<AlphabetData | undefined>(undefined);
  const [translationInfoByIndex, setTranslationInfoByIndex] = useState<
    Record<number, TranslationInfo>
  >({});
  const [targetXMLData, setTargetXMLData] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      const data = await loadCLDRXML(targetLanguage).then(parseInheritance);
      setTargetXMLData(data);
    };
    loadData();
  }, [targetLanguage]);

  const getTranslationInfo = useCallback(
    (entry: DataEntry | undefined): TranslationInfo => {
      if (!entry) return { source: '' };
      const info = translationInfoByIndex[entry.index];
      const source = getTranslationFromSourceLanguage(entry);
      if (!info) return { source: Array.isArray(source) ? source[0] : source };
      return info;
    },
    [translationInfoByIndex, getTranslationFromSourceLanguage],
  );
  const getTranslation = useCallback(
    (entry: DataEntry | undefined, fallback = true): string => {
      const info = getTranslationInfo(entry);
      return info.edit ?? info.translation ?? (fallback ? info.source : '');
    },
    [getTranslationInfo],
  );
  const editTranslation = useCallback(
    (index: number, newTranslation: string) => {
      setTranslationInfoByIndex((prev) => {
        const prevInfo = prev[index] ?? { fallback: '' };
        return { ...prev, [index]: { ...prevInfo, edit: newTranslation } };
      });
    },
    [setTranslationInfoByIndex],
  );
  const voteOnTranslation = useCallback(
    (index: number, newVote: Vote) => {
      setTranslationInfoByIndex((prev) => {
        const prevInfo = prev[index] ?? { fallback: '' };
        return { ...prev, [index]: { ...prevInfo, vote: newVote } };
      });
    },
    [setTranslationInfoByIndex],
  );
  const editTranslationComment = useCallback(
    (index: number, comment: string) => {
      setTranslationInfoByIndex((prev) => {
        const prevInfo = prev[index] ?? { fallback: '' };
        return { ...prev, [index]: { ...prevInfo, comment } };
      });
    },
    [setTranslationInfoByIndex],
  );

  // Fill data
  const fillTranslationsFromTSV = useCallback(
    (rows: TSVRowData[]) => {
      const newTranslationsByIndex = rows.reduce(
        (acc, row) => {
          const key = row.key;
          const entry = findDataEntry({ ext_id: key }) ?? findDataEntry({ xpath: key });
          if (entry && row.translated) {
            const source = getTranslationFromSourceLanguage(entry);
            acc[entry.index] = {
              source: Array.isArray(source) ? source[0] : source,
              translation: row.translated,
            };
          }
          return acc;
        },
        {} as Record<number, TranslationInfo>,
      );
      setTranslationInfoByIndex(newTranslationsByIndex);
      setTargetDataStatus(TargetDataStatus.Ready);
    },
    [
      findDataEntry,
      setTranslationInfoByIndex,
      setTargetDataStatus,
      getTranslationFromSourceLanguage,
    ],
  );
  const fillTranslationsFromXML = useCallback(
    (xmlData: Record<string, string>) => {
      const newTranslationsByIndex = Object.entries(xmlData).reduce(
        (acc, [xpath, translated]) => {
          const entry = findDataEntry({ xpath });
          if (entry && translated)
            acc[entry.index] = { source: entry.english, translation: translated };
          return acc;
        },
        {} as Record<number, TranslationInfo>,
      );
      setTranslationInfoByIndex(newTranslationsByIndex);
      setTargetDataStatus(TargetDataStatus.Ready);
    },
    [findDataEntry],
  );

  // When the inputted data changes, refresh the data
  useEffect(() => {
    if (tsvRows.length === 0 || inputSource !== InputSource.TSV) return;
    setTargetDataStatus(TargetDataStatus.InputFileChanged);
    setAlphabetData(extractAlphabetDataFromTSV(tsvRows, extraText));
    fillTranslationsFromTSV(tsvRows);
  }, [extraText, fillTranslationsFromTSV, inputSource, tsvRows]);
  useEffect(() => {
    if (inputSource !== InputSource.XML) return;
    setTargetDataStatus(TargetDataStatus.InputFileChanged);
    setAlphabetData(extractAlphabetFromXML(targetXMLData));
    fillTranslationsFromXML(targetXMLData);
  }, [fillTranslationsFromXML, inputSource, targetXMLData]);
  useEffect(() => {
    if (inputSource !== InputSource.Blank) return;
    fillTranslationsFromXML({});
    setAlphabetData(undefined);
    setTargetDataStatus(TargetDataStatus.Ready);
  }, [fillTranslationsFromXML, inputSource, tsvRows]);

  const dataContext: TargetDataContextType = {
    alphabet: alphabetData,
    inputTSVs,
    getTranslation,
    getTranslationInfo,
    editTranslation,
    voteOnTranslation,
    editTranslationComment,
    targetDataStatus,
    targetXMLData,
  };
  return <TargetDataContext.Provider value={dataContext}>{children}</TargetDataContext.Provider>;
};

export default TargetDataProvider;
