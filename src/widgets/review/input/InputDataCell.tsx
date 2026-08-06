import { useTranslation } from 'react-i18next';

import type { DataEntry } from '@data/DataTypes';

import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

import InputEditText from './InputEditText';
import InputVoteHoverable from './InputVoteHoverable';

type Props = {
  entry?: DataEntry;
  inputWidth?: string;
};

function InputDataCell({ entry, inputWidth }: Props) {
  const { t } = useTranslation();
  const { step } = useURLParams();
  if (!entry) return <td>{t('common.emptyCell')}</td>;

  return (
    <td>
      {step === StepName.Edit ? (
        <InputEditText entry={entry} inputWidth={inputWidth} />
      ) : (
        <InputVoteHoverable entry={entry} inputWidth={inputWidth} />
      )}
    </td>
  );
}

export default InputDataCell;
