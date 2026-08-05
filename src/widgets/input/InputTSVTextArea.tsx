import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTargetDataContext } from '@data/TargetDataProvider';
import { getDocFileType, type Doc } from '@data/tsvdocs/Doc';

type Props = {
  doc: Doc;
};

const InputTSVTextArea: React.FC<Props> = ({ doc }) => {
  const { t } = useTranslation();
  const { inputTSVs } = useTargetDataContext();

  return (
    <textarea
      className="LargeTextArea"
      placeholder={
        getDocFileType(doc) === 'tsv'
          ? t('input.files.placeholderTsv')
          : t('input.files.placeholderTxt')
      }
      value={inputTSVs[doc]?.value ?? ''}
      onChange={(e) => inputTSVs[doc]?.set(e.target.value)}
    />
  );
};

export default InputTSVTextArea;
