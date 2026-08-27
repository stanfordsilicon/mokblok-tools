import PluralAmount from '@data/PluralAmount';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { groupBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function DirectionsReviewTable() {
  const findDataEntries = useFindDataEntriesInScope();
  const directionFields = groupBy(
    findDataEntries({ field: 'ordinalMinimalPairs' }),
    (f) => f.instance,
  );
  const { uitext } = useInterfaceTranslation();

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>{uitext('review.translated')}</th>
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
