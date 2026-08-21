import { useEffect, useMemo, useState } from 'react';

import ImportSource from '@data/ImportSource';

import { PreloadableTSVLanguages } from '@settings/selectors/TargetLanguageOptions';
import { useURLParams } from '@settings/URLParams';

import { loadWorksheet, parseWorksheet1 } from './loadWorksheets';
import {
  parseWorksheet2Part1,
  parseWorksheet2Part2,
  parseWorksheet2Part3,
} from './ParseWorksheet2';
import useWorksheetState, { UseWorksheetState } from './useWorksheetState';
import { Worksheet, getWorksheetFileSuffix, getWorksheetFileType } from './Worksheet';

function useImportedWorksheets() {
  const { targetLanguage, importSource } = useURLParams();
  const [extraText, setExtraText] = useState<string>('');

  const doc1State = useWorksheetState();
  const doc2Part1State = useWorksheetState('');
  const doc2Part2State = useWorksheetState('');
  const doc2Part3State = useWorksheetState('');
  const doc3State = useWorksheetState('');
  const doc4State = useWorksheetState('');
  const importedWorksheets: Record<Worksheet, UseWorksheetState> = useMemo(
    () => ({
      [Worksheet.W1]: doc1State,
      [Worksheet.W2_1]: doc2Part1State,
      [Worksheet.W2_2]: doc2Part2State,
      [Worksheet.W2_3]: doc2Part3State,
      [Worksheet.W3]: doc3State,
      [Worksheet.W4]: doc4State,
    }),
    [doc1State, doc2Part1State, doc2Part2State, doc2Part3State, doc3State, doc4State],
  );

  // Trigger TSV reloads when the input mode or target language changes.
  useEffect(() => {
    if (
      importSource !== ImportSource.TSV ||
      !PreloadableTSVLanguages.includes(targetLanguage) ||
      !targetLanguage
    ) {
      Object.values(importedWorksheets).forEach((state) => state.clear());
      return;
    }

    Object.entries(importedWorksheets).forEach(([doc, state]) => {
      const filename = `/input_tsvs/${targetLanguage}_${getWorksheetFileSuffix(doc as Worksheet)}.${getWorksheetFileType(doc as Worksheet)}`;
      loadWorksheet(filename)
        .then((data) => {
          if (data) state.set(data);
          else state.clear();
        })
        .catch((e) => {
          console.error(e);
          state.clear();
        });
    });
  }, [importedWorksheets, importSource, targetLanguage]);

  // Automatically updates the TSV datasets when input changes
  const w1Value = doc1State.value ?? '';
  const doc2Part1Value = doc2Part1State.value ?? '';
  const doc2Part2Value = doc2Part2State.value ?? '';
  const doc2Part3Value = doc2Part3State.value ?? '';
  const doc3Value = doc3State.value ?? '';
  const doc4Value = doc4State.value ?? '';
  const tsvRows = useMemo(() => {
    const w1Rows = parseWorksheet1(w1Value);
    const w2_1Rows = parseWorksheet2Part1(doc2Part1Value);
    const w2_2Rows = parseWorksheet2Part2(doc2Part2Value);
    const w2_3Rows = parseWorksheet2Part3(doc2Part3Value);
    return [...w1Rows, ...w2_1Rows, ...w2_2Rows, ...w2_3Rows];
  }, [w1Value, doc2Part1Value, doc2Part2Value, doc2Part3Value]);
  useEffect(() => {
    setExtraText(doc3Value + doc4Value);
  }, [doc3Value, doc4Value]);

  return { importedWorksheets, tsvRows, extraText };
}

export default useImportedWorksheets;
