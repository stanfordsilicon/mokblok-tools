import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';
import { useURLParams } from '@settings/URLParams';

import { uniqueBy } from '@shared/setUtils';

import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function DateIntervalsReviewTable() {
  const { t } = useTranslation();
  const { admin } = useURLParams();
  const { findDataEntries } = useDataContext();
  const intervalFormats = uniqueBy(
    findDataEntries({ section: DataSection.DateIntervals }).filter(
      (f) => !f.instance.includes('G') && !f.instance.match(/^h/i),
    ),
    (entry) => entry.xpath,
  );

  return (
    <table>
      <thead>
        <tr>
          {admin && <th>{t('review.components')}</th>}
          {admin && <th style={{ maxWidth: '100px' }}>{t('review.greatestDifference')}</th>}
          <th>
            <SourceLanguageLabel />
          </th>
          <th>{t('review.translated')}</th>
        </tr>
      </thead>
      <tbody>
        {intervalFormats?.map((entry) => (
          <tr key={entry.index}>
            {admin && <td>{entry.instance}</td>}
            {admin && <td>{entry.variant}</td>}
            <SourceDataCell entry={entry} />
            <InputDataCell entry={entry} inputWidth="25em" />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DateIntervalsReviewTable;
