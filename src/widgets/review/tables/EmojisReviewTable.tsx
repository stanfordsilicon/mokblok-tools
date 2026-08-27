import { DataSection } from '@data/DataSection';

import { SourceLanguageHeader } from '@settings/SourceLanguageLabel';
import { TargetLanguageHeader } from '@settings/TargetLanguageLabel';

import { groupBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function EmojisReviewTable() {
  const findDataEntries = useFindDataEntriesInScope();
  const emojisByGroup = groupBy(findDataEntries({ section: DataSection.Emoji }), (f) => f.group);
  const { uitext } = useInterfaceTranslation();

  return (
    <div>
      Write the name describing the emoji -- you don&apos;t necessarily need to stay true to the
      source word, but explain what the emoji means.
      {Object.entries(emojisByGroup).map(([group, emojis]) => (
        <div key={group}>
          <h3>{group}</h3>
          <table>
            <thead>
              <tr>
                <th>{uitext('dataSection.emoji')}</th>
                <SourceLanguageHeader />
                <TargetLanguageHeader />
              </tr>
            </thead>
            <tbody>
              {emojis.map((entry) => (
                <tr key={entry.instance}>
                  <td>{entry.instance}</td>
                  <SourceDataCell entry={entry} />
                  <InputDataCell entry={entry} inputWidth="15em" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default EmojisReviewTable;
