import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { DateField } from '@data/DateField';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

const DateFieldsReviewTable: React.FC = () => {
  const { findDataFields } = useDataContext();
  const dateFields = findDataFields({ group: 'DateFields', exampleNum: '0' });
  const dateFieldMatrix = matrixBy(
    dateFields,
    (f) => f.field,
    (f) => f.length,
  );
  const { t } = useTranslation();

  return (
    <table>
      <thead>
        <tr>
          <th colSpan={3} style={{ textAlign: 'center' }}>
            <SourceLanguageLabel />
          </th>
          <th colSpan={3} style={{ textAlign: 'center' }}>
            {t('review.translated')}
          </th>
        </tr>
        <tr>
          <th>{t('length.wide')}</th>
          <th>{t('length.short')}</th>
          <th>{t('length.narrow')}</th>
          <th>{t('length.wide')}</th>
          <th>{t('length.short')}</th>
          <th>{t('length.narrow')}</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(DateField)
          .map((field) => dateFieldMatrix[field])
          .filter((row) => !!row) // Remove rows with no data
          .map((row, index) => (
            <tr key={index}>
              <SourceDataCell data={row['w']} />
              <SourceDataCell data={row['s']} />
              <SourceDataCell data={row['n']} />
              <InputDataCell data={row['w']} />
              <InputDataCell data={row['s']} />
              <InputDataCell data={row['n']} />
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default DateFieldsReviewTable;
