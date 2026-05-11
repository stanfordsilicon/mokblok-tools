import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { sortBy, uniqueBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function DateTimeCombinationsReviewTable() {
  const { findDataFields } = useDataContext();
  const availableFormats = uniqueBy(
    sortBy(
      findDataFields({ group: 'DateTimes' }),
      (datum) => datum.field + datum.variant + datum.length,
    ),
    (datum) => datum.field + datum.variant + datum.length,
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
        {availableFormats?.map((datum) => (
          <tr key={datum.index}>
            <td>{datum.field}</td>
            <td>{datum.variant}</td>
            <td>{datum.length}</td>
            <SourceDataCell data={datum} />
            <InputDataCell
              data={datum}
              inputWidth={datum.field === 'dateFormats' ? '10em' : '25em'}
            />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DateTimeCombinationsReviewTable;
