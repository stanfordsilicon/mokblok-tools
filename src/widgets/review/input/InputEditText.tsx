import { useDataContext } from '@data/DataContext';
import { DataEntry } from '@data/DataTypes';
import { useTargetDataContext } from '@data/TargetDataProvider';

import useBackgroundColor from './getBackgroundColor';
import HighlightInput from './HighlightInput';

type Props = {
  entry: DataEntry;
  inputWidth?: string;
  disabled?: boolean;
};

const WIDTHS_BY_LENGTH: Record<string, string> = {
  w: '6em',
  a: '3em',
  s: '3em',
  n: '2em',
  long: '15em',
  medium: '10em',
  short: '6em',
  narrow: '2em',
};

const InputEditText: React.FC<Props> = ({ entry, inputWidth, disabled = false }) => {
  const { getTranslation } = useDataContext();
  const { editTranslation } = useTargetDataContext();
  const getBackgroundColor = useBackgroundColor();

  const backgroundColor = getBackgroundColor(entry);
  let width = inputWidth;
  if (!inputWidth) width = WIDTHS_BY_LENGTH[entry.length] ?? WIDTHS_BY_LENGTH['w'];

  return (
    <HighlightInput
      highlight={/\d+/g}
      value={getTranslation(entry) || ''}
      onChange={(value) => editTranslation(entry.id, { edit: value })}
      style={{ width, backgroundColor }}
      disabled={disabled}
    />
  );
};

export default InputEditText;
