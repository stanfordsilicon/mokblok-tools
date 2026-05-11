import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function MonthsReviewTable() {
  const { t } = useTranslation();
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
            {t('review.translated')}
          </th>
        </tr>
        <tr>
          <th>{t('length.wide')}</th>
          <th title={t('review.abbreviated')}>{t('review.abbr')}</th>
          <th>{t('length.narrow')}</th>
          <th>{t('length.wide')}</th>
          <th title={t('review.abbreviated')}>{t('review.abbr')}</th>
          <th>{t('length.narrow')}</th>
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
