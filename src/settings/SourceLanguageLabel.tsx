import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import { useURLParams } from './URLParams';

function SourceLanguageLabel() {
  const { sourceLanguage } = useURLParams();
  const { uitext } = useInterfaceTranslation();
  return <>{uitext(`languageName.${sourceLanguage}`)}</>;
}

export default SourceLanguageLabel;
