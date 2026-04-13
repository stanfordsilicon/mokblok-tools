import { useDataContext } from '@data/DataContext';
import PluralAmount from '@data/PluralAmount';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { groupBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function DirectionsReviewTable() {
  const { findDataFields } = useDataContext();
  const directionFields = groupBy(
    findDataFields({ field: 'ordinalMinimalPairs' }),
    (f) => f.instance,
  );

  return (
    <div>
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
                  <InputDataCell data={directionFields[pluralAmount][0]} inputWidth="long" />
                </tr>
              ),
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DirectionsReviewTable;
