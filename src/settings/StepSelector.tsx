import { useTranslation } from 'react-i18next';

import StepName from './StepName';

const StepSelector: React.FC<{
  step: StepName;
  setStep: (step: StepName) => void;
}> = ({ step, setStep }) => {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', gap: '1em', marginLeft: '1em' }}>
      <StepButton
        label={t('input.title')}
        targetStep={StepName.Input}
        currentStep={step}
        setStep={setStep}
      />
      <StepButton
        label={t('review.title')}
        targetStep={StepName.Review}
        currentStep={step}
        setStep={setStep}
      />
      <StepButton
        label={t('export.title')}
        targetStep={StepName.Export}
        currentStep={step}
        setStep={setStep}
      />
      <StepButton
        label={t('settings.title')}
        targetStep={StepName.Settings}
        currentStep={step}
        setStep={setStep}
      />
    </div>
  );
};

const StepButton: React.FC<{
  label: string;
  targetStep: StepName;
  currentStep: StepName;
  setStep: (step: StepName) => void;
}> = ({ label, targetStep, currentStep, setStep }) => {
  const isCurrent = currentStep === targetStep;
  const border = isCurrent ? 'solid #ccc' : 'none';
  return (
    <button
      onClick={() => setStep(targetStep)}
      className={isCurrent ? 'selected' : ''}
      style={{
        borderRadius: '.5em .5em 0 0',
        borderTop: border,
        borderLeft: border,
        borderRight: border,
        padding: '.5em 1em',
      }}
    >
      {label}
    </button>
  );
};

export default StepSelector;
