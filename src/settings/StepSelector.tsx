import { useTranslation } from 'react-i18next';

import StepName from './StepName';
import { useURLParams } from './URLParams';

const StepSelector: React.FC = () => {
  const { t } = useTranslation();
  const { admin } = useURLParams();
  if (!admin) return null;

  return (
    <div className="flex flex-wrap gap-1 rounded-[1.5rem]  ">
      <StepButton label={t('input.title')} targetStep={StepName.Input} />
      <StepButton label={t('edit.title')} targetStep={StepName.Edit} />
      <StepButton label={t('review.title')} targetStep={StepName.Review} />
      <StepButton label={t('export.title')} targetStep={StepName.Export} />
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
