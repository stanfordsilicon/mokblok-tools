import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import type { DataEntry } from '@data/DataTypes';

import getBackgroundColor from './getBackgroundColor';

type Props = {
  entry?: DataEntry;
  style?: React.CSSProperties;
};

function InputTextareaCell({ entry, style }: Props) {
  const { t } = useTranslation();
  const { getTranslation, setTranslation } = useDataContext();
  const backgroundColor = getBackgroundColor(entry);
  if (!entry) return <td>{t('common.emptyCell')}</td>;

  return (
    <td>
      <textarea
        value={getTranslation(entry) || ''}
        onChange={(e) => setTranslation(entry.index, e.target.value)}
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
