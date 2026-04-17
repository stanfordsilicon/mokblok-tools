import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function TimeCombinationsReviewTable() {
  const { findDataFields } = useDataContext();
  const timesArray = findDataFields({ group: 'Times' });
  const timesMatrix = matrixBy(
    timesArray,
    (f) => f.instance,
    (f) => f.exampleNum,
  );

  return (
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
        </tr>
      </thead>
      <tbody>
        {Object.entries(timesMatrix).map(([instance, data]) => (
          <tr key={instance}>
            <td>{instance}</td>
            <SourceDataCell data={data['1']} />
            <SourceDataCell data={data['2']} />
            <td>{data[1].englishPattern}</td>
            <InputDataCell data={data['1']} />
            <InputDataCell data={data['2']} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TimeCombinationsReviewTable;
