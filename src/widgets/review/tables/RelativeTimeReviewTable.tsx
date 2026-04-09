import { useDataContext } from '@data/DataContext';
import { DateField } from '@data/DateField';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function RelativeTimeReviewTable() {
  const { findDataFields } = useDataContext();
  const relativeTimeFields = findDataFields({ subject: 'dates' }).filter(
    (f) => ['-1', '0', '1'].includes(f.instance) && f.length === '',
  );
  const relativeTimeMatrix = matrixBy(
    relativeTimeFields,
    (f) => f.field,
    (f) => f.instance,
  );

  return (
    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th colSpan={3} style={{ textAlign: 'center' }}>
            <SourceLanguageLabel />
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
        {Object.values(DateField).map((field) => {
          const data = relativeTimeMatrix[field];
          if (!data) return null;
          return (
            <tr key={field}>
              <td>{field}</td>
              <SourceDataCell data={data['-1']} />
              <SourceDataCell data={data['0']} />
              <SourceDataCell data={data['1']} />
              <InputDataCell data={data['-1']} />
              <InputDataCell data={data['0']} />
              <InputDataCell data={data['1']} />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default RelativeTimeReviewTable;
