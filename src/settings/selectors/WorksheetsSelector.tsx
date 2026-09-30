import React from 'react';

import { Worksheets } from '@data/worksheets/Worksheets';

import { useURLParams } from '@settings/URLParams';

import EnumDropdown from '@shared/EnumDropdown';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const WorksheetsSelector: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { worksheets, updateURLParams, admin } = useURLParams();
  if (!admin) return null;

  return (
    <div className={'flex items-center gap-4 justify-between'}>
      <span className="font-bold">{uitext('import.worksheets.label')}</span>
      <EnumDropdown
        value={worksheets}
        onChange={(value) => updateURLParams({ worksheets: value })}
        options={Object.values(Worksheets)}
        getLabel={(value) => uitext(`import.worksheets.${value}`, value)}
      />
    </div>
  );
};

export default WorksheetsSelector;
