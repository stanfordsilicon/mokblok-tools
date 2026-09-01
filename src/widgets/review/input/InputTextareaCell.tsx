import type { DataEntry } from '@data/DataTypes';
import { useTargetDataContext } from '@data/target/TargetDataProvider';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import useBackgroundColor from './getBackgroundColor';
import { moveReviewTableFocus, shouldNavigateFromTextField } from './reviewTableNavigation';

type Props = {
  entry?: DataEntry;
  style?: React.CSSProperties;
};

function InputTextareaCell({ entry, style }: Props) {
  const { uitext } = useInterfaceTranslation();
  const { getTranslation, editTranslation } = useTargetDataContext();
  const getBackgroundColor = useBackgroundColor();
  if (!entry) return <td>{uitext('common.emptyCell')}</td>;

  return (
    <td>
      <textarea
        data-review-navigation-target
        value={getTranslation(entry) || ''}
        onChange={(e) => editTranslation(entry.id, { edit: e.target.value })}
        onKeyDown={(event) => {
          if (shouldNavigateFromTextField(event.currentTarget, event.key)) {
            moveReviewTableFocus(event);
          }
        }}
        style={{ width: '30em', ...style, backgroundColor: getBackgroundColor(entry) }}
      />
    </td>
  );
}

export default InputTextareaCell;
