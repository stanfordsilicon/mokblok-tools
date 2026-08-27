import { DataSection } from '@data/DataSection';

import { SourceLanguageHeader } from '@settings/SourceLanguageLabel';
import { TargetLanguageHeader } from '@settings/TargetLanguageLabel';

import { groupBy } from '@shared/setUtils';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputTextareaCell from '../input/InputTextareaCell';
import SourceDataCell from '../SourceDataCell';

function ParagraphsReviewTable() {
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
                <SourceLanguageHeader />
                <TargetLanguageHeader />
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
