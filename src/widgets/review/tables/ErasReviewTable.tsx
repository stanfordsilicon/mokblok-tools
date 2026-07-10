import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function ErasReviewTable() {
  const { findDataEntries } = useDataContext();
  const { t } = useTranslation();
  const eraFields = findDataEntries({ field: 'G' });
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
          <th colSpan={2}>{t('review.translated')}</th>
        </tr>
        <tr>
          <th>{t('length.wide')}</th>
          <th>{t('length.abbr')}</th>
          <th>{t('length.wide')}</th>
          <th>{t('length.abbr')}</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(eraMatrix)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([instance, row]) => (
            <tr key={instance}>
              <SourceDataCell entry={row['w']} />
              <SourceDataCell entry={row['a']} />
              <InputDataCell entry={row['w']} inputWidth="10em" />
              <InputDataCell entry={row['a']} inputWidth="4em" />
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default ErasReviewTable;
