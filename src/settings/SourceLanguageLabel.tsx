import { useTranslation } from 'react-i18next';

import { SourceLanguage } from '@data/DataTypes';

import { useURLParams } from './URLParams';

function SourceLanguageLabel() {
  const { sourceLanguage } = useURLParams();
  const { t } = useTranslation();
  if ([SourceLanguage.Spanish, SourceLanguage.Italian].includes(sourceLanguage)) {
    return <>{t(`languageName.eng`)}</>;
  }
  return <>{t(`languageName.${sourceLanguage}`)}</>;
}

export default SourceLanguageLabel;
