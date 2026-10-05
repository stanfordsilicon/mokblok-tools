import { useMemo, useState } from 'react';

import { useWorksheetDataContext } from '@data/target/WorksheetDataProvider';

import { addValueToXML, toXMLString, type XMLObject } from '@widgets/export/formatXML';

import { Button } from '@shared/shadcn/ui/button';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import ImportCheck from './check/ImportCheck';

const ImportXMLSection = () => {
  const { uitext } = useInterfaceTranslation();
  const { targetXMLData } = useWorksheetDataContext();
  const [appearance, setAppearance] = useState<'xml' | 'list'>('xml');

  const preview = useMemo(() => {
    if (appearance === 'xml') {
      const ldml: XMLObject = {};
      Object.entries(targetXMLData ?? {}).forEach(([key, value]) =>
        addValueToXML(ldml, key, value),
      );
      return toXMLString(ldml, '  ');
    } else {
      return Object.entries(targetXMLData ?? {})
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    }
  }, [appearance, targetXMLData]);

  return (
    <>
      <div style={{ display: 'flex', gap: '1em' }}>
        <Button
          variant={appearance === 'list' ? 'selected' : 'outline'}
          onClick={() => setAppearance('list')}
        >
          {uitext('import.asList')}
        </Button>
        <Button
          variant={appearance === 'xml' ? 'selected' : 'outline'}
          onClick={() => setAppearance('xml')}
        >
          {uitext('import.asXML')}
        </Button>
      </div>
      <textarea
        className="border w-full h-72 mt-1 text-xs p-2 tab-16 rounded-lg whitespace-nowrap"
        value={preview}
        readOnly
      />
      <ImportCheck />
    </>
  );
};

export default ImportXMLSection;
