import { useDataContext } from '@data/DataContext';
import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { groupBy, matrixBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function TimezonesReviewTable() {
  const { uitext } = useInterfaceTranslation();
  const { findDataEntries, getTranslation, findDataEntry } = useDataContext();
  const timezonesByGroup = groupBy(
    findDataEntries({ section: DataSection.Timezones }),
    (f) => f.group,
  );

  return (
    <div>
      {Object.entries(timezonesByGroup).map(([group, timezones]) => {
        const zonesByDaylight = matrixBy(
          timezones,
          (f) => f.instance,
          (f) => f.variant,
        );
        const groupNameTranslated = getTranslation(findDataEntry({ english: group }));
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
                  <th colSpan={3}>{uitext('review.translated')}</th>
                </tr>
                <tr>
                  <th></th>
                  <th>{uitext('review.timezone.generic')}</th>
                  <th>{uitext('review.timezone.standard')}</th>
                  <th>{uitext('review.timezone.daylight')}</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(zonesByDaylight).map(([instance, zones]) => (
                  <tr key={instance}>
                    <SourceDataCell entry={zones[''] ?? zones['generic'] ?? zones['standard']} />
                    <InputDataCell entry={zones[''] ?? zones['generic']} inputWidth="15em" />
                    <InputDataCell entry={zones['standard']} inputWidth="15em" />
                    <InputDataCell entry={zones['daylight']} inputWidth="15em" />
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
