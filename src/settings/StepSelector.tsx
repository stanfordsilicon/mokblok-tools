import { useTranslation } from 'react-i18next';

import StepName from './StepName';
import { useURLParams } from './URLParams';

const StepSelector: React.FC<{
  toggleSettings?: () => void;
}> = ({ toggleSettings }) => {
  const { step } = useURLParams();
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', gap: '1em', marginLeft: '1em' }}>
      {step !== StepName.Intro && (
        <>
          <StepButton label={t('input.title')} targetStep={StepName.Input} />
          <StepButton label={t('review.title')} targetStep={StepName.Review} />
          <StepButton label={t('export.title')} targetStep={StepName.Export} />
        </>
      )}
      <button onClick={toggleSettings} style={{ marginLeft: 'auto', padding: '.5em 1em' }}>
        {t('settings.title')} ⚙
      </button>
    </div>
  );
};

const StepButton: React.FC<{
  label: string;
  targetStep: StepName;
}> = ({ label, targetStep }) => {
  const { step: currentStep, updateURLParams } = useURLParams();
  const isCurrent = currentStep === targetStep;
  const border = isCurrent ? 'solid #ccc' : 'none';
  return (
    <button
      onClick={() => updateURLParams({ step: targetStep })}
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
