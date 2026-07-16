import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { uniqueBy } from '@shared/setUtils';

import { useURLParams } from '@settings/URLParams';
import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function DateCombinationsReviewTable() {
  const { t } = useTranslation();
  const { admin } = useURLParams();
  const { findDataEntries } = useDataContext();
  const availableFormats = uniqueBy(
    findDataEntries({ section: DataSection.Dates }).filter(
      (f) => !f.instance.includes('G') && !f.instance.match(/^h/i),
    ),
    (entry) => entry.xpath,
  );

  return (
    <table>
      <thead>
        <tr>
          {admin && <th>{t('review.components')}</th>}
          <th>
            <SourceLanguageLabel />
          </th>
          {admin && <th>{t('review.sourcePattern')}</th>}
          <th>{t('review.translated')}</th>
        </tr>
      </thead>
      <tbody>
        {availableFormats?.map((entry) => (
          <tr key={entry.index}>
            {admin && <td>
              {entry.instance} {entry.variant}
            </td>}
            <SourceDataCell entry={entry} />
            {admin && <SourceDataCell entry={entry} convertPatternToExample={false} />}
            <InputDataCell entry={entry} inputWidth="20em" />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DateCombinationsReviewTable;
