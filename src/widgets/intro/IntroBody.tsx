import SignInButton from '@settings/auth/SignInButton';
import InterfaceLanguageSelector from '@settings/selectors/InterfaceLanguageSelector';
import TargetLanguageSelector from '@settings/selectors/TargetLanguageSelector';
import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

/**
 * A page that immediately asks the user to select the source language and target language.
 */
const IntroBody: React.FC = () => {
  const { updateURLParams, admin } = useURLParams();
  const { uitext } = useInterfaceTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '1rem' }}>
      <div>{uitext('intro.description')}</div>
      <InterfaceLanguageSelector />
      <TargetLanguageSelector />
      {admin && (
        <button onClick={() => updateURLParams({ step: StepName.Input })}>
          {uitext('intro.ctaInputStart')}
        </button>
      )}
      <button onClick={() => updateURLParams({ step: StepName.Review })}>
        {uitext('intro.ctaReviewStart')}
      </button>
      <SignInButton />
    </div>
  );
};

export default IntroBody;
