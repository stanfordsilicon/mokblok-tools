import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';
import { useURLParams } from '@settings/URLParams';

import { sortBy, uniqueBy } from '@shared/setUtils';

import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function DateTimeCombinationsReviewTable() {
  const { admin } = useURLParams();
  const { findDataEntries } = useDataContext();
  const availableFormats = uniqueBy(
    sortBy(
      findDataEntries({ section: DataSection.DateTimes }),
      (entry) => entry.field + entry.variant + entry.length,
    ),
    (entry) => entry.field + entry.variant + entry.length,
  );
  const { t } = useTranslation();

  return (
    <table>
      <thead>
        <tr>
          {admin && <th>{t('review.field')}</th>}
          {admin && <th>{t('review.variant')}</th>}
          {admin && <th>{t('review.length')}</th>}
          <th>
            <SourceLanguageLabel />
          </th>
          <th>{t('review.translated')}</th>
        </tr>
      </thead>
      <tbody>
        {availableFormats?.map((entry) => (
          <tr key={entry.index}>
            {admin && <td>{entry.field}</td>}
            {admin && <td>{entry.variant}</td>}
            {admin && <td>{entry.length}</td>}
            <SourceDataCell entry={entry} />
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
