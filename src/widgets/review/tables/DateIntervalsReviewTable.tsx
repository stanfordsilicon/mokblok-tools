import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { FormattedDateString } from '../DateString';
import InputDataCell from '../InputDataCell';

function DateIntervalsReviewTable() {
  const { findDataEntries } = useDataContext();
  const intervalFormats = findDataEntries({ subject: 'dates', field: 'intervalFormats' }).filter(
    (f) => !f.instance.includes('G') && !f.instance.match(/^h/i),
  );
  const { t } = useTranslation();

  return (
    <table>
      <thead>
        <tr>
          <th>{t('review.components')}</th>
          <th style={{ maxWidth: '100px' }}>{t('review.greatestDifference')}</th>
          <th>
            <SourceLanguageLabel />
          </th>
          <th>{t('review.translated')}</th>
        </tr>
      </thead>
      <tbody>
        {intervalFormats?.map((entry) => (
          <tr key={entry.index}>
            <td>{entry.instance}</td>
            <td>{entry.variant}</td>
            <td>
              <FormattedDateString entry={entry} />
            </td>
            <InputDataCell entry={entry} inputWidth="25em" />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DateIntervalsReviewTable;
