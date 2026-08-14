import React, { useMemo } from 'react';

import ImportSource from '@data/ImportSource';
import { useTargetDataContext } from '@data/TargetDataProvider';
import { Worksheet } from '@data/worksheets/Worksheet';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import CheckRow from './CheckRow';
import CheckSections from './CheckSections';

type Props = {
  worksheet?: Worksheet;
};

const InputCheck: React.FC<Props> = ({ worksheet }) => {
  const { uitext } = useInterfaceTranslation();
  const { importSource } = useURLParams();
  const { importedWorksheets, targetXMLData } = useTargetDataContext();

  const lines = useMemo(() => {
    if (importSource === ImportSource.TSV && worksheet) {
      return (importedWorksheets[worksheet]?.value ?? '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean); // Exclude empty lines for counting
    }
    if (importSource === ImportSource.XML) {
      return Object.values(targetXMLData);
    }
    return [];
  }, [importedWorksheets, worksheet, importSource, targetXMLData]);
  return (
    <table style={{ width: 'fit-content' }}>
      <tbody>
        <CheckRow
          title={uitext('import.check.Total rows')}
          count={lines.length}
          denominator={worksheet ? getExpectedNumberOfLines(worksheet) : undefined}
        />
        <CheckRow
          title={uitext('import.check.Total words')}
          count={lines.reduce((sum, line) => sum + line.split(/\s+/).length, 0)}
        />
        <CheckRow
          title={uitext('import.check.Total characters')}
          count={lines.reduce((sum, line) => sum + line.length, 0)}
        />
        <CheckSections worksheet={worksheet} />
      </tbody>
    </table>
  );
};

function getExpectedNumberOfLines(doc: Worksheet): number {
  switch (doc) {
    case Worksheet.W1:
      return 352;
    case Worksheet.W2_1:
      return 226;
    case Worksheet.W2_2:
      return 82;
    case Worksheet.W2_3:
      return 858;
    case Worksheet.W3:
      return 65;
    case Worksheet.W4:
      return 11;
  }
}

export default InputCheck;
