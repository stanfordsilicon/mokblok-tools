import { DataEntry } from '@data/DataTypes';
import useTranslationFromSourceLanguage from '@data/source/useTranslationFromSourceLanguage';
import { useTargetDataContext } from '@data/target/TargetDataProvider';

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
  const { getTranslation, editTranslation } = useTargetDataContext();
  const getBackgroundColor = useBackgroundColor();
  const getSourceTranslation = useTranslationFromSourceLanguage();

  const backgroundColor = getBackgroundColor(entry);
  let width = inputWidth;
  if (!inputWidth) width = WIDTHS_BY_LENGTH[entry.length] ?? WIDTHS_BY_LENGTH['w'];

  return (
    <HighlightInput
      highlight={/\d+/g}
      placeholder={getSourceTranslation(entry).translation}
      value={getTranslation(entry, false) || ''}
      onChange={(value) => editTranslation(entry.id, { edit: value })}
      style={{ width, backgroundColor }}
      disabled={disabled}
    />
  );
};

export default InputEditText;
