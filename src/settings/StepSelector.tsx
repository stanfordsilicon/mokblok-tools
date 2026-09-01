import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import StepName from './StepName';
import { useURLParams } from './URLParams';

const StepSelector: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { admin } = useURLParams();

  if (!admin) return null;

  return (
    <div className={`flex flex-wrap ${admin ? 'gap-1' : 'gap-4'} rounded-[1.5rem]`}>
      {admin && <StepButton label={uitext('nav.import')} targetStep={StepName.Import} />}
      <StepButton label={uitext('nav.edit')} targetStep={StepName.Edit} />
      {admin && <StepButton label={uitext('nav.review')} targetStep={StepName.Vote} />}
      {admin && <StepButton label={uitext('nav.export')} targetStep={StepName.Export} />}
    </div>
  );
};

const StepButton: React.FC<{
  label: string;
  targetStep: StepName;
}> = ({ label, targetStep }) => {
  const { step: currentStep, updateURLParams } = useURLParams();
  const isCurrent = currentStep === targetStep;
  return (
    <button
      onClick={() => updateURLParams({ step: targetStep })}
      className={`StepButton text-sm flex-1 ${isCurrent ? 'selected' : ''}`}
    >
      {label}
    </button>
  );
};

export default StepSelector;
