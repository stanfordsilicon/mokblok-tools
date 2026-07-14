import { useTranslation } from 'react-i18next';

import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

const IntroCTAs: React.FC = () => {
  const { updateURLParams, admin } = useURLParams();
  const { t } = useTranslation();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: '1rem',
        padding: '1em',
      }}
    >
      {admin && (
        <button onClick={() => updateURLParams({ step: StepName.Input })}>
          {t('intro.ctaInputStart')}
        </button>
      )}
      <button onClick={() => updateURLParams({ step: StepName.Review })}>
        {t('intro.ctaReviewStart')}
      </button>
    </div>
  );
};

export default IntroCTAs;
