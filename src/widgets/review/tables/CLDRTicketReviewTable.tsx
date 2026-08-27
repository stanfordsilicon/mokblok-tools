import { DataSection } from '@data/DataSection';

import { SourceLanguageHeader } from '@settings/SourceLanguageLabel';
import { TargetLanguageHeader } from '@settings/TargetLanguageLabel';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputTextareaCell from '../input/InputTextareaCell';
import SourceDataCell from '../SourceDataCell';

function CLDRTicketReviewTable() {
  const findDataEntries = useFindDataEntriesInScope();
  const sentences = findDataEntries({ section: DataSection.CLDRTicket });

  function getHeight(english: string) {
    return Math.max(english.length / 50, 1.5) + 'em';
  }

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
          {sentences.map((sentence) => (
            <tr key={sentence.instance}>
              <SourceDataCell entry={sentence} style={{ textWrap: 'balance' }} />
              <InputTextareaCell
                entry={sentence}
                style={{ height: getHeight(sentence.english), width: '50em' }}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CLDRTicketReviewTable;
