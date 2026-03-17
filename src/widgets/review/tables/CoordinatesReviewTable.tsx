import { useDataContext } from '@data/DataContext';
import { CardinalDirection, FormatLength } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { getSourceLanguageData } from '../getSourceLanguageData';

function CoordinatesReviewTable() {
  const { coordinatesData, directionExamples, setDirectionExample } = useDataContext();

  return (
    <div>
      <h3>Coordinates and Directions</h3>
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
                <td>{getSourceLanguageData(coordinatesData?.[FormatLength.Wide]?.[direction])}</td>
                <td>
                  {getSourceLanguageData(coordinatesData?.[FormatLength.Narrow]?.[direction])}
                </td>
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
                <input
                  value={example.translated || ''}
                  onChange={(e) => setDirectionExample(index, e.target.value)}
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
  const { coordinatesData, setCoordinatesTranslation } = useDataContext();
  if (!coordinatesData || !(format in coordinatesData)) return null;
  return (
    <td>
      <input
        value={coordinatesData[format]?.[direction]?.translated || ''}
        onChange={(e) => setCoordinatesTranslation(format, direction, e.target.value)}
        style={{ width: '10em' }}
      />
    </td>
  );
}

export default CoordinatesReviewTable;
