import { useCallback, useEffect, useState } from 'react';
import { useDataContext } from './DataContext';
import { InputLanguage } from './DataTypes';
import { loadInputText, parseInputTSV } from './LoadInputData';

const InputWidget = () => {
  const [inputText, setInputText] = useState<string>('');
  const { setRows } = useDataContext();

  const onClickLanguage = useCallback(async (lang: InputLanguage) => {
    await loadInputText(`/input_tsvs/${lang}_1.tsv`).then((data) => setInputText(data || ''));
  }, []);

  // Automatically updates the input lines dataset when inputText changes
  useEffect(() => {
    setRows(parseInputTSV(inputText));
  }, [inputText, setRows]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5em' }}>
      <div>Select a language to load its TSV data:</div>
      <div style={{ display: 'flex', gap: '1em' }}>
        {Object.values(InputLanguage).map((lang) => (
          <button key={lang} onClick={() => onClickLanguage(lang)}>
            {/* Convert ID to a readable name */}
            {Object.entries(InputLanguage).find(([, value]) => value === lang)?.[0]}
          </button>
        ))}
      </div>
      Or paste your own TSV data below:
      <textarea
        style={{
          width: '100%',
          height: '300px',
          marginTop: '1em',
          fontSize: '6px',
          tabSize: 16,
          whiteSpace: 'nowrap',
        }}
        placeholder="Paste TSV data here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
    </div>
  );
};

export default InputWidget;
