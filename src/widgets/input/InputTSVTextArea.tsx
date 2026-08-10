import React from 'react';

import { useTargetDataContext } from '@data/TargetDataProvider';
import { getDocFileType, type Doc } from '@data/tsvdocs/Doc';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

type Props = {
  doc: Doc;
};

const InputTSVTextArea: React.FC<Props> = ({ doc }) => {
  const { uitext } = useInterfaceTranslation();
  const { inputTSVs } = useTargetDataContext();

  return (
    <textarea
      className="LargeTextArea"
      placeholder={
        getDocFileType(doc) === 'tsv'
          ? uitext('input.files.placeholderTsv')
          : uitext('input.files.placeholderTxt')
      }
      value={inputTSVs[doc]?.value ?? ''}
      onChange={(e) => inputTSVs[doc]?.set(e.target.value)}
    />
  );
};

export default InputTSVTextArea;
