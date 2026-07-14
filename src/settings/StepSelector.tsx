import { useTranslation } from 'react-i18next';

import StepName from './StepName';
import { useURLParams } from './URLParams';

const StepSelector: React.FC = () => {
  const { admin } = useURLParams();
  const { t } = useTranslation();
  if (!admin) return null;

  return (
    <div
      style={{
        display: 'flex',
        gap: '.5em',
        fontSize: '1em',
        borderBottom: '2px solid var(--color-text)',
        justifyContent: 'center',
      }}
    >
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
        padding: '.5em  ',
      }}
    >
      {label}
    </button>
  );
};

export default StepSelector;
