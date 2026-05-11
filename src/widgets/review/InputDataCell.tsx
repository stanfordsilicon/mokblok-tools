import { useTranslation } from 'react-i18next';

import { useDataContext } from '@data/DataContext';
import type { DataField } from '@data/DataTypes';

import HighlightInput from './HighlightInput';

type Props = {
  data?: DataField;
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

function InputDataCell({ data, inputWidth }: Props) {
  const { t } = useTranslation();
  const { getTranslation, setTranslation } = useDataContext();
  if (!data) return <td>{t('common.emptyCell')}</td>;
  let width = inputWidth;
  if (!inputWidth) {
    width = WIDTHS_BY_LENGTH[data.length] ?? WIDTHS_BY_LENGTH['w'];
  }
  return (
    <td>
      <HighlightInput
        highlight={/\d+/g}
        value={getTranslation(data) || ''}
        onChange={(value) => setTranslation(data.index, value)}
        style={{
          width,
          backgroundColor: getTranslation(data, false)
            ? 'var(--color-input-background)'
            : 'var(--color-input-unfilled)',
        }}
      />
    </td>
  );
}

export default InputDataCell;
