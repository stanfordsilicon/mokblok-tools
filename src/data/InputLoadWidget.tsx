import { useCallback, useState } from 'react';
import { InputLanguage } from './InputDataTypes';
import { loadInputText } from './LoadInputData';

const InputLoadWidget = () => {
  // const { inputLines, setInputLines } = useState<string>('');
  const [inputText, setInputText] = useState<string>('');

  const onClickLanguage = useCallback(async (lang: InputLanguage) => {
    await loadInputText(`/input_tsvs/${lang}_1.tsv`).then((data) => setInputText(data || ''));

    // Handle language button click
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', gap: '1em' }}>
        {Object.values(InputLanguage).map((lang) => (
          <button key={lang} onClick={() => onClickLanguage(lang)}>
            {lang}
          </button>
        ))}
      </div>
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

export default InputLoadWidget;
