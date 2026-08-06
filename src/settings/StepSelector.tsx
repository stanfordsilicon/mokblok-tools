import { useTranslation } from 'react-i18next';

import StepName from './StepName';
import { useURLParams } from './URLParams';

const StepSelector: React.FC = () => {
  const { admin } = useURLParams();
  const { t } = useTranslation();
  if (!admin) return null;

  return (
    <div className="flex flex-wrap gap-2 rounded-[1.5rem] border border-(--silicon-line) bg-white p-2 shadow-sm">
      <StepButton label={t('input.title')} targetStep={StepName.Input} />
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
      className={`rounded-full px-4 py-2 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--silicon-purple) ${
        isCurrent
          ? 'selected shadow-sm'
          : 'border-(--silicon-line-strong) bg-white text-(--silicon-ink) hover:border-(--silicon-purple)'
      }`}
    >
      {label}
    </button>
  );
};

export default StepSelector;
