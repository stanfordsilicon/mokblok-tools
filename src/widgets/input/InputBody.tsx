import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useTargetDataContext } from '@data/TargetDataProvider';
import { Doc } from '@data/tsvdocs/Doc';

import { useURLParams } from '@settings/URLParams';

import InputLanguageSelector from './InputLanguageSelector';
import InputSource from './InputSource';
import InputTSVSection from './InputTSVSection';
import InputXMLSection from './InputXMLSection';

const InputBody = () => {
  const { t } = useTranslation();
  const { inputSource, updateURLParams } = useURLParams();
  const { inputTSVs } = useTargetDataContext();

  const clearInputText = useCallback(() => {
    Object.values(Doc).forEach((doc) => inputTSVs[doc]?.clear());
  }, [inputTSVs]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5em' }}>
      <h3 style={{ margin: 0 }}>{t('input.inputSource.title')}</h3>
      <div style={{ display: 'flex', gap: '.5em', alignItems: 'center' }}>
        {t('input.inputSource.label')}
        {Object.values(InputSource).map((source) => (
          <button
            key={source}
            className={inputSource === source ? 'selected' : ''}
            onClick={() => updateURLParams({ inputSource: source })}
          >
            {t(`input.inputSource.${source}`)}
          </button>
        ))}
      </div>
      <h3 style={{ margin: 0 }}>{t('input.language.title')}</h3>
      <InputLanguageSelector clearInputText={clearInputText} />
      <h3 style={{ margin: 0 }}>{t('input.files.title')}</h3>
      {inputSource === InputSource.Blank && <>{t('input.files.None')}</>}
      {inputSource === InputSource.XML && <InputXMLSection />}
      {inputSource === InputSource.TSV && <InputTSVSection />}
    </div>
  );
};

export default InputBody;
