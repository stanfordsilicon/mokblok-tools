import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function QuartersReviewTable() {
  const { findDataFields } = useDataContext();
  const quarterFields = findDataFields({ field: 'q' }).filter((f) => f.instance !== '');
  const quarterMatrix = matrixBy(
    quarterFields,
    (f) => f.variant + '-' + f.instance,
    (f) => f.length,
  );

  return (
    <table>
      <thead style={{ textAlign: 'center' }}>
        <tr>
          <th colSpan={2}>
            <SourceLanguageLabel />
          </th>
          <th colSpan={2}>Translation</th>
        </tr>
        <tr>
          <th>Wide</th>
          <th>Abbr.</th>
          <th>Wide</th>
          <th>Abbr.</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(quarterMatrix)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([length, row]) => (
            <tr key={length}>
              <SourceDataCell data={row['w']} />
              <SourceDataCell data={row['a']} />
              <InputDataCell data={row['w']} inputWidth="long" />
              <InputDataCell data={row['a']} inputWidth="long" />
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default QuartersReviewTable;
