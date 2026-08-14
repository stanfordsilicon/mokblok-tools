import React from 'react';

import ImportSource from '@data/ImportSource';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

type Props = {
  display: 'buttons' | 'dropdown';
};

const ImportSourceSelector: React.FC<Props> = ({ display }) => {
  const { uitext } = useInterfaceTranslation();
  const { importSource, updateURLParams, admin } = useURLParams();
  if (!admin) return null;

  return (
    <div
      className={
        'flex items-center' + (display === 'buttons' ? ' gap-2' : ' gap-4 justify-between')
      }
    >
      <span className={display === 'dropdown' ? 'font-bold' : ''}>
        {uitext('import.importSource.label')}
      </span>

      {display === 'buttons' &&
        Object.values(ImportSource).map((source) => (
          <button
            key={source}
            className={importSource === source ? 'selected' : ''}
            onClick={() => updateURLParams({ importSource: source })}
          >
            {uitext(`import.importSource.${source}`)}
          </button>
        ))}

      {display === 'dropdown' && (
        <select
          className="settings-select"
          value={String(importSource)}
          onChange={(e) => updateURLParams({ importSource: e.target.value as ImportSource })}
        >
          {Object.values(ImportSource).map((value) => (
            <option key={value} value={value}>
              {uitext(`import.importSource.${value}`, value)}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default ImportSourceSelector;
