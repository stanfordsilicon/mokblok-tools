import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { groupBy, matrixBy } from '@shared/setUtils';

import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function TimezonesReviewTable() {
  const { findDataFields, getTranslation, findDataField } = useDataContext();
  const timezonesByGroup = groupBy(findDataFields({ subject: 'timezones' }), (f) => f.group);

  return (
    <div>
      {Object.entries(timezonesByGroup).map(([group, timezones]) => {
        const zonesByDaylight = matrixBy(
          timezones,
          (f) => f.instance,
          (f) => f.variant,
        );
        const groupNameTranslated = getTranslation(findDataField({ english: group }));
        return (
          <div key={group}>
            <h3>
              {groupNameTranslated && groupNameTranslated !== group
                ? `${groupNameTranslated} (${group})`
                : group}
            </h3>
            <table>
              <thead>
                <tr>
                  <th>
                    <SourceLanguageLabel />
                  </th>
                  <th colSpan={3}>Translated</th>
                </tr>
                <tr>
                  <th></th>
                  <th>Generic, City Name</th>
                  <th>Standard</th>
                  <th>Daylight</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(zonesByDaylight).map(([instance, zones]) => (
                  <tr key={instance}>
                    <SourceDataCell data={zones[''] ?? zones['generic'] ?? zones['standard']} />
                    <InputDataCell data={zones[''] ?? zones['generic']} inputWidth="15em" />
                    <InputDataCell data={zones['standard']} inputWidth="15em" />
                    <InputDataCell data={zones['daylight']} inputWidth="15em" />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

export default TimezonesReviewTable;
