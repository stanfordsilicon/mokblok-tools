import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function TimeCombinationsReviewTable() {
  const { t } = useTranslation();
  const { findDataFields } = useDataContext();
  const timesArray = findDataFields({ group: 'Times' });
  const timesMatrix = matrixBy(
    timesArray,
    (f) => f.instance,
    (f) => f.exampleNum,
  );

  return (
    <table>
      <thead>
        <tr>
          <th>{t('review.type')}</th>
          <th colSpan={3} style={{ textAlign: 'center' }}>
            <SourceLanguageLabel />
          </th>
          <th colSpan={3} style={{ textAlign: 'center' }}>
            {t('review.translated')}
          </th>
        </tr>
        <tr>
          <th></th>
          <th>{t('review.morning')}</th>
          <th>{t('review.evening')}</th>
          <th>{t('review.pattern')}</th>
          <th>{t('review.morning')}</th>
          <th>{t('review.evening')}</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(timesMatrix).map(([instance, data]) => (
          <tr key={instance}>
            <td>{instance}</td>
            <SourceDataCell data={data['1']} />
            <SourceDataCell data={data['2']} />
            <td>{data[1].englishPattern}</td>
            <InputDataCell data={data['1']} />
            <InputDataCell data={data['2']} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TimeCombinationsReviewTable;
