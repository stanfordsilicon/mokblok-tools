import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTargetDataContext } from '@data/TargetDataProvider';

import { addValueToXML, toXMLString, type XMLObject } from '@widgets/export/formatXML';

import InputCheck from './check/InputCheck';

import './inputStyles.css';

const InputXMLSection = () => {
  const { t } = useTranslation();
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
          {t('input.asList')}
        </button>
        <button
          style={{ background: appearance === 'xml' ? 'var(--color-button-selected)' : undefined }}
          onClick={() => setAppearance('xml')}
        >
          {t('input.asXML')}
        </button>
      </div>
      <textarea className="LargeTextArea" value={preview} readOnly />
      <InputCheck />
    </>
  );
};

export default InputXMLSection;
