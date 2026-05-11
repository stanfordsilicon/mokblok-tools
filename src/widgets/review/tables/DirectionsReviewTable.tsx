import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>{t('review.translated')}</th>
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

export default DirectionsReviewTable;
