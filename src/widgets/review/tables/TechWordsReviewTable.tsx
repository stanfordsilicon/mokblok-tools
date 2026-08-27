import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';
import TargetLanguageLabel from '@settings/TargetLanguageLabel';

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
            <th>
              <SourceLanguageLabel />
            </th>
            <th>
              <TargetLanguageLabel />
            </th>
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
