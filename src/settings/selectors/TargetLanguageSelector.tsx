import ImportSource from '@data/ImportSource';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import LanguageButtons from './LanguageButtons';
import TargetLanguageCodeInput from './TargetLanguageCodeInput';
import TargetLanguageOptions from './TargetLanguageOptions';

const TargetLanguageSelector = () => {
  const { uitext } = useInterfaceTranslation();
  const { targetLanguage, updateURLParams, importSource } = useURLParams();

  return (
    <div>
      <div>
        {uitext('import.language.pickLanguage')}{' '}
        {importSource !== ImportSource.Blank && uitext('import.language.hasPreloaded')}
      </div>

      <LanguageButtons
        current={targetLanguage}
        onChange={(newLanguage) => updateURLParams({ targetLanguage: newLanguage })}
        options={TargetLanguageOptions[importSource]}
      />
      <div className="flex gap-1 items-center mt-1">
        <TargetLanguageCodeInput size="wide" />
      </div>
    </div>
  );
};

export default TargetLanguageSelector;
