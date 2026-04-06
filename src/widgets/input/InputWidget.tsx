import { useCallback, useEffect, useRef, useState } from 'react';

import { useDataContext } from '@data/DataContext';
import { Doc, getDocFileSuffix } from '@data/Doc';
import { loadInputText, parseInputTSV } from '@data/LoadInputData';

import { useSettings } from '@settings/Settings';
import useStoredParams from '@settings/useStoredParams';

import InputCheck from './InputCheck';
import InputDocSelector from './InputDocSelector';
import InputLanguageSelector from './InputLanguageSelector';

export enum LoadableLanguage {
  Abron = 'abr',
  Bhojpuri = 'bho',
  English = 'eng',
  French = 'fra',
  Malagasy = 'mlg',
}
const InputWidget = () => {
  const { setRows, setExtraText } = useDataContext();
  const { setTargetLanguage } = useSettings();
  const { value: inputText, setValue: setInputText } = useStoredParams<string>('inputText', '');
  const [inputDoc, setInputDoc] = useState<Doc>(Doc.Doc1);
  const extraTextArea = useRef<HTMLTextAreaElement>(null);
  // const [texts, setTexts] = useState<Record<Doc, string>>({});

  const clearInputText = useCallback(() => {
    setInputText('');
  }, [setInputText]);

  const onClickLanguage = useCallback(
    async (lang: LoadableLanguage) => {
      setTargetLanguage(lang);
      if (extraTextArea.current) extraTextArea.current.value = '';

      const data =
        (await loadInputText(`input_tsvs/${lang}_${getDocFileSuffix(inputDoc)}.tsv`)) || '';
      const storageKey = `inputText_${inputDoc}`;

      localStorage.setItem(storageKey, data);
      setInputText(data);
    },
    [inputDoc, setInputText, setTargetLanguage],
  );

  // Automatically updates the input lines dataset when inputText changes
  useEffect(() => {
    setRows(parseInputTSV(inputText));
  }, [inputText, setRows]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5em' }}>
      <h3>Language</h3>
      <InputLanguageSelector
        onClickLanguage={onClickLanguage}
        clearInputText={() => {
          const storageKey = `inputText_${inputDoc}`;
          localStorage.removeItem(storageKey);
          clearInputText();
        }}
      />
      <h3>Input</h3>
      <InputDocSelector
        curDoc={inputDoc}
        setDoc={(doc) => {
          setInputDoc(doc);
          setInputText(localStorage.getItem(`inputText_${doc}`) || '');
        }}
      />
      <InputCheck numRows={inputText ? parseInputTSV(inputText).length : 0} />

      <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '1em' }}>
        Supplemental Text
      </div>
      <div>
        Add text below to compute the language's alphabet more accurately (optional, but can help
        capture missing characters):
        <textarea
          style={{
            marginTop: '1em',
            fontSize: '8px',
            width: '100%',
            height: '100px',
          }}
          ref={extraTextArea}
          onChange={(e) => setExtraText(e.target.value)}
        />
      </div>
    </div>
  );
};

export default InputWidget;
