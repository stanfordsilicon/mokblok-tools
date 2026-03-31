import { useDataContext } from '@data/DataContext';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { getSourceLanguageData } from '../getSourceLanguageData';
import HighlightInput from '../HighlightInput';

function DateCombinationsReviewTable() {
  const { dateCombinations } = useDataContext().data;

  return (
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
        {dateCombinations?.map((combination, index) => {
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
  );
}

type InputCellProps = { index: number };
function InputCell({ index }: InputCellProps) {
  const {
    data: { dateCombinations },
    set,
  } = useDataContext();
  return (
    <td>
      <HighlightInput
        value={dateCombinations?.[index]?.translated || ''}
        onChange={(value) => set.dateCombinations(index, value)}
        highlight={/\d+/g}
        style={{ width: '15em' }}
        disabled={!dateCombinations?.[index]} // Disable if this combination doesn't exist
      />
    </td>
  );
}

export default DateCombinationsReviewTable;
