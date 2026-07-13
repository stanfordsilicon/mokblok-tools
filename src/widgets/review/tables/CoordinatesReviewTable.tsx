import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { CardinalDirection } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function CoordinatesReviewTable() {
  const { findDataEntry, findDataEntries } = useDataContext();
  const coordFields = findDataEntries({ field: 'coordinateUnitPattern' });
  const coordMatrix = matrixBy(
    coordFields,
    (f) => f.instance,
    (f) => f.length,
  );
  const { t } = useTranslation();
  const cardinalDirection = findDataEntry({ field: 'coordinateUnit/displayName' });

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
          <tr>
            <SourceDataCell entry={cardinalDirection} />
            <InputDataCell entry={cardinalDirection} inputWidth="10em" />
          </tr>
        </tbody>
      </table>
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
              <SourceDataCell entry={coordMatrix[direction]?.['long']} />
              <SourceDataCell entry={coordMatrix[direction]?.['narrow']} />
              <InputDataCell entry={coordMatrix[direction]?.['long']} inputWidth="10em" />
              <InputDataCell entry={coordMatrix[direction]?.['narrow']} inputWidth="10em" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CoordinatesReviewTable;
