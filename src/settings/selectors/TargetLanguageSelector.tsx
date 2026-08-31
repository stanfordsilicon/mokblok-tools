import ImportSource from '@data/ImportSource';

import LanguageRequestPanel from '@settings/auth/LanguageRequestPanel';
import { useURLParams } from '@settings/URLParams';
import useAllowedTargetLanguages from '@settings/useAllowedTargetLanguages';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import LanguageButtons from './LanguageButtons';
import TargetLanguageCodeInput from './TargetLanguageCodeInput';

const TargetLanguageSelector = () => {
  const { uitext } = useInterfaceTranslation();
  const { targetLanguage, updateURLParams, importSource, admin } = useURLParams();
  const languages = useAllowedTargetLanguages();
  console.log(targetLanguage);

  return (
    <div>
      <div>
        {uitext('import.language.pickLanguage')}{' '}
        {importSource !== ImportSource.Blank && uitext('import.language.hasPreloaded')}
        {!admin && <LanguageRequestPanel />}
      </div>

      <LanguageButtons
        current={targetLanguage}
        onChange={(newLanguage) => updateURLParams({ targetLanguage: newLanguage })}
        options={languages}
      />
      <div className="flex gap-1 items-center mt-1">
        <TargetLanguageCodeInput size="wide" />
      </div>
    </div>
  );
};

export default TargetLanguageSelector;
