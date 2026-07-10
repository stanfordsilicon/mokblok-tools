import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import getSourcePattern from '@data/getSourcePattern';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { FormattedDateString } from '../DateString';
import InputDataCell from '../InputDataCell';

function DateCombinationsReviewTable() {
  const { findDataEntries } = useDataContext();
  const availableFormats = findDataEntries({ subject: 'dates', field: 'availableFormats' }).filter(
    (f) => !f.instance.includes('G') && !f.instance.match(/^h/i),
  );
  const { t } = useTranslation();

  return (
    <table>
      <thead>
        <tr>
          <th>{t('review.components')}</th>
          <th>
            <SourceLanguageLabel />
          </th>
          <th>{t('review.sourcePattern')}</th>
          <th>{t('review.translated')}</th>
        </tr>
      </thead>
      <tbody>
        {availableFormats?.map((entry) => (
          <tr key={entry.index}>
            <td>
              {entry.instance} {entry.variant}
            </td>
            {/* <SourceDataCell entry={entry} /> */}
            <td>
              <FormattedDateString entry={entry} />
            </td>
            <td>{getSourcePattern(entry)}</td>
            <InputDataCell entry={entry} inputWidth="20em" />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DateCombinationsReviewTable;
