import { useSession } from 'next-auth/react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useURLParams } from '@settings/URLParams';

import { type AlphabetData, type DataEntry } from './DataTypes';
import extractAlphabetFromXML from './extractAlphabetFromXML';
import ImportSource from './ImportSource';
import { loadCLDRXML } from './loadCLDRXML';
import parseInheritance from './parseInheritance';
import useTranslationFromSourceLanguage from './sourcedata/useTranslationFromSourceLanguage';
import { useSourceDataContext } from './SourceDataProvider';
import extractAlphabetDataFromTSV from './worksheets/ExtractAlphabetFromTSV';
import useImportedWorksheets from './worksheets/useImportedWorksheets';
import { Worksheet } from './worksheets/Worksheet';

import type { UseWorksheetState } from './worksheets/useWorksheetState';
import type { WorksheetRowData } from './worksheets/WorksheetRowData';

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

type PersistedTranslationInfo = Pick<TranslationInfo, 'index' | 'edit' | 'vote' | 'comment'>;

type ReviewDraftResponse = {
  success?: boolean;
  entries?: PersistedTranslationInfo[];
};

export type TargetDataContextType = {
  alphabet?: AlphabetData;
  importedWorksheets: Partial<Record<Worksheet, UseWorksheetState>>;
  getTranslation(entry: DataEntry | undefined, fallback?: boolean): string;
  getTranslationInfo(entry: DataEntry | undefined): TranslationInfo;
  translations: Record<number, TranslationInfo>;
  editTranslation(index: number, update: Partial<TranslationInfo>): void;
  editTranslations(indices: number[], update: Partial<TranslationInfo>): void;
  targetXMLData: Record<string, string>; // Xpath to raw translations
  targetDataStatus: TargetDataStatus;
};

