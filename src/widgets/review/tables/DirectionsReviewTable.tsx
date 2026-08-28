import PluralAmount from '@data/PluralAmount';

import { SourceLanguageHeader } from '@settings/SourceLanguageLabel';
import { TargetLanguageHeader } from '@settings/TargetLanguageLabel';

import { groupBy } from '@shared/setUtils';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function DirectionsReviewTable() {
  const findDataEntries = useFindDataEntriesInScope();
  const directionFields = groupBy(
    findDataEntries({ field: 'ordinalMinimalPairs' }),
    (f) => f.instance,
  );

  return (
    <div>
      <table>
        <thead>
          <tr>
            <SourceLanguageHeader />
            <TargetLanguageHeader />
          </tr>
        </thead>
        <tbody>
          {Object.values(PluralAmount).map(
            (pluralAmount) =>
              directionFields[pluralAmount] && (
                <tr key={pluralAmount}>
                  <SourceDataCell entry={directionFields[pluralAmount][0]} />
                  <InputDataCell entry={directionFields[pluralAmount][0]} inputWidth="15em" />
                </tr>
              ),
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DirectionsReviewTable;
