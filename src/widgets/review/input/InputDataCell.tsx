import type { DataEntry } from '@data/DataTypes';

import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import InputEditText from './InputEditText';
import InputVote from './InputVote';

type Props = {
  entry?: DataEntry;
  inputWidth?: string;
};

function InputDataCell({ entry, inputWidth }: Props) {
  const { uitext } = useInterfaceTranslation();
  const { step } = useURLParams();
  if (!entry) return <td>{uitext('common.emptyCell')}</td>;

  return (
    <td>
      {step === StepName.Edit ? (
        <InputEditText entry={entry} inputWidth={inputWidth} />
      ) : (
        <InputVote entry={entry} inputWidth={inputWidth} />
      )}
    </td>
  );
}

export default InputDataCell;
