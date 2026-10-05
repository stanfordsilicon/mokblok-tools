

import { groupBy } from '@shared/setUtils';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';

function DemosReview() {
  const findDataEntries = useFindDataEntriesInScope();
  const directionFields = groupBy(
    findDataEntries({ field: 'ordinalMinimalPairs' }),
    (f) => f.instance,
  );

  return <div></div>;
}

export default DemosReview;
