import { DataSection } from '@data/DataSection';

import { SourceLanguageHeader } from '@settings/SourceLanguageLabel';
import { TargetLanguageHeader } from '@settings/TargetLanguageLabel';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function TechWordsReviewTable() {
  const findDataEntries = useFindDataEntriesInScope();
  const techWords = findDataEntries({ section: DataSection.TechWords });

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
          {techWords.map((entry) => (
            <tr key={entry.instance}>
              <SourceDataCell entry={entry} />
              <InputDataCell entry={entry} inputWidth="15em" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TechWordsReviewTable;
