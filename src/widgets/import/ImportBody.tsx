import ImportSource from '@data/ImportSource';

import ImportSourceSelector from '@settings/selectors/ImportSourceSelector';
import TargetLanguageSelector from '@settings/selectors/TargetLanguageSelector';
import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import ImportTSVSection from './ImportTSVSection';
import ImportXMLSection from './ImportXMLSection';

const ImportBody = () => {
  const { uitext } = useInterfaceTranslation();
  const { importSource } = useURLParams();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5em' }}>
      <h3 style={{ margin: 0 }}>{uitext('import.importSource.title')}</h3>
      <ImportSourceSelector display="buttons" />
      <h3 style={{ margin: 0 }}>{uitext('import.language.title')}</h3>
      <TargetLanguageSelector />
      <h3 style={{ margin: 0 }}>{uitext('import.files.title')}</h3>
      {importSource === ImportSource.Blank && uitext('import.files.None')}
      {importSource === ImportSource.XML && <ImportXMLSection />}
      {importSource === ImportSource.TSV && <ImportTSVSection />}
    </div>
  );
};

export default ImportBody;
