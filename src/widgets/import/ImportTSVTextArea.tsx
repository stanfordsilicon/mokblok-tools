import React from 'react';

import { useTargetDataContext } from '@data/target/TargetDataProvider';
import { getWorksheetFileType, Worksheet } from '@data/worksheets/Worksheet';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

type Props = {
  worksheet: Worksheet;
};

const ImportTSVTextArea: React.FC<Props> = ({ worksheet }) => {
  const { uitext } = useInterfaceTranslation();
  const { importedWorksheets, worksheetsLoading } = useTargetDataContext();

  return (
    <textarea
      aria-label="Worksheet text"
      disabled={worksheetsLoading}
      className="mt-1 h-72 w-full rounded-lg border border-(--silicon-line-strong) bg-white p-3 font-mono text-sm tab-16 whitespace-nowrap text-(--silicon-ink) shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--silicon-purple) disabled:opacity-60"
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
