import { useDataContext } from '@data/DataContext';
import type {
  TimeIntervalDifference,
  TimeIntervalFormat,
  TimeIntervalsData,
} from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { getSourceLanguageData } from '../getSourceLanguageData';
import HighlightInput from '../HighlightInput';

function TimeIntervalsReviewTable() {
  const { timeIntervals } = useDataContext().data;
  return (
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
        {Object.entries(timeIntervals || {}).map(([variant, formats]) =>
          Object.entries(formats).map(([format, differences], formatIndex) =>
            Object.entries(differences).map(([difference, data], differenceIndex) => (
              <tr key={`${variant}-${format}-${difference}`}>
                <td>{formatIndex === 0 && differenceIndex === 0 ? variant : ''}</td>
                <td>{getSourceLanguageData(data) || '-'}</td>
                <td>
                  <em>TODO</em>
                </td>
                <td>
                  <InputCell
                    variant={variant as keyof TimeIntervalsData}
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
  );
}

type InputCellProps = {
  variant: keyof TimeIntervalsData;
  format: TimeIntervalFormat;
  difference: TimeIntervalDifference;
};
function InputCell({ variant, format, difference }: InputCellProps) {
  const {
    data: { timeIntervals },
    set,
  } = useDataContext();
  const currentTranslation = timeIntervals?.[variant]?.[format]?.[difference]?.translated || '';
  return (
    <HighlightInput
      highlight={/\d+/g}
      onChange={(value) => set.timeIntervals(variant, format, difference, value)}
      value={currentTranslation}
      style={{ width: '15em' }}
    />
  );
}

export default TimeIntervalsReviewTable;
