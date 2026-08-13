import InputLanguageSelector from '@settings/selectors/TargetLanguageSelector';
import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import InputSource from './InputSource';
import InputTSVSection from './InputTSVSection';
import InputXMLSection from './InputXMLSection';

const InputBody = () => {
  const { uitext } = useInterfaceTranslation();
  const { inputSource, updateURLParams } = useURLParams();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5em' }}>
      <h3 style={{ margin: 0 }}>{uitext('import.inputSource.title')}</h3>
      <div style={{ display: 'flex', gap: '.5em', alignItems: 'center' }}>
        {uitext('import.inputSource.label')}
        {Object.values(InputSource).map((source) => (
          <button
            key={source}
            className={inputSource === source ? 'selected' : ''}
            onClick={() => updateURLParams({ inputSource: source })}
          >
            {uitext(`import.inputSource.${source}`)}
          </button>
        ))}
      </div>
      <h3 style={{ margin: 0 }}>{uitext('import.language.title')}</h3>
      <InputLanguageSelector />
      <h3 style={{ margin: 0 }}>{uitext('import.files.title')}</h3>
      {inputSource === InputSource.Blank && <>{uitext('import.files.None')}</>}
      {inputSource === InputSource.XML && <InputXMLSection />}
      {inputSource === InputSource.TSV && <InputTSVSection />}
    </div>
  );
};

export default InputBody;
