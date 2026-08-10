import { useCallback } from 'react';

import { useTargetDataContext } from '@data/TargetDataProvider';
import { Doc } from '@data/tsvdocs/Doc';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import InputLanguageSelector from './InputLanguageSelector';
import InputSource from './InputSource';
import InputTSVSection from './InputTSVSection';
import InputXMLSection from './InputXMLSection';

const InputBody = () => {
  const { uitext } = useInterfaceTranslation();
  const { inputSource, updateURLParams } = useURLParams();
  const { inputTSVs } = useTargetDataContext();

  const clearInputText = useCallback(() => {
    Object.values(Doc).forEach((doc) => inputTSVs[doc]?.clear());
  }, [inputTSVs]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5em' }}>
      <h3 style={{ margin: 0 }}>{uitext('input.inputSource.title')}</h3>
      <div style={{ display: 'flex', gap: '.5em', alignItems: 'center' }}>
        {uitext('input.inputSource.label')}
        {Object.values(InputSource).map((source) => (
          <button
            key={source}
            className={inputSource === source ? 'selected' : ''}
            onClick={() => updateURLParams({ inputSource: source })}
          >
            {uitext(`input.inputSource.${source}`)}
          </button>
        ))}
      </div>
      <h3 style={{ margin: 0 }}>{uitext('input.language.title')}</h3>
      <InputLanguageSelector clearInputText={clearInputText} />
      <h3 style={{ margin: 0 }}>{uitext('input.files.title')}</h3>
      {inputSource === InputSource.Blank && <>{uitext('input.files.None')}</>}
      {inputSource === InputSource.XML && <InputXMLSection />}
      {inputSource === InputSource.TSV && <InputTSVSection />}
    </div>
  );
};

export default InputBody;
