import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { getSourceLanguageData } from '../getSourceLanguageData';
import HighlightInput from '../HighlightInput';

function DateCombinationsReviewTable() {
  const { dateCombinationsData } = useDataContext();

  return (
    <div>
      <h3>Date Combinations</h3>
      <table>
        <thead>
          <tr>
            <th>Shortened XPath</th>
            <th>
              <SourceLanguageLabel />
            </th>
            <th>Translated</th>
          </tr>
        </thead>
        <tbody>
          {dateCombinationsData?.map((combination, index) => {
            const shortXPath = combination.xpath
              ?.replace(/\/\/ldml\/dates\/calendars\/calendar\[@type="([a-z]{2})[^"]+"\]\//, '$1/')
              .replace(/\/([a-z])[a-z]*([A-Z])[a-z]*([A-Z])?[a-z]*/g, '/$1$2$3')
              .replace(/@[a-z]+="([a-zA-Z]+)"/g, '$1');
            return (
              <tr key={index}>
                <td>
                  <span title={shortXPath}>
                    {shortXPath?.slice(0, 20)}
                    {shortXPath && shortXPath.length > 20 ? '...' : ''}
                  </span>
                </td>
                <td>{getSourceLanguageData(combination)}</td>
                <InputCell index={index} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type InputCellProps = { index: number };
function InputCell({ index }: InputCellProps) {
  const { dateCombinationsData, setDateCombinationTranslation } = useDataContext();
  return (
    <td>
      <HighlightInput
        value={dateCombinationsData?.[index]?.translated || ''}
        onChange={(value) => setDateCombinationTranslation(index, value)}
        highlight={/\d+/g}
        style={{ width: '15em' }}
        disabled={!dateCombinationsData?.[index]} // Disable if this combination doesn't exist
      />
    </td>
  );
}

export default DateCombinationsReviewTable;
