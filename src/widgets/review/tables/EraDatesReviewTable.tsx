import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { FormattedDateString } from '../DateString';
import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function EraDatesReviewTable() {
  const { findDataEntries } = useDataContext();
  const allEraFields = findDataEntries({ section: DataSection.EraDates }).filter((f) =>
    f.instance.includes('G'),
  );
  const availableEraDates = allEraFields.filter((f) => f.field === 'availableFormats');
  const eraIntervals = allEraFields.filter((f) => f.field === 'intervalFormats');
  const { t } = useTranslation();

  return (
    <div>
      Note: When this data was originally requested, it did not keep eras in the examples so the
      original translations may be missing era fields.
      <table>
        <thead>
          <tr>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>{t('review.translated')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th colSpan={2} style={{ textAlign: 'center' }}>
              {t('review.dates')}
            </th>
          </tr>
          {availableEraDates.map((entry) => (
            <tr key={entry.index}>
              <SourceDataCell entry={entry} />
              <InputDataCell entry={entry} inputWidth="10em" />
            </tr>
          ))}
          <tr>
            <th colSpan={2} style={{ textAlign: 'center' }}>
              {t('review.intervals')}
            </th>
          </tr>
          {eraIntervals.map((entry) => (
            <tr key={entry.index}>
              <SourceDataCell entry={entry} />
              <td>
                <FormattedDateString entry={entry} />
              </td>
              <td>{entry.englishPattern}</td>
              <InputDataCell entry={entry} inputWidth="25em" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EraDatesReviewTable;
