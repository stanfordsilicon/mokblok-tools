import { useMemo, useState } from 'react';

import { useTargetDataContext } from '@data/target-data/TargetDataProvider';

import { addValueToXML, toXMLString, type XMLObject } from '@widgets/export/formatXML';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import ImportCheck from './check/ImportCheck';

const ImportXMLSection = () => {
  const { uitext } = useInterfaceTranslation();
  const { targetXMLData } = useTargetDataContext();
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
        <button
          style={{ background: appearance === 'list' ? 'var(--color-button-selected)' : undefined }}
          onClick={() => setAppearance('list')}
        >
          {uitext('import.asList')}
        </button>
        <button
          style={{ background: appearance === 'xml' ? 'var(--color-button-selected)' : undefined }}
          onClick={() => setAppearance('xml')}
        >
          {uitext('import.asXML')}
        </button>
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
