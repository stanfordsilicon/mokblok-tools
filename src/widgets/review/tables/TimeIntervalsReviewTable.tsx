import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { sortBy, uniqueBy } from '@shared/setUtils';

import { FormattedDateString } from '../DateString';
import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function TimeIntervalsReviewTable() {
  const { t } = useTranslation();
  const { findDataFields } = useDataContext();
  const intervalFormats = uniqueBy(
    sortBy(findDataFields({ group: 'TimeIntervals' }), (f) => f.instance),
    (f) => f.english,
  );

  return (
    <table>
      <thead>
        <tr>
          <th>{t('review.components')}</th>
          <th>{t('review.greatestDifference')}</th>
          <th style={{ textAlign: 'center' }}>
            <SourceLanguageLabel />
          </th>
          <th style={{ textAlign: 'center' }}>{t('review.translated')}</th>
        </tr>
      </thead>
      <tbody>
        {intervalFormats.map((datum) => (
          <tr key={datum.index}>
            <td>{datum.instance}</td>
            <td>{datum.variant}</td>
            <td>
              <FormattedDateString entry={datum} />
            </td>
            <SourceDataCell data={datum} />
            <InputDataCell data={datum} inputWidth="15em" />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TimeIntervalsReviewTable;
