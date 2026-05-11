import { useTranslation } from 'react-i18next';

import { SourceLanguage } from '@data/DataTypes';

import { useSettings } from './Settings';

function SourceLanguageLabel() {
  const { sourceLanguage } = useSettings();
  const { t } = useTranslation();
  if ([SourceLanguage.Spanish, SourceLanguage.Italian].includes(sourceLanguage)) {
    return <>{t(`languageName.eng`)}</>;
  }
  return <>{t(`languageName.${sourceLanguage}`)}</>;
}

export default SourceLanguageLabel;
