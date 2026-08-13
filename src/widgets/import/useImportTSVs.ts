import { useEffect, useMemo, useState } from 'react';

import TargetLanguageOptions from '@settings/selectors/TargetLanguageOptions';
import { useURLParams } from '@settings/URLParams';

import ImportSource from '@widgets/import/ImportSource';

import { Doc, getDocFileSuffix, getDocFileType } from '../../data/tsvdocs/Doc';
import { loadInputText, parseDoc1TSV } from '../../data/tsvdocs/LoadInputData';
import { parseDoc2Part1, parseDoc2Part2, parseDoc2Part3 } from '../../data/tsvdocs/ParseDoc2';
import useTSVState from '../../data/tsvdocs/useTSVState';

import type { UseTSVState } from '../../data/tsvdocs/useTSVState';

function useImportTSVs() {
  const { targetLanguage, importSource } = useURLParams();
  const [extraText, setExtraText] = useState<string>('');
  const doc1State = useTSVState();
  const doc2Part1State = useTSVState('');
  const doc2Part2State = useTSVState('');
  const doc2Part3State = useTSVState('');
  const doc3State = useTSVState('');
  const doc4State = useTSVState('');

  // Trigger TSV reloads when the input mode or target language changes.
  useEffect(() => {
    if (
      importSource !== ImportSource.TSV ||
      !TargetLanguageOptions[ImportSource.TSV].includes(targetLanguage) ||
      !targetLanguage
    ) {
      doc1State.clear();
      doc2Part1State.clear();
      doc2Part2State.clear();
      doc2Part3State.clear();
      doc3State.clear();
      doc4State.clear();
      return;
    }

    const docStates: Array<[Doc, UseTSVState]> = [
      [Doc.Doc1, doc1State],
      [Doc.Doc2_1, doc2Part1State],
      [Doc.Doc2_2, doc2Part2State],
      [Doc.Doc2_3, doc2Part3State],
      [Doc.Doc3, doc3State],
      [Doc.Doc4, doc4State],
    ];

    docStates.forEach(([doc, state]) => {
      const filename = `/input_tsvs/${targetLanguage}_${getDocFileSuffix(doc)}.${getDocFileType(doc)}`;
      loadInputText(filename)
        .then((data) => {
          if (data) state.set(data);
          else state.clear();
        })
        .catch((e) => {
          console.error(e);
          state.set('');
        });
    });
  }, [
    doc1State,
    doc2Part1State,
    doc2Part2State,
    doc2Part3State,
    doc3State,
    doc4State,
    importSource,
    targetLanguage,
  ]);

  // Automatically updates the TSV datasets when input changes
  const doc1Value = doc1State.value ?? '';
  const doc2Part1Value = doc2Part1State.value ?? '';
  const doc2Part2Value = doc2Part2State.value ?? '';
  const doc2Part3Value = doc2Part3State.value ?? '';
  const doc3Value = doc3State.value ?? '';
  const doc4Value = doc4State.value ?? '';
  const tsvRows = useMemo(() => {
    const doc1Rows = parseDoc1TSV(doc1Value);
    const doc2_1Rows = parseDoc2Part1(doc2Part1Value);
    const doc2_2Rows = parseDoc2Part2(doc2Part2Value);
    const doc2_3Rows = parseDoc2Part3(doc2Part3Value);
    return [...doc1Rows, ...doc2_1Rows, ...doc2_2Rows, ...doc2_3Rows];
  }, [doc1Value, doc2Part1Value, doc2Part2Value, doc2Part3Value]);
  useEffect(() => {
    setExtraText(doc3Value + doc4Value);
  }, [doc3Value, doc4Value]);

  const inputTSVs: Record<Doc, UseTSVState> = useMemo(
    () => ({
      [Doc.Doc1]: doc1State,
      [Doc.Doc2_1]: doc2Part1State,
      [Doc.Doc2_2]: doc2Part2State,
      [Doc.Doc2_3]: doc2Part3State,
      [Doc.Doc3]: doc3State,
      [Doc.Doc4]: doc4State,
    }),
    [doc1State, doc2Part1State, doc2Part2State, doc2Part3State, doc3State, doc4State],
  );

  return { inputTSVs, tsvRows, extraText };
}

export default useImportTSVs;
