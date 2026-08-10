import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import InputSource from './InputSource';

// These languages have starting data that can be loaded with a click.
export const TSVLanguages = ['abr', 'bho', 'en', 'fr', 'mg'];
const XMLLanguages = ['ann', 'en', 'es', 'fr', 'ha', 'it', 'mfe', 'mg', 'or', 'sn', 'wo'];

type Props = {
  clearInputText: () => void;
};

const InputLanguageSelector = ({ clearInputText }: Props) => {
  const { uitext } = useInterfaceTranslation();
  const { targetLanguage, updateURLParams, inputSource } = useURLParams();
  const languageOptions = inputSource === InputSource.TSV ? TSVLanguages : XMLLanguages;

  return (
    <div>
      <div>
        {uitext('input.language.pickLanguage')}{' '}
        {inputSource !== InputSource.Blank && uitext('input.language.hasPreloaded')}
      </div>
      <div className="flex gap-1 items-center mt-1">
        {languageOptions.map((lang) => (
          <button
            key={lang}
            className={lang === targetLanguage ? 'selected' : ''}
            onClick={() => updateURLParams({ targetLanguage: lang })}
          >
            {/* Convert ID to a readable name */}
            {uitext(`languageName.${lang}`, lang)}
          </button>
        ))}
      </div>
      <div className="flex gap-1 items-center mt-1">
        <div>{uitext('input.language.manual')}</div>
        <input
          value={targetLanguage}
          onChange={(e) => updateURLParams({ targetLanguage: e.target.value })}
          style={{
            borderRadius: '0.5em',
            lineHeight: '2em',
            width: '3em',
            background: targetLanguage.length < 2 ? 'lightcoral' : 'var(--color-background)',
          }}
        />
        <button
          onClick={() => {
            clearInputText();
            updateURLParams({ targetLanguage: '' });
          }}
        >
          {uitext('input.language.ctaClear')}
        </button>
      </div>
    </div>
  );
};

export default InputLanguageSelector;
