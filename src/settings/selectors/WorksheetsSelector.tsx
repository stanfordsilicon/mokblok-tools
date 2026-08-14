import React from 'react';

import { Worksheets } from '@data/tsvdocs/Worksheets';

import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const WorksheetsSelector: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { worksheets, updateURLParams, admin } = useURLParams();
  if (!admin) return null;

  return (
    <div className={'flex items-center gap-4 justify-between'}>
      <span className="font-bold">{uitext('import.worksheets.label')}</span>
      <select
        className="settings-select"
        value={String(worksheets)}
        onChange={(e) => updateURLParams({ worksheets: e.target.value as Worksheets })}
      >
        {Object.values(Worksheets).map((value) => (
          <option key={value} value={value}>
            {uitext(`import.worksheets.${value}`, value)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WorksheetsSelector;
