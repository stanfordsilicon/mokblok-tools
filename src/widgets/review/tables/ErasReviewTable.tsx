import { useDataContext } from '@data/DataContext';
import { FormatLength } from '@data/DataTypes';

import SourceLanguageLabel from '@settings/SourceLanguageLabel';

import { matrixBy } from '@shared/setUtils';

import FormatWidth from '../FormatWidth';
import { getSourceLanguageData } from '../getSourceLanguageData';
import HighlightInput from '../HighlightInput';
import InputDataCell from '../InputDataCell';
import SourceDataCell from '../SourceDataCell';

function ErasReviewTable() {
  const { eras } = useDataContext().data;
  const { findDataFields } = useDataContext();
  const eraFields = findDataFields({ field: 'G' });
  const eraMatrix = matrixBy(
    eraFields,
    (f) => f.instance + f.variant,
    (f) => f.length,
  );

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
        {Object.entries(eraMatrix)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([instance, row]) => (
            <tr key={instance}>
              <SourceDataCell data={row['w']} />
              <SourceDataCell data={row['a']} />
              <InputDataCell data={row['w']} />
              <InputDataCell data={row['a']} />
            </tr>
          ))}
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
