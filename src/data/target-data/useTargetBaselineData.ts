import { useCallback, useEffect, useMemo, useState } from 'react';

import extractAlphabetFromXML from '../extractAlphabetFromXML';
import ImportSource from '../ImportSource';
import { loadCLDRXML } from '../loadCLDRXML';
import parseInheritance from '../parseInheritance';
import extractAlphabetDataFromTSV from '../worksheets/ExtractAlphabetFromTSV';

import { TargetDataStatus } from './types';

import type { AlphabetData, DataEntry } from '../DataTypes';
import type { PersistedTranslationInfo, TranslationBaseline } from './types';
import type { WorksheetRowData } from '../worksheets/WorksheetRowData';

type Props = {
  dataEntries: DataEntry[];
  extraText: string;
  findDataEntry(query: Partial<DataEntry>): DataEntry | undefined;
  getTranslationFromSourceLanguage(entry: DataEntry): string | string[];
  importSource: ImportSource;
  persistedEntries: PersistedTranslationInfo[];
  targetLanguage: string;
  tsvRows: WorksheetRowData[];
};

export default function useTargetBaselineData({
  dataEntries,
  extraText,
  findDataEntry,
  getTranslationFromSourceLanguage,
  importSource,
  targetLanguage,
  tsvRows,
}: Props) {
  const [alphabetData, setAlphabetData] = useState<AlphabetData | undefined>(undefined);
  const [targetXMLData, setTargetXMLData] = useState<Record<string, string>>({});
  const [translationBaselines, setTranslationBaseslines] = useState<
    Record<number, TranslationBaseline>
  >({});

  const makeBaselineTranslations = useCallback(() => {
    if (dataEntries.length === 0) return {};
    return dataEntries.reduce(
      (acc, entry) => {
        const source = getTranslationFromSourceLanguage(entry);
        acc[entry.index] = {
          index: entry.index,
          source: Array.isArray(source) ? source[0] : source,
        };
        return acc;
      },
      {} as Record<number, TranslationBaseline>,
    );
  }, [dataEntries, getTranslationFromSourceLanguage]);

  const fillTranslationsFromTSV = useCallback(
    (rows: WorksheetRowData[]) => {
      const translationsByIndex = makeBaselineTranslations();
      const newTranslationsByIndex = rows.reduce((acc, row) => {
        const entry = findDataEntry({ ext_id: row.key }) ?? findDataEntry({ xpath: row.key });
        if (entry && row.translated) acc[entry.index].translation = row.translated;
        return acc;
      }, translationsByIndex);
      setTranslationBaseslines(newTranslationsByIndex);
    },
    // don't refill if persistedEntries changes, because that creates a circular update
    [findDataEntry, makeBaselineTranslations],
  );

  const fillTranslationsFromXML = useCallback(
    (xmlData: Record<string, string>) => {
      const translationsByIndex = makeBaselineTranslations();
      const newTranslationsByIndex = Object.entries(xmlData).reduce((acc, [xpath, translated]) => {
        const entry = findDataEntry({ xpath });
        if (entry && translated) acc[entry.index].translation = translated;
        return acc;
      }, translationsByIndex);
      // don't refill if persistedEntries changes, because that creates a circular update
      setTranslationBaseslines(newTranslationsByIndex);
    },
    [findDataEntry, makeBaselineTranslations],
  );

  useEffect(() => {
    loadCLDRXML(targetLanguage)
      .then(parseInheritance)
      .then((data) => setTargetXMLData(data));
  }, [targetLanguage]);

  useEffect(() => {
    if (tsvRows.length === 0 || importSource !== ImportSource.TSV) return;
    setAlphabetData(extractAlphabetDataFromTSV(tsvRows, extraText));
    fillTranslationsFromTSV(tsvRows);
  }, [extraText, fillTranslationsFromTSV, importSource, tsvRows]);

  useEffect(() => {
    if (importSource !== ImportSource.XML) return;
    setAlphabetData(extractAlphabetFromXML(targetXMLData));
    fillTranslationsFromXML(targetXMLData);
  }, [fillTranslationsFromXML, importSource, targetXMLData]);

  useEffect(() => {
    if (importSource !== ImportSource.Blank) return;
    fillTranslationsFromXML({});
    setAlphabetData(undefined);
  }, [fillTranslationsFromXML, importSource]);

  const targetDataStatus = useMemo(() => {
    if (dataEntries.length === 0) return TargetDataStatus.WaitingOnSourceData;
    if (importSource === ImportSource.TSV && tsvRows.length === 0)
      return TargetDataStatus.LoadingBaselineData;
    if (importSource === ImportSource.XML && Object.keys(targetXMLData).length === 0)
      return TargetDataStatus.LoadingBaselineData;
    return TargetDataStatus.Ready;
  }, [dataEntries.length, importSource, targetXMLData, tsvRows.length]);

  return {
    alphabetData,
    setTranslationBaseslines,
    targetDataStatus,
    targetXMLData,
    translationBaselines,
  };
}
