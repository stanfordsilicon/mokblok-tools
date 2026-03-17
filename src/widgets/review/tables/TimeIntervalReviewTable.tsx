import { useDataContext } from '@data/DataContext';
import type { TimeIntervalData, TimeIntervalDifference, TimeIntervalFormat } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { getSourceLanguageData } from '../getSourceLanguageData';
import HighlightInput from '../HighlightInput';

function TimeIntervalReviewTable() {
  const { timeIntervalData } = useDataContext();

  return (
    <div>
      <h3>Time Intervals</h3>
      <table>
        <thead>
          <tr>
            <th rowSpan={2}>Set</th>
            <th colSpan={2} style={{ textAlign: 'center' }}>
              <SourceLanguageLabel />
            </th>
            <th colSpan={2} style={{ textAlign: 'center' }}>
              Translated
            </th>
          </tr>
          <tr>
            <th>Example</th>
            <th>Pattern</th>
            <th>Example</th>
            <th>Pattern</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(timeIntervalData || {}).map(([set, formats]) =>
            Object.entries(formats).map(([format, differences], formatIndex) =>
              Object.entries(differences).map(([difference, data], differenceIndex) => (
                <tr key={`${set}-${format}-${difference}`}>
                  <td>{formatIndex === 0 && differenceIndex === 0 ? set : ''}</td>
                  <td>{getSourceLanguageData(data) || '-'}</td>
                  <td>
                    <em>TODO</em>
                  </td>
                  <td>
                    <InputCell
                      set={set as keyof TimeIntervalData}
                      format={format as TimeIntervalFormat}
                      difference={difference as TimeIntervalDifference}
                    />
                  </td>
                  <td>
                    <em>TODO</em>
                  </td>
                </tr>
              )),
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}

type InputCellProps = {
  set: keyof TimeIntervalData;
  format: TimeIntervalFormat;
  difference: TimeIntervalDifference;
};
function InputCell({ set, format, difference }: InputCellProps) {
  const { timeIntervalData, setTimeIntervalTranslation } = useDataContext();
  const currentTranslation = timeIntervalData?.[set]?.[format]?.[difference]?.translated || '';
  return (
    <HighlightInput
      highlight={/\d+/g}
      onChange={(value) => setTimeIntervalTranslation(set, format, difference, value)}
      value={currentTranslation}
    />
  );
}

export default TimeIntervalReviewTable;
