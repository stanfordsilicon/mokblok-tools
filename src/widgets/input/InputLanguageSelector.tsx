import { useTranslation } from 'react-i18next';

import { useURLParams } from '@settings/URLParams';

// These languages have pre-saved TSV data that can be loaded with a click.
export enum LoadableLanguage {
  Abron = 'abr',
  Bhojpuri = 'bho',
  English = 'en',
  French = 'fr',
  Malagasy = 'mg',
}

type Props = {
  clearInputText: () => void;
};

const InputLanguageSelector = ({ clearInputText }: Props) => {
  const { t } = useTranslation();
  const { targetLanguage, updateURLParams } = useURLParams();

  return (
    <div>
      <div>{t('input.language.description')}</div>
      <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
        {Object.values(LoadableLanguage).map((lang: LoadableLanguage) => (
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
      <div style={{ display: 'flex', gap: '1em', alignItems: 'center', marginTop: '1em' }}>
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
