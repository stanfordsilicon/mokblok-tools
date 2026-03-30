import { useDataContext } from '@data/DataContext';
import { CardinalDirection, FormatLength } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import Demo from '../demos/Demo';
import DemoID from '../demos/DemoID';
import { getSourceLanguageData } from '../getSourceLanguageData';
import HighlightInput from '../HighlightInput';

function CoordinatesReviewTable() {
  const { coordinatesData, directionExamples, setDirectionExample } = useDataContext();

  return (
    <div>
      <h3>Coordinates and Directions</h3>
      <div style={{ display: 'flex', gap: '1em', flexDirection: 'row' }}>
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
                    <td>
                      {getSourceLanguageData(coordinatesData?.[direction]?.[FormatLength.Wide])}
                    </td>
                    <td>
                      {getSourceLanguageData(coordinatesData?.[direction]?.[FormatLength.Narrow])}
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
                    <HighlightInput
                      value={example.translated || ''}
                      onChange={(value) => setDirectionExample(index, value)}
                      highlight={/\d+/g}
                      style={{ width: '20em' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Demo demoID={DemoID.CoordinatesMap} title="Location in Map" />
        <Demo demoID={DemoID.CoordinatesDirections} title="Directions" />
      </div>
    </div>
  );
}

type InputCellProps = { format: FormatLength; direction: CardinalDirection };
function InputCell({ format, direction }: InputCellProps) {
  const { coordinatesData, setCoordinatesTranslation } = useDataContext();
  return (
    <td>
      <HighlightInput
        value={coordinatesData?.[direction]?.[format]?.translated || ''}
        onChange={(value) => setCoordinatesTranslation(format, direction, value)}
        highlight={/\d+/g}
        style={{ width: '10em' }}
      />
    </td>
  );
}

export default CoordinatesReviewTable;
