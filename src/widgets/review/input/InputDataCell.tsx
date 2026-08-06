import { useTranslation } from 'react-i18next';

import type { DataEntry } from '@data/DataTypes';

import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

import InputEditText from './InputEditText';
import InputVote from './InputVote';

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
        <InputVote entry={entry} inputWidth={inputWidth} />
      )}
    </td>
  );
}

export default InputDataCell;
