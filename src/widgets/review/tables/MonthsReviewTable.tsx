import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function MonthsReviewTable() {
  const { t } = useTranslation();
  const { findDataEntries } = useDataContext();
  const monthFields = findDataEntries({ field: 'M' }).filter(
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
          <th title={t('length.abbreviated')}>{t('length.abbr')}</th>
          <th>{t('length.narrow')}</th>
          <th>{t('length.wide')}</th>
          <th title={t('length.abbreviated')}>{t('length.abbr')}</th>
          <th>{t('length.narrow')}</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(monthMatrix)
          .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
          .map(([length, row]) => (
            <tr key={length}>
              <SourceDataCell entry={row['w']} />
              <SourceDataCell entry={row['a']} />
              <SourceDataCell entry={row['n']} />
              <InputDataCell entry={row['w']} />
              <InputDataCell entry={row['a']} />
              <InputDataCell entry={row['n']} />
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default MonthsReviewTable;
