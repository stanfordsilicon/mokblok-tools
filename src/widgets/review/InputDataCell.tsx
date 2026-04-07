import { useDataContext } from '@data/DataContext';
import type { DataField } from '@data/DataTypes';

import HighlightInput from './HighlightInput';

type Props = {
  data: DataField;
};
function InputDataCell({ data }: Props) {
  const { getTranslation, setTranslation } = useDataContext();
  return (
    <td>
      <HighlightInput
        highlight={/\d+/g}
        value={getTranslation(data.index) || ''}
        onChange={(value) => setTranslation(data.index, value)}
        style={{ width: data.length === 'w' ? '15em' : '10em' }}
      />
    </td>
  );
}

export default InputDataCell;
