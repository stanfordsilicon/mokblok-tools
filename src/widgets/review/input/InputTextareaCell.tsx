import type { DataEntry } from '@data/DataTypes';
import useTranslationFromSourceLanguage from '@data/source/useTranslationFromSourceLanguage';
import { useTargetDataStore } from '@data/target/TargetDataProvider';
import { useTargetTranslation } from '@data/target/useTargetTranslation';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import useBackgroundColor from './getBackgroundColor';
import { moveReviewTableFocus, shouldNavigateFromTextField } from './reviewTableNavigation';

type Props = {
  entry?: DataEntry;
  style?: React.CSSProperties;
};

function InputTextareaCell({ entry, style }: Props) {
  const { uitext } = useInterfaceTranslation();
  const translation = useTargetTranslation(entry, false);
  const editTranslation = useTargetDataStore((state) => state.editTranslation);
  const backgroundColor = useBackgroundColor(entry);
  const getSourceTranslation = useTranslationFromSourceLanguage();
  if (!entry) return <td>{uitext('common.emptyCell')}</td>;

  return (
    <td>
      <textarea
        data-review-navigation-target
        placeholder={getSourceTranslation(entry).translation}
        value={translation || ''}
        onChange={(e) => editTranslation(entry.id, { edit: e.target.value })}
        onKeyDown={(event) => {
          if (shouldNavigateFromTextField(event.currentTarget, event.key)) {
            moveReviewTableFocus(event);
          }
        }}
        style={{ width: '30em', ...style, backgroundColor }}
      />
    </td>
  );
}

export default InputTextareaCell;
