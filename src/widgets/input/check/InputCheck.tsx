import React from 'react';

import { Doc } from '@data/Doc';

import type { UseStoredParamsReturn } from '@settings/useStoredParams';

import CheckRow from './CheckRow';
import Doc1Analysis from './Doc1Analysis';

type Props = {
  doc: Doc;
  texts: Record<Doc, UseStoredParamsReturn<string>>;
};
const InputCheck: React.FC<Props> = ({ doc, texts }) => {
  const lines = texts[doc].value
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean); // Exclude header row for counting
  return (
    <table style={{ width: 'fit-content' }}>
      <tbody>
        <CheckRow
          title="Total rows"
          count={lines.length}
          denominator={getExpectedNumberOfLines(doc)}
        />
        <CheckRow
          title="Total words"
          count={lines.reduce((sum, line) => sum + line.split(/\s+/).length, 0)}
        />
        <CheckRow
          title="Total characters"
          count={lines.reduce((sum, line) => sum + line.length, 0)}
        />
        {doc === Doc.Doc1 && <Doc1Analysis />}
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
