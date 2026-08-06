import { useTranslation } from 'react-i18next';

import { useURLParams } from '@settings/URLParams';

import InputSource from './InputSource';

// These languages have starting data that can be loaded with a click.
export const TSVLanguages = ['abr', 'bho', 'en', 'fr', 'mg'];
const XMLLanguages = ['ann', 'en', 'es', 'fr', 'ha', 'it', 'mfe', 'mg', 'or', 'sn', 'wo'];

type Props = {
  clearInputText: () => void;
};

const InputLanguageSelector = ({ clearInputText }: Props) => {
  const { t } = useTranslation();
  const { targetLanguage, updateURLParams, inputSource } = useURLParams();
  const languageOptions = inputSource === 'tsv' ? TSVLanguages : XMLLanguages;

  return (
    <div>
      <div>
        {t('input.language.pickLanguage')}{' '}
        {inputSource !== InputSource.Blank && t('input.language.hasPreloaded')}
      </div>
      <div className="flex gap-1 items-center mt-1">
        {languageOptions.map((lang) => (
          <button
            key={lang}
            className={lang === targetLanguage ? 'selected' : ''}
            onClick={() => updateURLParams({ targetLanguage: lang })}
          >
            {/* Convert ID to a readable name */}
            {t(`languageName.${lang}`, lang)}
          </button>
        ))}
      </div>
      <div className="flex gap-1 items-center mt-1">
        <div>{t('input.language.manual')}</div>
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
          {t('input.language.ctaClear')}
        </button>
      </div>
    </div>
  );
};

export default InputLanguageSelector;
