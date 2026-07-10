import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { CardinalDirection } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

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
  const { t } = useTranslation();

  return (
    <div>
      <table>
        <thead style={{ textAlign: 'center' }}>
          <tr>
            <th colSpan={2}>
              <SourceLanguageLabel />
            </th>
            <th colSpan={2}>{t('review.translated')}</th>
          </tr>
          <tr>
            <th>{t('length.long')}</th>
            <th>{t('length.narrow')}</th>
            <th>{t('length.long')}</th>
            <th>{t('length.narrow')}</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(CardinalDirection).map((direction) => (
            <tr key={direction}>
              <SourceDataCell data={coordMatrix[direction]?.['long']} />
              <SourceDataCell data={coordMatrix[direction]?.['narrow']} />
              <InputDataCell data={coordMatrix[direction]?.['long']} inputWidth="10em" />
              <InputDataCell data={coordMatrix[direction]?.['narrow']} inputWidth="10em" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CoordinatesReviewTable;
