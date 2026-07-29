import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTargetDataContext } from '@data/TargetDataProvider';
import { Doc } from '@data/tsvdocs/Doc';

import { useURLParams } from '@settings/URLParams';

import InputCheck from './check/InputCheck';
import InputDocSelector from './InputDocSelector';
import InputLanguageSelector from './InputLanguageSelector';
import InputSource from './InputSource';
import InputTextArea from './InputTextArea';

const InputBody = () => {
  const { t } = useTranslation();
  const { inputSource, updateURLParams } = useURLParams();
  const { inputTSVs } = useTargetDataContext();
  const [currentDoc, setCurrentDoc] = useState<Doc>(Doc.Doc1);

  const clearInputText = useCallback(() => {
    Object.values(Doc).forEach((doc) => inputTSVs[doc]?.clear());
  }, [inputTSVs]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5em' }}>
      <h3 style={{ margin: 0 }}>{t('input.inputSource.title')}</h3>
      <div style={{ display: 'flex', gap: '.5em', alignItems: 'center' }}>
        {t('input.inputSource.label')}
        {Object.values(InputSource).map((source) => (
          <button key={source} onClick={() => updateURLParams({ inputSource: source })}>
            {t(`input.inputSource.${source}`)}
          </button>
        ))}
      </div>
      <h3 style={{ margin: 0 }}>{t('input.language.title')}</h3>
      <InputLanguageSelector clearInputText={clearInputText} />
      <h3 style={{ margin: 0 }}>{t('input.files.title')}</h3>
      {inputSource === InputSource.Blank && <>{t('input.files.None')}</>}
      {inputSource === InputSource.XML && <>{t('input.files.None')}</>}
      {inputSource === InputSource.TSV && (
        <>
          <InputDocSelector curDoc={currentDoc} setDoc={(doc) => setCurrentDoc(doc)} />
          <InputTextArea doc={currentDoc} />
          <InputCheck doc={currentDoc} />
        </>
      )}
    </div>
  );
};

export default InputBody;
