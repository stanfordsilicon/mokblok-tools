import { useDataContext } from '@data/DataContext';
import type { DataEntry } from '@data/DataTypes';
import { useTargetDataContext } from '@data/TargetDataProvider';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import useBackgroundColor from './getBackgroundColor';

type Props = {
  entry?: DataEntry;
  style?: React.CSSProperties;
};

function InputTextareaCell({ entry, style }: Props) {
  const { uitext } = useInterfaceTranslation();
  const { getTranslation } = useDataContext();
  const { editTranslation } = useTargetDataContext();
  const getBackgroundColor = useBackgroundColor();
  if (!entry) return <td>{uitext('common.emptyCell')}</td>;

  return (
    <td>
      <textarea
        value={getTranslation(entry) || ''}
        onChange={(e) => editTranslation(entry.id, { edit: e.target.value })}
        style={{ width: '30em', ...style, backgroundColor: getBackgroundColor(entry) }}
      />
    </td>
  );
}

export default InputTextareaCell;
