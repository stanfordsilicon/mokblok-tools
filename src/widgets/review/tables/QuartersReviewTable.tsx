import React from 'react';

import { useDataContext } from '@data/DataContext';
import { FormatLength, SentenceContext } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { getSourceLanguageData } from '../getSourceLanguageData';

function QuartersReviewTable() {
  const { quartersData } = useDataContext();

  return (
    <div>
      <h3>Quarters</h3>
      <div style={{ display: 'flex', gap: '1em', flexDirection: 'row' }}>
        <table>
          <thead>
            <tr>
              <th>
                <SourceLanguageLabel />
              </th>
              <th>Translation</th>
            </tr>
          </thead>
          <tbody>
            {quartersData &&
              Object.values(SentenceContext).flatMap((context) => (
                <React.Fragment key={context}>
                  <tr>
                    <td colSpan={2} style={{ textAlign: 'center' }}>
                      {context}
                    </td>
                  </tr>
                  {[FormatLength.Wide, FormatLength.Abbreviated].map((format) =>
                    quartersData[context]?.flatMap((quarter, quarterIndex) => (
                      <tr key={`${context}-${quarterIndex}-${format}`}>
                        <td>{getSourceLanguageData(quarter[format])}</td>
                        <InputCell context={context} quarterIndex={quarterIndex} format={format} />
                      </tr>
                    )),
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>

        {/* Add any relevant demos or visualizations for quarters here */}
      </div>
    </div>
  );
}

type InputCellProps = { context: SentenceContext; quarterIndex: number; format: FormatLength };
function InputCell({ context, quarterIndex, format }: InputCellProps) {
  const { quartersData, setQuarterTranslation } = useDataContext();
  return (
    <td>
      <input
        value={quartersData?.[context]?.[quarterIndex]?.[format]?.translated || ''}
        onChange={(e) => setQuarterTranslation(context, quarterIndex, format, e.target.value)}
        style={{ width: '15em' }}
        disabled={!quartersData?.[context]?.[quarterIndex]?.[format]} // Disable if this quarter/format doesn't exist
      />
    </td>
  );
}

export default QuartersReviewTable;
