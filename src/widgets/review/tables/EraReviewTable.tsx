import { useDataContext } from '@data/DataContext';
import { FormatLength } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import FormatWidth from '../FormatWidth';
import { getSourceLanguageData } from '../getSourceLanguageData';
import HighlightInput from '../HighlightInput';

function EraReviewTable() {
  const { erasData } = useDataContext();

  return (
    <div>
      <h3>Eras</h3>
      <table>
        <thead style={{ textAlign: 'center' }}>
          <tr>
            <th colSpan={2}>
              <SourceLanguageLabel />
            </th>
            <th colSpan={2}>Translated</th>
          </tr>
          <tr>
            <th>Wide</th>
            <th>Abbr.</th>
            <th>Wide</th>
            <th>Abbr.</th>
          </tr>
        </thead>
        <tbody>
          {erasData?.map((era, index) => {
            return (
              <tr key={index}>
                <td>{getSourceLanguageData(era?.[FormatLength.Wide])}</td>
                <td>{getSourceLanguageData(era?.[FormatLength.Abbreviated])}</td>
                <InputCell index={index} format={FormatLength.Wide} />
                <InputCell index={index} format={FormatLength.Abbreviated} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type InputCellProps = { index: number; format: FormatLength };
function InputCell({ format, index }: InputCellProps) {
  const { erasData, setEraData } = useDataContext();
  if (!erasData || !(format in erasData[index])) return null;
  return (
    <td>
      <HighlightInput
        value={erasData[index][format]?.translated || ''}
        onChange={(value) => setEraData(index, format, value)}
        highlight={/\d+/g}
        style={{ width: FormatWidth[format] }}
      />
    </td>
  );
}

export default EraReviewTable;
