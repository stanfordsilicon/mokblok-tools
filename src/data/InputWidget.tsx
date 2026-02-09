import { useCallback, useEffect } from 'react';
import useStoredParams from '../page/useStoredParams';
import { useDataContext } from './DataContext';
import { TargetLanguage } from './DataTypes';
import InputCheck from './InputCheck';
import { loadInputText, parseInputTSV } from './LoadInputData';

const InputWidget = () => {
  const { setRows } = useDataContext();
  const { value: inputText, setValue: setInputText } = useStoredParams<string>('inputText', '');
  const { value: targetLanguage, setValue: setTargetLanguage } = useStoredParams<TargetLanguage>(
    'targetLanguage',
    TargetLanguage.Bhojpuri,
  );

  const onClickLanguage = useCallback(async (lang: TargetLanguage) => {
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
        {Object.values(TargetLanguage).map((lang) => (
          <button
            key={lang}
            className={lang === targetLanguage ? 'selected' : ''}
            onClick={() => onClickLanguage(lang)}
          >
            {/* Convert ID to a readable name */}
            {Object.entries(TargetLanguage).find(([, value]) => value === lang)?.[0]}
          </button>
        ))}
      </div>
      Or paste your own TSV data below:
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
        onChange={(e) => setInputText(e.target.value)}
      />
      <InputCheck numRows={inputText ? parseInputTSV(inputText).length : 0} />
    </div>
  );
};

export default InputWidget;
