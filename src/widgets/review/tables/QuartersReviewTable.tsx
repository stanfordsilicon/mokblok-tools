import { useDataContext } from '@data/DataContext';
import { FormatLength, SentenceContext } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { getSourceLanguageData } from '../getSourceLanguageData';
import HighlightInput from '../HighlightInput';

function QuartersReviewTable() {
  const { quarters } = useDataContext().data;

  return (
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
          <th>Abbr.</th>
          <th>Wide</th>
          <th>Abbr.</th>
        </tr>
      </thead>
      <tbody>
        {quarters &&
          Object.values(SentenceContext).flatMap((context) =>
            quarters[context]?.flatMap((quarter, quarterIndex) => (
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
  );
}

type InputCellProps = { context: SentenceContext; quarterIndex: number; format: FormatLength };
function InputCell({ context, quarterIndex, format }: InputCellProps) {
  const {
    data: { quarters },
    set,
  } = useDataContext();
  return (
    <td>
      <HighlightInput
        highlight={/\d+/g}
        value={quarters?.[context]?.[quarterIndex]?.[format]?.translated || ''}
        onChange={(value) => set.quarters(context, quarterIndex, format, value)}
        style={{ width: format === FormatLength.Wide ? '15em' : '10em' }}
        disabled={!quarters?.[context]?.[quarterIndex]?.[format]} // Disable if this quarter/format doesn't exist
      />
    </td>
  );
}

export default QuartersReviewTable;
