import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function MonthsReviewTable() {
  const { findDataFields } = useDataContext();
  const monthFields = findDataFields({ field: 'M' }).filter(
    (f) => f.length !== '' && f.instance !== '',
  );
  const monthMatrix = matrixBy(
    monthFields,
    (f) => f.instance,
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
          <th title="Abbreviated">Abbr.</th>
          <th>Narrow</th>
          <th>Wide</th>
          <th title="Abbreviated">Abbr.</th>
          <th>Narrow</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(monthMatrix)
          .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
          .map(([length, row]) => (
            <tr key={length}>
              <SourceDataCell data={row['w']} />
              <SourceDataCell data={row['a']} />
              <SourceDataCell data={row['n']} />
              <InputDataCell data={row['w']} />
              <InputDataCell data={row['a']} />
              <InputDataCell data={row['n']} />
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default MonthsReviewTable;
