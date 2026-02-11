import StepName from './StepName';

const StepSelector: React.FC<{
  step: StepName;
  setStep: (step: StepName) => void;
}> = ({ step, setStep }) => {
  return (
    <div style={{ display: 'flex', gap: '1em', marginLeft: '1em' }}>
      <StepButton label="Input" targetStep={StepName.Input} currentStep={step} setStep={setStep} />
      <StepButton
        label="Review"
        targetStep={StepName.Review}
        currentStep={step}
        setStep={setStep}
      />
      <StepButton
        label="Export"
        targetStep={StepName.Export}
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
