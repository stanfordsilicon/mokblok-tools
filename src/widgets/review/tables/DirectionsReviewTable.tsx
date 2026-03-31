import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { getSourceLanguageData } from '../getSourceLanguageData';
import HighlightInput from '../HighlightInput';

function DirectionsReviewTable() {
  const {
    data: { directionExamples },
    set,
  } = useDataContext();

  return (
    <table>
      <thead>
        <tr>
          <th>
            <SourceLanguageLabel />
          </th>
          <th>Translated</th>
        </tr>
      </thead>
      <tbody>
        {directionExamples?.map((example, index) => (
          <tr key={example.key}>
            <td>{getSourceLanguageData(example)}</td>
            <td>
              <HighlightInput
                value={example.translated || ''}
                onChange={(value) => set.directionExamples(index, value)}
                highlight={/\d+/g}
                style={{ width: '20em' }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DirectionsReviewTable;
