import React from 'react';

import { useTargetDataContext } from '@data/TargetDataProvider';
import { getDocFileType, type Doc } from '@data/tsvdocs/Doc';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

type Props = {
  doc: Doc;
};

const ImportTSVTextArea: React.FC<Props> = ({ doc }) => {
  const { uitext } = useInterfaceTranslation();
  const { inputTSVs } = useTargetDataContext();

  return (
    <textarea
      className="border w-full h-72 mt-1 text-xs p-2 tab-16 rounded-lg whitespace-nowrap"
      placeholder={
        getDocFileType(doc) === 'tsv'
          ? uitext('import.files.placeholderTsv')
          : uitext('import.files.placeholderTxt')
      }
      value={inputTSVs[doc]?.value ?? ''}
      onChange={(e) => inputTSVs[doc]?.set(e.target.value)}
    />
  );
};

export default ImportTSVTextArea;
