import { useDataContext } from '@data/DataContext';
import { DateField } from '@data/DateField';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

const DateFieldsReviewTable: React.FC = () => {
  const { findDataFields } = useDataContext();
  const dateFields = findDataFields({ group: 'DateFields', exampleNum: '0' });
  const dateFieldMatrix = matrixBy(
    dateFields,
    (f) => f.field,
    (f) => f.length,
  );

  return (
    <table>
      <thead>
        <tr>
          <th colSpan={3} style={{ textAlign: 'center' }}>
            <SourceLanguageLabel />
          </th>
          <th colSpan={3} style={{ textAlign: 'center' }}>
            Translated
          </th>
        </tr>
        <tr>
          <th>Wide</th>
          <th>Short</th>
          <th>Narrow</th>
          <th>Wide</th>
          <th>Short</th>
          <th>Narrow</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(DateField)
          .map((field) => dateFieldMatrix[field])
          .filter((row) => !!row) // Remove rows with no data
          .map((row, index) => (
            <tr key={index}>
              <SourceDataCell data={row['w']} />
              <SourceDataCell data={row['s']} />
              <SourceDataCell data={row['n']} />
              <InputDataCell data={row['w']} />
              <InputDataCell data={row['s']} />
              <InputDataCell data={row['n']} />
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default DateFieldsReviewTable;
