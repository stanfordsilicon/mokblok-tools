import { useDataContext } from '@data/DataContext';
import { CardinalDirection, FormatLength } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { getSourceLanguageData } from '../getSourceLanguageData';
import HighlightInput from '../HighlightInput';

function CoordinatesReviewTable() {
  const {
    data: { coordinates, directionExamples },
    set,
  } = useDataContext();

  return (
    <div>
      <table>
        <thead style={{ textAlign: 'center' }}>
          <tr>
            <th colSpan={2}>
              <SourceLanguageLabel />
            </th>
            <th colSpan={2}>Translated</th>
          </tr>
          <tr>
            <th>Wide</th>
            <th>Narrow</th>
            <th>Wide</th>
            <th>Narrow</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(CardinalDirection).map((direction) => {
            return (
              <tr key={direction}>
                <td>{getSourceLanguageData(coordinates?.[direction]?.[FormatLength.Wide])}</td>
                <td>{getSourceLanguageData(coordinates?.[direction]?.[FormatLength.Narrow])}</td>
                <InputCell format={FormatLength.Wide} direction={direction} />
                <InputCell format={FormatLength.Narrow} direction={direction} />
              </tr>
            );
          })}
        </tbody>
      </table>
      <h4>Examples</h4>
      <table>
        <thead>
          <tr>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>Translated</th>
          </tr>
        </thead>
        <tbody>
          {directionExamples?.map((example, index) => (
            <tr key={example.key}>
              <td>{getSourceLanguageData(example)}</td>
              <td>
                <HighlightInput
                  value={example.translated || ''}
                  onChange={(value) => set.directionExamples(index, value)}
                  highlight={/\d+/g}
                  style={{ width: '20em' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type InputCellProps = { format: FormatLength; direction: CardinalDirection };
function InputCell({ format, direction }: InputCellProps) {
  const {
    data: { coordinates },
    set,
  } = useDataContext();
  return (
    <td>
      <HighlightInput
        value={coordinates?.[direction]?.[format]?.translated || ''}
        onChange={(value) => set.coordinates(format, direction, value)}
        highlight={/\d+/g}
        style={{ width: '10em' }}
      />
    </td>
  );
}

export default CoordinatesReviewTable;
