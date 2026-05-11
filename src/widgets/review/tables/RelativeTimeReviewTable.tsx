import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { DateField } from '@data/DateField';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function RelativeTimeReviewTable() {
  const { t } = useTranslation();
  const { findDataFields } = useDataContext();
  const relativeTimeFields = findDataFields({ subject: 'dates' }).filter(
    (f) => ['-1', '0', '1'].includes(f.instance) && f.length === '',
  );
  const relativeTimeMatrix = matrixBy(
    relativeTimeFields,
    (f) => f.field,
    (f) => f.instance,
  );

  return (
    <table>
      <thead>
        <tr>
          <th>{t('review.field')}</th>
          <th colSpan={3} style={{ textAlign: 'center' }}>
            <SourceLanguageLabel />
          </th>
          <th colSpan={3} style={{ textAlign: 'center' }}>
            {t('review.translated')}
          </th>
        </tr>
        <tr>
          <th></th>
          <th>{t('review.past')}</th>
          <th>{t('review.present')}</th>
          <th>{t('review.future')}</th>
          <th>{t('review.past')}</th>
          <th>{t('review.present')}</th>
          <th>{t('review.future')}</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(DateField).map((field) => {
          const data = relativeTimeMatrix[field];
          if (!data) return null;
          return (
            <tr key={field}>
              <td>{field}</td>
              <SourceDataCell data={data['-1']} />
              <SourceDataCell data={data['0']} />
              <SourceDataCell data={data['1']} />
              <InputDataCell data={data['-1']} />
              <InputDataCell data={data['0']} />
              <InputDataCell data={data['1']} />
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default RelativeTimeReviewTable;
