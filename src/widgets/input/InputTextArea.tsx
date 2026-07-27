import React from 'react';
import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { getDocFileType, type Doc } from '@data/Doc';

type Props = {
  doc: Doc;
};

const InputTextArea: React.FC<Props> = ({ doc }) => {
  const { t } = useTranslation();
  const { inputTSVs } = useDataContext();

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
      value={inputTSVs?.[doc]?.value ?? ''}
      onChange={(e) => inputTSVs?.[doc]?.setValue(e.target.value)}
    />
  );
};

export default InputTextArea;
