import { useURLParams } from '@settings/URLParams';

import InputSource from '@widgets/input/InputSource';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import TargetLanguageButtons from './TargetLanguageButtons';
import TargetLanguageCodeInput from './TargetLanguageCodeInput';

const TargetLanguageSelector = () => {
  const { uitext } = useInterfaceTranslation();
  const { inputSource } = useURLParams();

  return (
    <div>
      <div>
        {uitext('import.language.pickLanguage')}{' '}
        {inputSource !== InputSource.Blank && uitext('import.language.hasPreloaded')}
      </div>
      <TargetLanguageButtons />
      <div className="flex gap-1 items-center mt-1">
        <TargetLanguageCodeInput size="wide" />
      </div>
    </div>
  );
};

export default TargetLanguageSelector;
