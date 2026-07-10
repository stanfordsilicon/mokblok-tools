import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { sortBy, uniqueBy } from '@shared/setUtils';

import { FormattedDateString } from '../DateString';
import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function DateTimeCombinationsReviewTable() {
  const { findDataEntries } = useDataContext();
  const availableFormats = uniqueBy(
    sortBy(
      findDataEntries({ group: 'DateTimes' }),
      (entry) => entry.field + entry.variant + entry.length,
    ),
    (entry) => entry.field + entry.variant + entry.length,
  );
  const { t } = useTranslation();

  return (
    <table>
      <thead>
        <tr>
          <th>{t('review.field')}</th>
          <th>{t('review.variant')}</th>
          <th>{t('review.length')}</th>
          <th>
            <SourceLanguageLabel />
          </th>
          <th>{t('review.translated')}</th>
        </tr>
      </thead>
      <tbody>
        {availableFormats?.map((entry) => (
          <tr key={entry.index}>
            <td>{entry.field}</td>
            <td>{entry.variant}</td>
            <td>{entry.length}</td>
            <SourceDataCell entry={entry} />
            <td>
              <FormattedDateString entry={entry} />
            </td>
            <InputDataCell
              entry={entry}
              inputWidth={entry.field === 'dateFormats' ? '10em' : '25em'}
            />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DateTimeCombinationsReviewTable;
