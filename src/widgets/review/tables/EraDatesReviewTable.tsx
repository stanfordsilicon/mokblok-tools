import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function EraDatesReviewTable() {
  const { findDataFields } = useDataContext();
  const allEraFields = findDataFields({ subject: 'dates' }).filter((f) => f.instance.includes('G'));
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
              Dates
            </th>
          </tr>
          {availableEraDates.map((datum) => (
            <tr key={datum.index}>
              <SourceDataCell data={datum} />
              <InputDataCell data={datum} inputWidth="10em" />
            </tr>
          ))}
          <tr>
            <th colSpan={2} style={{ textAlign: 'center' }}>
              Intervals
            </th>
          </tr>
          {eraIntervals.map((datum) => (
            <tr key={datum.index}>
              <SourceDataCell data={datum} />
              <InputDataCell data={datum} inputWidth="20em" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EraDatesReviewTable;
