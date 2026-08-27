import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { groupBy } from '@shared/setUtils';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputTextareaCell from '../input/InputTextareaCell';
import SourceDataCell from '../SourceDataCell';

function ParagraphsReviewTable() {
  const { uitext } = useInterfaceTranslation();
  const findDataEntries = useFindDataEntriesInScope();
  const paragraphsByGroup = groupBy(
    findDataEntries({ section: DataSection.Paragraphs }),
    (f) => f.field,
  );

  function getHeight(english: string) {
    return Math.max(english.length / 50, 1.5) + 'em';
  }

  return (
    <div>
      {Object.entries(paragraphsByGroup).map(([group, paragraphs]) => (
        <div key={group}>
          <h3>{group}</h3>
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
              {paragraphs.map((entry) => (
                <tr key={entry.instance}>
                  <SourceDataCell entry={entry} style={{ textWrap: 'balance' }} />
                  <InputTextareaCell
                    entry={entry}
                    style={{ height: getHeight(entry.english), width: '50em' }}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default ParagraphsReviewTable;
