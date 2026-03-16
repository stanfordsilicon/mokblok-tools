import { useDataContext } from '@data/DataContext';
import { DateField, SourceLanguage } from '@data/DataTypes';

import { useSettings } from '@settings/Settings';

import { getSourceLanguageData } from './getSourceLanguageData';

function RelativeTimeReviewTable() {
  const { sourceLanguage } = useSettings();
  const { relativeTimeData } = useDataContext();

  return (
    <div>
      <h3>Relative Time</h3>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th colSpan={3} style={{ textAlign: 'center' }}>
              {Object.entries(SourceLanguage).find(([, value]) => value === sourceLanguage)?.[0]}
            </th>
            <th colSpan={3} style={{ textAlign: 'center' }}>
              Translated
            </th>
          </tr>
          <tr>
            <th></th>
            <th>Past</th>
            <th>Present</th>
            <th>Future</th>
            <th>Past</th>
            <th>Present</th>
            <th>Future</th>
          </tr>
        </thead>
        <tbody>
          {relativeTimeData &&
            Object.entries(relativeTimeData).map(([field, times]) => (
              <tr key={field}>
                <td>{field}</td>
                {/* Source Language */}
                <td>{getSourceLanguageData(times['-1']) || '-'}</td>
                <td>{getSourceLanguageData(times['0']) || '-'}</td>
                <td>{getSourceLanguageData(times['1']) || '-'}</td>
                {/* Target Language (editable) */}
                <InputCell field={field as DateField} offset="-1" />
                <InputCell field={field as DateField} offset="0" />
                <InputCell field={field as DateField} offset="1" />
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

type InputCellProps = { field: DateField; offset: '-1' | '0' | '1' };
function InputCell({ field, offset }: InputCellProps) {
  const { relativeTimeData, setRelativeTimeTranslation } = useDataContext();
  return (
    <td>
      <input
        value={relativeTimeData?.[field]?.[offset]?.translated || ''}
        onChange={(e) => setRelativeTimeTranslation(field, offset, e.target.value)}
        style={{ width: '6em' }}
        type="text"
      />
    </td>
  );
}

export default RelativeTimeReviewTable;
