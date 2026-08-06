import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';
import { useURLParams } from '@settings/URLParams';

import { matrixBy } from '@shared/setUtils';

import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function TimeCombinationsReviewTable() {
  const { t } = useTranslation();
  const { admin } = useURLParams();
  const { findDataEntries } = useDataContext();
  const timesArray = findDataEntries({ section: DataSection.Times });
  const timesMatrix = matrixBy(
    timesArray,
    (f) => f.instance,
    (f) => f.exampleNum,
  );

  return (
    <table>
      <thead>
        <tr>
          {admin && <th>{t('review.type')}</th>}
          <th colSpan={admin ? 3 : 2} style={{ textAlign: 'center' }}>
            <SourceLanguageLabel />
          </th>
          <th colSpan={admin ? 3 : 2} style={{ textAlign: 'center' }}>
            {t('review.translated')}
          </th>
        </tr>
        <tr>
          {admin && <th></th>}
          <th>{t('review.morning')}</th>
          <th>{t('review.evening')}</th>
          {admin && <th>{t('review.pattern')}</th>}
          <th>{t('review.morning')}</th>
          <th>{t('review.evening')}</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(timesMatrix).map(([instance, row]) => (
          <tr key={instance}>
            {admin && <td>{instance}</td>}
            <SourceDataCell entry={row['1']} />
            <SourceDataCell entry={row['2']} />
            {admin && <SourceDataCell entry={row['1']} convertPatternToExample={false} />}
            <InputDataCell entry={row['1']} />
            <InputDataCell entry={row['2']} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TimeCombinationsReviewTable;
