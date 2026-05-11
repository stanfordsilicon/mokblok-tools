import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function DateCombinationsReviewTable() {
  const { findDataFields } = useDataContext();
  const availableFormats = findDataFields({ subject: 'dates', field: 'availableFormats' }).filter(
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
          <th>{t('review.translated')}</th>
        </tr>
      </thead>
      <tbody>
        {availableFormats?.map((datum) => (
          <tr key={datum.index}>
            <td>
              {datum.instance} {datum.variant}
            </td>
            <SourceDataCell data={datum} />
            <InputDataCell data={datum} inputWidth="20em" />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DateCombinationsReviewTable;
