import { useEffect, useMemo, useState } from 'react';

import ImportSource from '@data/ImportSource';

import { useURLParams } from '@settings/URLParams';

import { parseWorksheet1 } from './loadWorksheets';
import {
  parseWorksheet2Part1,
  parseWorksheet2Part2,
  parseWorksheet2Part3,
} from './ParseWorksheet2';
import { worksheetParsingText } from './validateWorksheet';
import { Worksheet, getWorksheetFileSuffix } from './Worksheet';

import type { WorksheetBundle, WorksheetKey } from './storageTypes';
import type { UseWorksheetState } from './useWorksheetState';

function useImportedWorksheets() {
  const { targetLanguage, importSource } = useURLParams();
  const [loaded, setLoaded] = useState<{ language: string; worksheets: WorksheetBundle }>({
    language: '',
    worksheets: {},
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const active = importSource === ImportSource.TSV && targetLanguage !== 'und';
  const ready = active && loaded.language === targetLanguage;
  const importedWorksheets = useMemo(
    () =>
      Object.fromEntries(
        Object.values(Worksheet).map((worksheet) => {
          const key = getWorksheetFileSuffix(worksheet) as WorksheetKey;
          const set = (content: string) =>
            setLoaded((previous) => ({
              language: targetLanguage,
              worksheets: {
                ...(previous.language === targetLanguage ? previous.worksheets : {}),
                [key]: {
                  content,
                  revision:
                    previous.language === targetLanguage
                      ? (previous.worksheets[key]?.revision ?? 0)
                      : 0,
                },
              },
            }));
          return [
            worksheet,
            {
              value: ready ? (loaded.worksheets[key]?.content ?? '') : '',
              set,
              clear: () => set(''),
            },
          ];
        }),
      ) as Record<Worksheet, UseWorksheetState>,
    [loaded, ready, targetLanguage],
  );

  useEffect(() => {
    setError(null);
    setLoaded({ language: '', worksheets: {} });
    if (!active) {
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/worksheets/${encodeURIComponent(targetLanguage)}`, {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? 'Unable to load worksheets.');
        if (!controller.signal.aborted)
          setLoaded({ language: targetLanguage, worksheets: body.worksheets });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [active, targetLanguage, reload]);

  const doc1State = importedWorksheets[Worksheet.W1];
  const doc2Part1State = importedWorksheets[Worksheet.W2_1];
  const doc2Part2State = importedWorksheets[Worksheet.W2_2];
  const doc2Part3State = importedWorksheets[Worksheet.W2_3];
  const doc3State = importedWorksheets[Worksheet.W3];
  const doc4State = importedWorksheets[Worksheet.W4];

  // Automatically updates the TSV datasets when input changes
  const w1Value = doc1State.value ?? '';
  const doc2Part1Value = doc2Part1State.value ?? '';
  const doc2Part2Value = doc2Part2State.value ?? '';
  const doc2Part3Value = doc2Part3State.value ?? '';
  const doc3Value = doc3State.value ?? '';
  const doc4Value = doc4State.value ?? '';
  const tsvRows = useMemo(() => {
    const w1Rows = parseWorksheet1(worksheetParsingText(w1Value));
    const w2_1Rows = parseWorksheet2Part1(worksheetParsingText(doc2Part1Value));
    const w2_2Rows = parseWorksheet2Part2(worksheetParsingText(doc2Part2Value));
    const w2_3Rows = parseWorksheet2Part3(worksheetParsingText(doc2Part3Value));
    return [...w1Rows, ...w2_1Rows, ...w2_2Rows, ...w2_3Rows];
  }, [w1Value, doc2Part1Value, doc2Part2Value, doc2Part3Value]);
  const extraText = doc3Value + doc4Value;
  return {
    importedWorksheets,
    tsvRows,
    extraText,
    worksheetError: error,
    worksheetsLoading: active && (loading || (!ready && !error)),
    worksheetRevisions: ready
      ? Object.fromEntries(
          Object.entries(loaded.worksheets).map(([key, value]) => [key, value?.revision]),
        )
      : {},
    reloadWorksheets: () => setReload((value) => value + 1),
  };
}

export default useImportedWorksheets;
