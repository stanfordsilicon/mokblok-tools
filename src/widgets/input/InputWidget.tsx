import { useCallback, useEffect } from 'react';

import { useDataContext } from '@data/DataContext';
import { loadInputText, parseInputTSV } from '@data/LoadInputData';

import { useSettings } from '@settings/Settings';
import useStoredParams from '@settings/useStoredParams';

export enum LoadableLanguage {
  Abron = 'abr',
  Bhojpuri = 'bho',
  English = 'eng',
  French = 'fra',
  Malagasy = 'mlg',
}

import InputCheck from './InputCheck';

const InputWidget = () => {
  const { setRows } = useDataContext();
  const { targetLanguage, setTargetLanguage } = useSettings();
  const { value: inputText, setValue: setInputText } = useStoredParams<string>('inputText', '');

  const onClickLanguage = useCallback(async (lang: LoadableLanguage) => {
    setTargetLanguage(lang);
    await loadInputText(`input_tsvs/${lang}_1.tsv`).then((data) => setInputText(data || ''));
  }, []);

  // Automatically updates the input lines dataset when inputText changes
  useEffect(() => {
    setRows(parseInputTSV(inputText));
  }, [inputText, setRows]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5em' }}>
      <div>Select a language to load its TSV data:</div>
      <div style={{ display: 'flex', gap: '1em' }}>
        {Object.values(LoadableLanguage).map((lang) => (
          <button
            key={lang}
            className={lang === targetLanguage ? 'selected' : ''}
            onClick={() => onClickLanguage(lang)}
          >
            {/* Convert ID to a readable name */}
            {Object.entries(LoadableLanguage).find(([, value]) => value === lang)?.[0]}
          </button>
        ))}
      </div>
      <div>
        Or paste your own TSV data below:{' '}
        <button
          style={{ width: 'fit-content', marginLeft: '1em' }}
          onClick={() => {
            setInputText('');
            setTargetLanguage('');
          }}
        >
          Clear
        </button>
      </div>
      <textarea
        style={{
          width: '100%',
          height: '300px',
          marginTop: '1em',
          fontSize: '8px',
          tabSize: 16,
          whiteSpace: 'nowrap',
        }}
        placeholder="Paste TSV data here..."
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
          setTargetLanguage(''); // Clear target language when user pastes custom data
        }}
      />
      <InputCheck numRows={inputText ? parseInputTSV(inputText).length : 0} />
    </div>
  );
};

export default InputWidget;
