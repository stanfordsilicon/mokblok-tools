import { SourceLanguage } from '@data/DataTypes';

import { useSettings } from './Settings';

function SourceLanguageLabel() {
  const { sourceLanguage } = useSettings();
  return Object.entries(SourceLanguage).find(([, value]) => value === sourceLanguage)?.[0];
}

export default SourceLanguageLabel;
