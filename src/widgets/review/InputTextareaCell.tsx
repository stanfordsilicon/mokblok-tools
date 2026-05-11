import { useDataContext } from '@data/DataContext';
import type { DataField } from '@data/DataTypes';
import { useTranslation } from 'react-i18next';

type Props = {
  data?: DataField;
  style?: React.CSSProperties;
};

function InputTextareaCell({ data, style }: Props) {
  const { t } = useTranslation();
  const { getTranslation, setTranslation } = useDataContext();
  if (!data) return <td>{t('common.emptyCell')}</td>;
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