export const TargetDataContext = createContext<TargetDataContextType>({
  importedWorksheets: {},
  alphabet: undefined,
  getTranslation: () => '',
  getTranslationInfo: () => ({ index: -1, source: '', vote: Vote.Unknown }),
  translations: {},
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

/**
 * This class controls data for the target language -- the language we want to collect translations for.
 */
const TargetDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { targetLanguage, importSource } = useURLParams();
  const { status: sessionStatus } = useSession();
  const { findDataEntry, dataEntries } = useSourceDataContext();
  const getTranslationFromSourceLanguage = useTranslationFromSourceLanguage();

  const { extraText, tsvRows, importedWorksheets } = useImportedWorksheets();
  const [alphabetData, setAlphabetData] = useState<AlphabetData | undefined>(undefined);
  const [translations, setTranslations] = useState<Record<number, TranslationInfo>>({});
  const [targetXMLData, setTargetXMLData] = useState<Record<string, string>>({});
  const [persistedEntries, setPersistedEntries] = useState<PersistedTranslationInfo[]>([]);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Getters & setters of the data
  const getTranslationInfo = useCallback(
    (entry: DataEntry | undefined): TranslationInfo => {
      if (!entry || !translations[entry.index])
        return { index: -1, source: '', vote: Vote.Unknown };
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
  const editTranslations = useCallback(
    (indices: number[], update: Partial<TranslationInfo>) => {
      setTranslations((prev) => {
        const newTranslations = { ...prev };
        for (const index of indices) {
          if (!newTranslations[index]) continue;
          newTranslations[index] = { ...newTranslations[index], ...update };
        }
        return newTranslations;
      });
    },
    [setTranslations],
  );

  const applyPersistedEntries = useCallback(
    (
      baseTranslations: Record<number, TranslationInfo>,
      draftEntries: PersistedTranslationInfo[],
    ): Record<number, TranslationInfo> => {
      if (draftEntries.length === 0) return baseTranslations;

      const nextTranslations = { ...baseTranslations };
      for (const entry of draftEntries) {
        if (!nextTranslations[entry.index]) continue;
        nextTranslations[entry.index] = {
          ...nextTranslations[entry.index],
          ...(entry.edit !== undefined ? { edit: entry.edit } : {}),
          ...(entry.vote !== undefined ? { vote: entry.vote } : {}),
          ...(entry.comment !== undefined ? { comment: entry.comment } : {}),
        };
      }
      return nextTranslations;
    },
    [],
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
    (rows: WorksheetRowData[]) => {
      const translationsByIndex = makeBaselineTranslations();
      if (!translationsByIndex) return;
      // Add the translations from the TSV
      const newTranslationsByIndex = rows.reduce((acc, row) => {
        const entry = findDataEntry({ ext_id: row.key }) ?? findDataEntry({ xpath: row.key });
        if (entry && row.translated) acc[entry.index].translation = row.translated;
        return acc;
      }, translationsByIndex);
      setTranslations(applyPersistedEntries(newTranslationsByIndex, persistedEntries));
    },
    [
      applyPersistedEntries,
      makeBaselineTranslations,
      findDataEntry,
      persistedEntries,
      setTranslations,
    ],
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
      setTranslations(applyPersistedEntries(newTranslationsByIndex, persistedEntries));
    },
    [
      applyPersistedEntries,
      findDataEntry,
      persistedEntries,
      setTranslations,
      makeBaselineTranslations,
    ],
  );

  // Always load the CLDR data, reload when the target language changes
  useEffect(() => {
    loadCLDRXML(targetLanguage)
      .then(parseInheritance)
      .then((data) => setTargetXMLData(data));
  }, [targetLanguage]);

  useEffect(() => {
    if (sessionStatus !== 'authenticated' || !targetLanguage) {
      setPersistedEntries([]);
      setIsDraftLoaded(sessionStatus !== 'loading');
      return;
    }

    let cancelled = false;
    setPersistedEntries([]);
    setIsDraftLoaded(false);

    void fetch(`/api/review-drafts/${encodeURIComponent(targetLanguage)}`)
      .then(async (response) => {
        const body = (await response.json().catch(() => null)) as ReviewDraftResponse | null;
        if (!response.ok || !body?.success) return [];
        return Array.isArray(body.entries) ? body.entries : [];
      })
      .catch(() => [])
      .then((entries) => {
        if (cancelled) return;
        setPersistedEntries(entries);
        setIsDraftLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [sessionStatus, targetLanguage]);

  // When the inputted data changes, refresh the data
  useEffect(() => {
    if (tsvRows.length === 0 || importSource !== ImportSource.TSV) return;
    setAlphabetData(extractAlphabetDataFromTSV(tsvRows, extraText));
    fillTranslationsFromTSV(tsvRows);
  }, [dataEntries.length, extraText, fillTranslationsFromTSV, importSource, tsvRows]);
  useEffect(() => {
    if (importSource !== ImportSource.XML) return;
    setAlphabetData(extractAlphabetFromXML(targetXMLData));
    fillTranslationsFromXML(targetXMLData);
  }, [dataEntries.length, fillTranslationsFromXML, importSource, targetXMLData]);
  useEffect(() => {
    if (importSource !== ImportSource.Blank) return;
    fillTranslationsFromXML({});
    setAlphabetData(undefined);
  }, [fillTranslationsFromXML, importSource, tsvRows]);

  useEffect(() => {
    if (!isDraftLoaded) return;
    setTranslations((prev) => applyPersistedEntries(prev, persistedEntries));
  }, [applyPersistedEntries, isDraftLoaded, persistedEntries]);

  const targetDataStatus = useMemo(() => {
    if (dataEntries.length === 0) return TargetDataStatus.WaitingOnSourceData;
    if (importSource === ImportSource.TSV && tsvRows.length === 0)
      return TargetDataStatus.LoadingBaselineData;
    if (importSource === ImportSource.XML && Object.keys(targetXMLData).length === 0)
      return TargetDataStatus.LoadingBaselineData;
    return TargetDataStatus.Ready;
  }, [dataEntries.length, importSource, tsvRows, targetXMLData]);

  const changedEntries = useMemo(
    () =>
      Object.values(translations)
        .filter(
          (entry) =>
            entry.edit !== undefined ||
            entry.comment !== undefined ||
            (entry.vote ?? Vote.Unknown) !== Vote.Unknown,
        )
        .map((entry) => ({
          index: entry.index,
          ...(entry.edit !== undefined ? { edit: entry.edit } : {}),
          ...(entry.comment !== undefined ? { comment: entry.comment } : {}),
          ...((entry.vote ?? Vote.Unknown) !== Vote.Unknown ? { vote: entry.vote } : {}),
        })),
    [translations],
  );

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    if (
      sessionStatus !== 'authenticated' ||
      !targetLanguage ||
      !isDraftLoaded ||
      targetDataStatus !== TargetDataStatus.Ready
    ) {
      return;
    }

    saveTimeoutRef.current = setTimeout(() => {
      void fetch(`/api/review-drafts/${encodeURIComponent(targetLanguage)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: changedEntries }),
      }).catch(() => {});
    }, 800);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [changedEntries, isDraftLoaded, sessionStatus, targetDataStatus, targetLanguage]);

  const dataContext: TargetDataContextType = {
    alphabet: alphabetData,
    importedWorksheets,
    getTranslation,
    getTranslationInfo,
    editTranslation,
    editTranslations,
    translations,
    targetDataStatus,
    targetXMLData,
  };
  return <TargetDataContext.Provider value={dataContext}>{children}</TargetDataContext.Provider>;
};

export default TargetDataProvider;
