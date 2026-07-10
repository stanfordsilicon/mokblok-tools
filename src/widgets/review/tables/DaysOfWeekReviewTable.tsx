import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

// TODO allow for non-Sunday first day of week
const dayOfWeekOrdered = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

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
  const { t } = useTranslation();

  return (
    <table style={{ height: 'fit-content' }}>
      <thead>
        <tr>
          <th colSpan={4} style={{ textAlign: 'center' }}>
            <SourceLanguageLabel />
          </th>
          <th colSpan={4} style={{ textAlign: 'center' }}>
            {t('review.translated')}
          </th>
        </tr>
        <tr>
          <th>{t('length.wide')}</th>
          <th title={t('length.abbreviated')}>{t('length.abbr')}</th>
          <th>{t('length.short')}</th>
          <th>{t('length.narrow')}</th>
          <th>{t('length.wide')}</th>
          <th title={t('length.abbreviated')}>{t('length.abbr')}</th>
          <th>{t('length.short')}</th>
          <th>{t('length.narrow')}</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(daysOfTheWeekMatrix)
          .sort((a, b) => dayOfWeekOrdered.indexOf(a[0]) - dayOfWeekOrdered.indexOf(b[0]))
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
