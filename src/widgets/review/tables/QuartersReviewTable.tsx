import { useDataContext } from '@data/DataContext';
import { FormatLength, SentenceContext } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { getSourceLanguageData } from '../getSourceLanguageData';
import HighlightInput from '../HighlightInput';

function QuartersReviewTable() {
  const { quartersData } = useDataContext();

  return (
    <div>
      <h3>Quarters</h3>
      <div style={{ display: 'flex', gap: '1em', flexDirection: 'row' }}>
        <table>
          <thead style={{ textAlign: 'center' }}>
            <tr>
              <th colSpan={2}>
                <SourceLanguageLabel />
              </th>
              <th colSpan={2}>Translation</th>
            </tr>
            <tr>
              <th>Wide</th>
              <th>Abbreviated</th>
              <th>Wide</th>
              <th>Abbreviated</th>
            </tr>
          </thead>
          <tbody>
            {quartersData &&
              Object.values(SentenceContext).flatMap((context) =>
                quartersData[context]?.flatMap((quarter, quarterIndex) => (
                  <tr key={`${context}-${quarterIndex}`}>
                    <td>{getSourceLanguageData(quarter[FormatLength.Wide])}</td>
                    <td>{getSourceLanguageData(quarter[FormatLength.Abbreviated])}</td>
                    <InputCell
                      context={context}
                      quarterIndex={quarterIndex}
                      format={FormatLength.Wide}
                    />
                    <InputCell
                      context={context}
                      quarterIndex={quarterIndex}
                      format={FormatLength.Abbreviated}
                    />
                  </tr>
                )),
              )}
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
      <HighlightInput
        highlight={/\d+/g}
        value={quartersData?.[context]?.[quarterIndex]?.[format]?.translated || ''}
        onChange={(value) => setQuarterTranslation(context, quarterIndex, format, value)}
        style={{ width: format === FormatLength.Wide ? '15em' : '10em' }}
        disabled={!quartersData?.[context]?.[quarterIndex]?.[format]} // Disable if this quarter/format doesn't exist
      />
    </td>
  );
}

export default QuartersReviewTable;
