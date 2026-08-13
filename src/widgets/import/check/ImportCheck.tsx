import React, { useMemo } from 'react';

import { useTargetDataContext } from '@data/TargetDataProvider';
import { Doc } from '@data/tsvdocs/Doc';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import ImportSource from '../ImportSource';

import CheckRow from './CheckRow';
import CheckSections from './CheckSections';

type Props = {
  doc?: Doc;
};

const InputCheck: React.FC<Props> = ({ doc }) => {
  const { uitext } = useInterfaceTranslation();
  const { importSource } = useURLParams();
  const { inputTSVs, targetXMLData } = useTargetDataContext();

  const lines = useMemo(() => {
    if (importSource === ImportSource.TSV && doc) {
      return (inputTSVs[doc]?.value ?? '')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean); // Exclude empty lines for counting
    }
    if (importSource === ImportSource.XML) {
      return Object.values(targetXMLData);
    }
    return [];
  }, [inputTSVs, doc, importSource, targetXMLData]);
  return (
    <table style={{ width: 'fit-content' }}>
      <tbody>
        <CheckRow
          title={uitext('import.check.Total rows')}
          count={lines.length}
          denominator={doc ? getExpectedNumberOfLines(doc) : undefined}
        />
        <CheckRow
          title={uitext('import.check.Total words')}
          count={lines.reduce((sum, line) => sum + line.split(/\s+/).length, 0)}
        />
        <CheckRow
          title={uitext('import.check.Total characters')}
          count={lines.reduce((sum, line) => sum + line.length, 0)}
        />
        <CheckSections doc={doc} />
      </tbody>
    </table>
  );
};

function getExpectedNumberOfLines(doc: Doc): number {
  switch (doc) {
    case Doc.Doc1:
      return 352;
    case Doc.Doc2_1:
      return 226;
    case Doc.Doc2_2:
      return 82;
    case Doc.Doc2_3:
      return 858;
    case Doc.Doc3:
      return 65;
    case Doc.Doc4:
      return 11;
  }
}

export default InputCheck;
