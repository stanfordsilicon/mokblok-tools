import { useCallback, useEffect, useState } from 'react';

import { useDataContext } from '@data/DataContext';
import { Doc, getDocFileSuffix, getDocFileType } from '@data/Doc';
import { loadInputText, parseInputTSV } from '@data/LoadInputData';

import { useSettings } from '@settings/Settings';

import InputDocSelector from './InputDocSelector';
import InputLanguageSelector, { LoadableLanguage } from './InputLanguageSelector';
import InputTextArea from './InputTextArea';
import useDocTextBlobs from './useDocTextBlobs';

const InputBody = () => {
  const { setRows, setExtraText } = useDataContext();
  const { targetLanguage } = useSettings();
  const texts = useDocTextBlobs();
  const [inputDoc, setInputDoc] = useState<Doc>(Doc.Doc1);

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
    setRows(parseInputTSV(texts[Doc.Doc1].value));
  }, [texts[Doc.Doc1].value, setRows]);
  useEffect(() => {
    setExtraText(texts[Doc.Doc3].value);
  }, [texts[Doc.Doc3].value, setExtraText]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5em' }}>
      <h3 style={{ margin: 0 }}>Language</h3>
      <InputLanguageSelector onClickLanguage={loadLanguageData} clearInputText={clearInputText} />
      <h3 style={{ margin: 0 }}>Input Files</h3>
      <InputDocSelector curDoc={inputDoc} setDoc={(doc) => setInputDoc(doc)} texts={texts} />
      <InputTextArea doc={inputDoc} texts={texts} />
    </div>
  );
};

export default InputBody;
