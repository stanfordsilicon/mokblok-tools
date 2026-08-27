import { DataSection } from '@data/DataSection';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';
import TargetLanguageLabel from '@settings/TargetLanguageLabel';

import { useFindDataEntriesInScope } from '../getDataEntriesForSection';
import InputDataCell from '../input/InputDataCell';
import SourceDataCell from '../SourceDataCell';

function RegionsReviewTable() {
  const findDataEntries = useFindDataEntriesInScope();
  const regions = findDataEntries({ section: DataSection.Regions });

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
          {regions.map((entry) => (
            <tr key={entry.instance + entry.length}>
              <SourceDataCell entry={entry} />
              <InputDataCell entry={entry} inputWidth="15em" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegionsReviewTable;
