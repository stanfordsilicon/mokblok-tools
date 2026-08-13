import { useURLParams } from '@settings/URLParams';

import ImportSource from '@widgets/import/ImportSource';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import TargetLanguageButtons from './TargetLanguageButtons';
import TargetLanguageCodeInput from './TargetLanguageCodeInput';

const TargetLanguageSelector = () => {
  const { uitext } = useInterfaceTranslation();
  const { importSource } = useURLParams();

  return (
    <div>
      <div>
        {uitext('import.language.pickLanguage')}{' '}
        {importSource !== ImportSource.Blank && uitext('import.language.hasPreloaded')}
      </div>
      <TargetLanguageButtons />
      <div className="flex gap-1 items-center mt-1">
        <TargetLanguageCodeInput size="wide" />
      </div>
    </div>
  );
};

export default TargetLanguageSelector;
