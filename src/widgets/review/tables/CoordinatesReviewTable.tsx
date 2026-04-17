import { useDataContext } from '@data/DataContext';
import PluralAmount from '@data/PluralAmount';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { groupBy, matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function CoordinatesReviewTable() {
  const { findDataFields } = useDataContext();
  const coordFields = findDataFields({ field: 'coordinateUnitPattern' });
  const coordMatrix = matrixBy(
    coordFields,
    (f) => f.instance,
    (f) => f.length,
  );
  const directionFields = groupBy(
    findDataFields({ field: 'ordinalMinimalPairs' }),
    (f) => f.instance,
  );

  return (
    <div>
      <table>
        <thead style={{ textAlign: 'center' }}>
          <tr>
            <th colSpan={2}>
              <SourceLanguageLabel />
            </th>
            <th colSpan={2}>Translated</th>
          </tr>
          <tr>
            <th>Long</th>
            <th>Narrow</th>
            <th>Long</th>
            <th>Narrow</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(coordMatrix).map(([length, row]) => (
            <tr key={length}>
              <SourceDataCell data={row['long']} />
              <SourceDataCell data={row['narrow']} />
              <InputDataCell data={row['long']} inputWidth="10em" />
              <InputDataCell data={row['narrow']} inputWidth="10em" />
            </tr>
          ))}
        </tbody>
      </table>
      <h4>Examples</h4>
      <table>
        <thead>
          <tr>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>Translated</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(PluralAmount).map(
            (pluralAmount) =>
              directionFields[pluralAmount] && (
                <tr key={pluralAmount}>
                  <SourceDataCell data={directionFields[pluralAmount][0]} />
                  <InputDataCell data={directionFields[pluralAmount][0]} inputWidth="15em" />
                </tr>
              ),
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CoordinatesReviewTable;
