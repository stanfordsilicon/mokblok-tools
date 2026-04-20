import { useDataContext } from '@data/DataContext';
import type { DataField } from '@data/DataTypes';

type Props = {
  data?: DataField;
  style?: React.CSSProperties;
};

function InputTextareaCell({ data, style }: Props) {
  const { getTranslation, setTranslation } = useDataContext();
  if (!data) return <td>-</td>;
  return (
    <td>
      <textarea
        value={getTranslation(data) || ''}
        onChange={(e) => setTranslation(data.index, e.target.value)}
        style={{
          width: '30em',
          ...style,
          backgroundColor: getTranslation(data, false)
            ? 'var(--color-input-background)'
            : 'var(--color-input-unfilled)',
        }}
      />
    </td>
  );
}

export default InputTextareaCell;
