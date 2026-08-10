import SignInButton from '@settings/auth/SignInButton';
import InterfaceLanguageSelector from '@settings/selectors/InterfaceLanguageSelector';
import TargetLanguageSelector from '@settings/selectors/TargetLanguageSelector';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import IntroCTAs from './IntroCTAs';

/**
 * A page that immediately asks the user to select the source language and target language.
 */
const IntroBody: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '1rem' }}>
      <div>{uitext('intro.description')}</div>
      <InterfaceLanguageSelector />
      <TargetLanguageSelector />
      <IntroCTAs />
      <SignInButton />
    </div>
  );
};

export default IntroBody;
