import { useDataContext } from '@data/DataContext';
import { HourMinuteFormat } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { getSourceLanguageData } from '../getSourceLanguageData';

function HourMinuteReviewTable() {
  const { hourMinuteData } = useDataContext();

  return (
    <div>
      <h3>Hour and Minute</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th colSpan={3} style={{ textAlign: 'center' }}>
              <SourceLanguageLabel />
            </th>
            <th colSpan={3} style={{ textAlign: 'center' }}>
              Translated
            </th>
          </tr>
          <tr>
            <th></th>
            <th>Morning</th>
            <th>Evening</th>
            <th>Pattern</th>
            <th>Morning</th>
            <th>Evening</th>
            <th>Pattern</th>
          </tr>
        </thead>
        <tbody>
          {hourMinuteData
            ? Object.values(HourMinuteFormat).map((format) => (
                <tr key={format}>
                  <td>{format}</td>
                  <td>{getSourceLanguageData(hourMinuteData[format]?.morning) || '-'}</td>
                  <td>{getSourceLanguageData(hourMinuteData[format]?.evening) || '-'}</td>
                  <td>
                    <em>TODO</em>
                  </td>
                  <InputCell format={format} variant="morning" />
                  <InputCell format={format} variant="evening" />
                  <td>
                    <em>TODO</em>
                  </td>
                </tr>
              ))
            : 'Data not available'}
        </tbody>
      </table>
    </div>
  );
}

type InputCellProps = {
  format: HourMinuteFormat;
  variant: 'morning' | 'evening';
};
function InputCell({ format, variant }: InputCellProps) {
  const { hourMinuteData, setHourMinuteTranslation } = useDataContext();
  return (
    <td>
      <input
        value={hourMinuteData?.[format]?.[variant]?.translated || ''}
        onChange={(e) => setHourMinuteTranslation(format, variant, e.target.value)}
        style={{ width: '6em' }}
        disabled={!hourMinuteData?.[format]?.[variant]}
      />
    </td>
  );
}

export default HourMinuteReviewTable;
