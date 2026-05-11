import React from 'react';
import { useTranslation } from 'react-i18next';

import { getDocFileType, type Doc } from '@data/Doc';

import { type UseStoredParamsReturn } from '@settings/useStoredParams';

type Props = {
  doc: Doc;
  texts: Record<Doc, UseStoredParamsReturn<string>>;
};

const InputTextArea: React.FC<Props> = ({ doc, texts }) => {
  const { value: inputText, setValue: setInputText } = texts[doc];
  const { t } = useTranslation();

  return (
    <textarea
      style={{
        width: '100%',
        height: '300px',
        marginTop: '1em',
        fontSize: '8px',
        tabSize: 16,
        whiteSpace: 'nowrap',
      }}
      placeholder={
        getDocFileType(doc) === 'tsv'
          ? t('input.files.placeholderTsv')
          : t('input.files.placeholderTxt')
      }
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
    />
  );
};

export default InputTextArea;
