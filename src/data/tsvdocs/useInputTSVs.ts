import { useCallback, useEffect, useMemo, useState } from 'react';

import { useURLParams } from '@settings/URLParams';

import { LoadableLanguage } from '@widgets/input/InputLanguageSelector';
import InputSource from '@widgets/input/InputSource';

import { Doc, getDocFileSuffix, getDocFileType } from './Doc';
import { loadInputText, parseDoc1TSV } from './LoadInputData';
import { parseDoc2Part1, parseDoc2Part2, parseDoc2Part3 } from './ParseDoc2';
import useTSVState from './useTSVState';

import type { UseTSVState } from './useTSVState';

function useInputTSVs() {
  const { targetLanguage, inputSource } = useURLParams();
  const [extraText, setExtraText] = useState<string>('');
  const inputTSVs: Record<Doc, UseTSVState> = {
    [Doc.Doc1]: useTSVState(),
    [Doc.Doc2_1]: useTSVState(''),
    [Doc.Doc2_2]: useTSVState(''),
    [Doc.Doc2_3]: useTSVState(''),
    [Doc.Doc3]: useTSVState(''),
    [Doc.Doc4]: useTSVState(''),
  };

  // TSV input files
  const loadTSVData = useCallback(
    (lang: string) => {
      if (
        inputSource !== InputSource.TSV ||
        !Object.values(LoadableLanguage).find((l) => l === targetLanguage) ||
        !targetLanguage
      ) {
        Object.values(Doc).forEach((doc) => inputTSVs[doc].clear());
        return;
      }

      // Reload all docs
      Object.values(Doc).map((doc) => {
        const filename = `/input_tsvs/${lang}_${getDocFileSuffix(doc)}.${getDocFileType(doc)}`;
        loadInputText(filename)
          .then((data) => {
            if (data) inputTSVs[doc].set(data);
            else inputTSVs[doc].clear();
          })
          .catch((e) => {
            console.error(e);
            inputTSVs[doc].set('');
          });
      });
    },
    [inputTSVs, inputSource],
  );
  // Trigger it when the target language changes
  useEffect(() => loadTSVData(targetLanguage), [targetLanguage, loadTSVData]);

  // Automatically updates the TSV datasets when input changes
  const tsvRows = useMemo(() => {
    const doc1Rows = parseDoc1TSV(inputTSVs[Doc.Doc1].value ?? '');
    const doc2_1Rows = parseDoc2Part1(inputTSVs[Doc.Doc2_1].value ?? '');
    const doc2_2Rows = parseDoc2Part2(inputTSVs[Doc.Doc2_2].value ?? '');
    const doc2_3Rows = parseDoc2Part3(inputTSVs[Doc.Doc2_3].value ?? '');
    return [...doc1Rows, ...doc2_1Rows, ...doc2_2Rows, ...doc2_3Rows];
  }, [
    inputTSVs[Doc.Doc1].value,
    inputTSVs[Doc.Doc2_1].value,
    inputTSVs[Doc.Doc2_2].value,
    inputTSVs[Doc.Doc2_3].value,
  ]);
  useEffect(() => {
    setExtraText((inputTSVs[Doc.Doc3].value ?? '') + (inputTSVs[Doc.Doc4].value ?? ''));
  }, [inputTSVs[Doc.Doc3].value, inputTSVs[Doc.Doc4].value, setExtraText]);

  return { inputTSVs, tsvRows, extraText };
}

export default useInputTSVs;
