import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { Doc } from '@data/Doc';

import InputCheck from './check/InputCheck';
import InputDocSelector from './InputDocSelector';
import InputLanguageSelector from './InputLanguageSelector';
import InputTextArea from './InputTextArea';

const InputBody = () => {
  const { t } = useTranslation();
  const { inputTSVs } = useDataContext();
  const [currentDoc, setCurrentDoc] = useState<Doc>(Doc.Doc1);

  const clearInputText = useCallback(() => {
    Object.values(Doc).forEach((doc) => inputTSVs[doc]?.clear());
  }, [inputTSVs]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5em' }}>
      <h3 style={{ margin: 0 }}>{t('input.language.title')}</h3>
      <InputLanguageSelector clearInputText={clearInputText} />
      <h3 style={{ margin: 0 }}>{t('input.files.title')}</h3>
      <InputDocSelector curDoc={currentDoc} setDoc={(doc) => setCurrentDoc(doc)} />
      <InputTextArea doc={currentDoc} />
      <InputCheck doc={currentDoc} />
    </div>
  );
};

export default InputBody;
