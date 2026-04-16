import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function ErasReviewTable() {
  const { findDataFields } = useDataContext();
  const eraFields = findDataFields({ field: 'G' });
  const eraMatrix = matrixBy(
    eraFields,
    (f) => f.instance + f.variant,
    (f) => f.length,
  );

  return (
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
          <th>Abbr.</th>
          <th>Wide</th>
          <th>Abbr.</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(eraMatrix)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([instance, row]) => (
            <tr key={instance}>
              <SourceDataCell data={row['w']} />
              <SourceDataCell data={row['a']} />
              <InputDataCell data={row['w']} inputWidth="10em" />
              <InputDataCell data={row['a']} inputWidth="4em" />
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default ErasReviewTable;
