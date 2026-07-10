import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import type { DataField } from '@data/DataTypes';

import getBackgroundColor from './getBackgroundColor';

type Props = {
  data?: DataField;
  style?: React.CSSProperties;
};

function InputTextareaCell({ data, style }: Props) {
  const { t } = useTranslation();
  const { getTranslation, setTranslation } = useDataContext();
  const backgroundColor = getBackgroundColor(data);
  if (!data) return <td>{t('common.emptyCell')}</td>;

  return (
    <td>
      <textarea
        value={getTranslation(data) || ''}
        onChange={(e) => setTranslation(data.index, e.target.value)}
        style={{
          width: '30em',
          ...style,
          backgroundColor,
        }}
      />
    </td>
  );
}

export default InputTextareaCell;
