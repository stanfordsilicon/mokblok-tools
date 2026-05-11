import { useTranslation } from 'react-i18next';

import { useSettings } from './Settings';

function SourceLanguageLabel() {
  const { sourceLanguage } = useSettings();
  const { t } = useTranslation();
  return <>{t(`languageName.${sourceLanguage}`)}</>;
}

export default SourceLanguageLabel;
