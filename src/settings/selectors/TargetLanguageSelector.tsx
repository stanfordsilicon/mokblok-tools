import { useSession } from 'next-auth/react';

import ImportSource from '@data/ImportSource';

import { getScopedTargetLanguages } from '@settings/target-language-scope';
import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import LanguageButtons from './LanguageButtons';
import TargetLanguageCodeInput from './TargetLanguageCodeInput';
import { getTargetLanguageOptions } from './TargetLanguageOptions';

const TargetLanguageSelector = () => {
  const { uitext } = useInterfaceTranslation();
  const { targetLanguage, updateURLParams, importSource } = useURLParams();
  const { data: session } = useSession();
  const scopedLanguages = getScopedTargetLanguages(session?.user?.role, session?.user?.languages);
  const options = getTargetLanguageOptions(importSource, scopedLanguages);

  return (
    <div>
      <div>
        {uitext('import.language.pickLanguage')}{' '}
        {importSource !== ImportSource.Blank && uitext('import.language.hasPreloaded')}
      </div>

      <LanguageButtons
        current={targetLanguage}
        onChange={(newLanguage) => updateURLParams({ targetLanguage: newLanguage })}
        options={options}
      />
      <div className="flex gap-1 items-center mt-1">
        <TargetLanguageCodeInput size="wide" />
      </div>
    </div>
  );
};

export default TargetLanguageSelector;
