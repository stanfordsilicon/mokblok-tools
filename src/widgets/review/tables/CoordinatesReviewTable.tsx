import { CardinalDirection } from '@data/DataTypes';

import { SourceLanguageHeader } from '@settings/SourceLanguageLabel';
import { TargetLanguageHeader } from '@settings/TargetLanguageLabel';

import { matrixBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function CoordinatesReviewTable() {
  const findDataEntries = useFindDataEntriesInScope();
  const coordFields = findDataEntries({ field: 'coordinateUnitPattern' });
  const coordMatrix = matrixBy(
    coordFields,
    (f) => f.instance,
    (f) => f.length,
  );
  const { uitext } = useInterfaceTranslation();
  const cardinalDirection = findDataEntries({ field: 'coordinateUnit/displayName' })[0];

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
          <tr>
            <SourceDataCell entry={cardinalDirection} />
            <InputDataCell entry={cardinalDirection} inputWidth="10em" />
          </tr>
        </tbody>
      </table>
      <table>
        <thead style={{ textAlign: 'center' }}>
          <tr>
            <SourceLanguageHeader colSpan={2} />
            <TargetLanguageHeader colSpan={2} />
          </tr>
          <tr>
            <th>{uitext('length.long')}</th>
            <th>{uitext('length.narrow')}</th>
            <th>{uitext('length.long')}</th>
            <th>{uitext('length.narrow')}</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(CardinalDirection).map((direction) => (
            <tr key={direction}>
              <SourceDataCell entry={coordMatrix[direction]?.['long']} />
              <SourceDataCell entry={coordMatrix[direction]?.['narrow']} />
              <InputDataCell entry={coordMatrix[direction]?.['long']} inputWidth="10em" />
              <InputDataCell entry={coordMatrix[direction]?.['narrow']} inputWidth="10em" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CoordinatesReviewTable;
