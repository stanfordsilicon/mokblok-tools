import { DataSection } from '@data/DataSection';

import { SourceLanguageHeader } from '@settings/SourceLanguageLabel';
import { TargetLanguageHeader } from '@settings/TargetLanguageLabel';
import { useURLParams } from '@settings/URLParams';

import { uniqueBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function DateCombinationsReviewTable() {
  const { uitext } = useInterfaceTranslation();
  const { admin } = useURLParams();
  const findDataEntries = useFindDataEntriesInScope();
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
          {admin && <th>{uitext('review.components')}</th>}
          <SourceLanguageHeader />
          {admin && <th>{uitext('review.sourcePattern')}</th>}
          <TargetLanguageHeader />
        </tr>
      </thead>
      <tbody>
        {availableFormats?.map((entry) => (
          <tr key={entry.id}>
            {admin && (
              <td>
                {entry.instance} {entry.variant}
              </td>
            )}
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
