import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function QuartersReviewTable() {
  const { t } = useTranslation();
  const { findDataEntries } = useDataContext();
  const quarterFields = findDataEntries({ field: 'q' }).filter((f) => f.instance !== '');
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
          <th colSpan={2}>{t('review.translated')}</th>
        </tr>
        <tr>
          <th>{t('length.wide')}</th>
          <th title={t('review.abbreviated')}>{t('review.abbr')}</th>
          <th>{t('length.wide')}</th>
          <th title={t('review.abbreviated')}>{t('review.abbr')}</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(quarterMatrix)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([length, row]) => (
            <tr key={length}>
              <SourceDataCell entry={row['w']} />
              <SourceDataCell entry={row['a']} />
              <InputDataCell entry={row['w']} inputWidth="15em" />
              <InputDataCell entry={row['a']} inputWidth="10em" />
            </tr>
          ))}
      </tbody>
    </table>
  );
}

export default QuartersReviewTable;
