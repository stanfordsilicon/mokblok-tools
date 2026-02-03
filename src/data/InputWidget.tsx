import { useCallback, useEffect } from 'react';
import useStoredParams from '../page/useStoredParams';
import { useDataContext } from './DataContext';
import { InputLanguage } from './DataTypes';
import { loadInputText, parseInputTSV } from './LoadInputData';

const InputWidget = () => {
  const { setRows, monthsData, daysOfWeekData } = useDataContext();
  const { value: inputText, setValue: setInputText } = useStoredParams<string>('inputText', '');
  const { value: targetLanguage, setValue: setTargetLanguage } = useStoredParams<InputLanguage>(
    'targetLanguage',
    InputLanguage.Bhojpuri,
  );

  const onClickLanguage = useCallback(async (lang: InputLanguage) => {
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
        {Object.values(InputLanguage).map((lang) => (
          <button
            key={lang}
            onClick={() => onClickLanguage(lang)}
            style={{ fontWeight: lang === targetLanguage ? 'bold' : 'normal' }}
          >
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
          fontSize: '8px',
          tabSize: 16,
          whiteSpace: 'nowrap',
        }}
        placeholder="Paste TSV data here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <div>
        <strong>Total rows loaded:</strong> {inputText ? parseInputTSV(inputText).length : 0}
        <br />
        <strong>Months loaded:</strong>{' '}
        {monthsData.reduce(
          (count, month) =>
            count + ((month.long ? 1 : 0) + (month.short ? 1 : 0) + (month.narrow ? 1 : 0)),
          0,
        )}{' '}
        / 36 (12 months × 3 forms)
        <br />
        <strong>Days of the week loaded:</strong>{' '}
        {daysOfWeekData.reduce(
          (count, day) =>
            count +
            ((day.wide ? 1 : 0) +
              (day.abbreviated ? 1 : 0) +
              (day.short ? 1 : 0) +
              (day.narrow ? 1 : 0)),
          0,
        )}{' '}
        / 28 (7 days × 4 formmms)
      </div>
    </div>
  );
};

export default InputWidget;
