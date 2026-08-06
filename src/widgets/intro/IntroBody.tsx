import { useTranslation } from 'react-i18next';

import SignInButton from '@settings/auth/SignInButton';
import InterfaceLanguageSelector from '@settings/selectors/InterfaceLanguageSelector';
import TargetLanguageSelector from '@settings/selectors/TargetLanguageSelector';
import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

/**
 * A page that immediately asks the user to select the source language and target language.
 */
const IntroBody: React.FC = () => {
  const { updateURLParams, admin } = useURLParams();
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '1rem' }}>
      <div>{t('intro.description')}</div>
      <InterfaceLanguageSelector />
      <TargetLanguageSelector />
      {admin && (
        <button onClick={() => updateURLParams({ step: StepName.Input })}>
          {t('intro.ctaInputStart')}
        </button>
      )}
      <button onClick={() => updateURLParams({ step: StepName.Review })}>
        {t('intro.ctaReviewStart')}
      </button>
      <SignInButton />
    </div>
  );
};

export default IntroBody;
