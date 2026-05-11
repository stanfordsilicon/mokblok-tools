import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function RegionsReviewTable() {
  const { t } = useTranslation();
  const { findDataFields } = useDataContext();
  const regions = findDataFields({ group: 'Regions' });

  return (
    <div>
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
          {regions.map((datum) => (
            <tr key={datum.instance}>
              <SourceDataCell data={datum} />
              <InputDataCell data={datum} inputWidth="15em" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegionsReviewTable;
