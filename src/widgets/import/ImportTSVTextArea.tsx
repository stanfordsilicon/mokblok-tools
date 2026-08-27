import React from 'react';

import { useTargetDataContext } from '@data/target-data/TargetDataProvider';
import { getWorksheetFileType, Worksheet } from '@data/worksheets/Worksheet';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

type Props = {
  worksheet: Worksheet;
};

const ImportTSVTextArea: React.FC<Props> = ({ worksheet }) => {
  const { uitext } = useInterfaceTranslation();
  const { importedWorksheets } = useTargetDataContext();

  return (
    <textarea
      className="border w-full h-72 mt-1 text-xs p-2 tab-16 rounded-lg whitespace-nowrap"
      placeholder={
        getWorksheetFileType(worksheet) === 'tsv'
          ? uitext('import.files.placeholderTsv')
          : uitext('import.files.placeholderTxt')
      }
      value={importedWorksheets[worksheet]?.value ?? ''}
      onChange={(e) => importedWorksheets[worksheet]?.set(e.target.value)}
    />
  );
};

export default ImportTSVTextArea;
