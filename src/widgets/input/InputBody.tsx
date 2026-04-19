import { useCallback, useEffect, useState } from 'react';

import { useDataContext } from '@data/DataContext';
import { Doc, getDocFileSuffix, getDocFileType } from '@data/Doc';
import { loadInputText, parseInputTSV } from '@data/LoadInputData';
import { parseDoc2Part1, parseDoc2Part3 } from '@data/ParseDoc2';

import { useSettings } from '@settings/Settings';

import InputCheck from './check/InputCheck';
import InputDocSelector from './InputDocSelector';
import InputLanguageSelector, { LoadableLanguage } from './InputLanguageSelector';
import InputTextArea from './InputTextArea';
import useDocTextBlobs from './useDocTextBlobs';

const InputBody = () => {
  const { setRows, setExtraText } = useDataContext();
  const { targetLanguage } = useSettings();
  const texts = useDocTextBlobs();
  const [currentDoc, setCurrentDoc] = useState<Doc>(Doc.Doc1);

  const loadLanguageData = (lang: string) => {
    // Reload all docs
    Object.values(Doc).map((doc) => {
      const filename = `input_tsvs/${lang}_${getDocFileSuffix(doc)}.${getDocFileType(doc)}`;
      loadInputText(filename)
        .then((data) => {
          if (data) {
            texts[doc].setValue(data);
          } else {
            texts[doc].clear();
          }
        })
        .catch((e) => {
          console.error(e);
          texts[doc].clear();
        });
    });
  };
  const clearInputText = useCallback(() => {
    Object.values(Doc).forEach((doc) => texts[doc].clear());
  }, [texts]);

  // Automatically updates the processed datasets when input changes
  useEffect(() => {
    if (targetLanguage && Object.values(LoadableLanguage).find((l) => l === targetLanguage))
      loadLanguageData(targetLanguage);
  }, [targetLanguage]);
  useEffect(() => {
    const doc1Rows = parseInputTSV(texts[Doc.Doc1].value);
    const doc2_1Rows = parseDoc2Part1(texts[Doc.Doc2_1].value);
    const doc2_3Rows = parseDoc2Part3(texts[Doc.Doc2_3].value);
    setRows([...doc1Rows, ...doc2_1Rows, ...doc2_3Rows]);
  }, [
    texts[Doc.Doc1].value,
    texts[Doc.Doc2_1].value,
    texts[Doc.Doc2_2].value,
    texts[Doc.Doc2_3].value,
    setRows,
  ]);
  useEffect(() => {
    setExtraText(texts[Doc.Doc3].value + texts[Doc.Doc4].value);
  }, [texts[Doc.Doc3].value, texts[Doc.Doc4].value, setExtraText]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5em' }}>
      <h3 style={{ margin: 0 }}>Language</h3>
      <InputLanguageSelector onClickLanguage={loadLanguageData} clearInputText={clearInputText} />
      <h3 style={{ margin: 0 }}>Input Files</h3>
      <InputDocSelector curDoc={currentDoc} setDoc={(doc) => setCurrentDoc(doc)} texts={texts} />
      <InputTextArea doc={currentDoc} texts={texts} />
      <InputCheck doc={currentDoc} texts={texts} />
    </div>
  );
};

export default InputBody;
