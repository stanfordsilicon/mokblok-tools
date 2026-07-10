import { useTranslation } from 'react-i18next';

import { useURLParams } from './URLParams';

function SourceLanguageLabel() {
  const { sourceLanguage } = useURLParams();
  const { t } = useTranslation();
  return <>{t(`languageName.${sourceLanguage}`)}</>;
}

export default SourceLanguageLabel;
