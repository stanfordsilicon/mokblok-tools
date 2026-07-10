import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import type { DataEntry } from '@data/DataTypes';

import getBackgroundColor from './getBackgroundColor';
import HighlightInput from './HighlightInput';

type Props = {
  entry?: DataEntry;
  inputWidth?: string;
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

function InputDataCell({ entry, inputWidth }: Props) {
  const { t } = useTranslation();
  const { getTranslation, setTranslation } = useDataContext();
  const backgroundColor = getBackgroundColor(entry);
  if (!entry) return <td>{t('common.emptyCell')}</td>;
  let width = inputWidth;
  if (!inputWidth) {
    width = WIDTHS_BY_LENGTH[entry.length] ?? WIDTHS_BY_LENGTH['w'];
  }

  return (
    <td>
      <HighlightInput
        highlight={/\d+/g}
        value={getTranslation(entry) || ''}
        onChange={(value) => setTranslation(entry.index, value)}
        style={{
          width,
          backgroundColor,
        }}
      />
    </td>
  );
}

export default InputDataCell;
