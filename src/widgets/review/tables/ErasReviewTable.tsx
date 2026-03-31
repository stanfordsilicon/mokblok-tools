import { useDataContext } from '@data/DataContext';
import { FormatLength } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import FormatWidth from '../FormatWidth';
import { getSourceLanguageData } from '../getSourceLanguageData';
import HighlightInput from '../HighlightInput';

function ErasReviewTable() {
  const { eras } = useDataContext().data;

  return (
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
        {eras?.map((era, index) => (
          <tr key={index}>
            <td>{getSourceLanguageData(era?.[FormatLength.Wide])}</td>
            <td>{getSourceLanguageData(era?.[FormatLength.Abbreviated])}</td>
            <InputCell index={index} format={FormatLength.Wide} />
            <InputCell index={index} format={FormatLength.Abbreviated} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type InputCellProps = { index: number; format: FormatLength };
function InputCell({ format, index }: InputCellProps) {
  const {
    data: { eras },
    set,
  } = useDataContext();
  if (!eras || !(format in eras[index])) return null;
  return (
    <td>
      <HighlightInput
        value={eras[index][format]?.translated || ''}
        onChange={(value) => set.eras(index, format, value)}
        highlight={/\d+/g}
        style={{ width: FormatWidth[format] }}
      />
    </td>
  );
}

export default ErasReviewTable;
