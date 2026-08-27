import useLanguageName from '@data/useLanguageName';

import { useURLParams } from './URLParams';

function TargetLanguageLabel() {
  const { getLanguageName } = useLanguageName();
  const { targetLanguage } = useURLParams();
  const langNames = getLanguageName(targetLanguage);
  return langNames.endonym ?? langNames.localizedName ?? langNames.code;
}

export default TargetLanguageLabel;
