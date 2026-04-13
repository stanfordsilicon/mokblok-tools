import { useDataContext } from '@data/DataContext';
import type { DataField } from '@data/DataTypes';

import HighlightInput from './HighlightInput';

type Props = {
  data?: DataField;
  inputWidth?: 'short' | 'long';
};

const SHORT_WIDTHS: Record<string, string> = {
  w: '6em',
  a: '3em',
  s: '3em',
  n: '2em',
};

function InputDataCell({ data, inputWidth = 'short' }: Props) {
  const { getTranslation, setTranslation } = useDataContext();
  if (!data) return <td>-</td>;
  let width = data.length === 'w' || !data.length ? '15em' : '10em';
  if (inputWidth === 'short') {
    width = SHORT_WIDTHS[data.length] ?? SHORT_WIDTHS['w'];
  }
  return (
    <td>
      <HighlightInput
        highlight={/\d+/g}
        value={getTranslation(data) || ''}
        onChange={(value) => setTranslation(data.index, value)}
        style={{ width }}
      />
    </td>
  );
}

export default InputDataCell;
