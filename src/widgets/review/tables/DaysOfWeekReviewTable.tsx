import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function DaysOfWeekReviewTable() {
  const { findDataFields } = useDataContext();
  const daysOfTheWeekFields = findDataFields({ field: 'E' }).filter(
    (f) => f.length !== '' && f.instance !== '',
  );
  const daysOfTheWeekMatrix = matrixBy(
    daysOfTheWeekFields,
    (f) => f.instance,
    (f) => f.length,
  );

  return (
    <table style={{ height: 'fit-content' }}>
      <thead>
        <tr>
          <th colSpan={4} style={{ textAlign: 'center' }}>
            <SourceLanguageLabel />
          </th>
          <th colSpan={4} style={{ textAlign: 'center' }}>
            Translated
          </th>
        </tr>
        <tr>
          <th>Wide</th>
          <th title="Abbreviated">Abbr.</th>
          <th>Short</th>
          <th>Narrow</th>
          <th>Wide</th>
          <th title="Abbreviated">Abbr.</th>
          <th>Short</th>
          <th>Narrow</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(daysOfTheWeekMatrix)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([instance, row]) => (
            <tr key={instance}>
              <SourceDataCell data={row['w']} />
              <SourceDataCell data={row['a']} />
              <SourceDataCell data={row['s']} />
              <SourceDataCell data={row['n']} />
              <InputDataCell data={row['w']} />
              <InputDataCell data={row['a']} />
              <InputDataCell data={row['s']} />
              <InputDataCell data={row['n']} />
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default DaysOfWeekReviewTable;
