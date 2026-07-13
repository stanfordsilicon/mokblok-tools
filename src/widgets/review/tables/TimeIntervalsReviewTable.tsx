import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { sortBy, uniqueBy } from '@shared/setUtils';

import { FormattedDateString } from '../DateString';
import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function TimeIntervalsReviewTable() {
  const { t } = useTranslation();
  const { findDataEntries } = useDataContext();
  const intervalFormats = uniqueBy(
    sortBy(findDataEntries({ section: DataSection.TimeIntervals }), (f) => f.instance),
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
        {intervalFormats.map((entry) => (
          <tr key={entry.index}>
            <td>{entry.instance}</td>
            <td>{entry.variant}</td>
            <td>
              <FormattedDateString entry={entry} />
            </td>
            <SourceDataCell entry={entry} />
            <InputDataCell entry={entry} inputWidth="15em" />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TimeIntervalsReviewTable;
