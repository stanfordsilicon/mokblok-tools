import React from 'react';

import ImportSource from '@widgets/import/ImportSource';

import AdminModeSelector from './selectors/AdminModeSelector';
import BackgroundStyleSelector from './selectors/BackgroundStyleSelector';
import CoverageLevelSelector from './selectors/CoverageLevelSelector';
import ExampleDateSelector from './selectors/ExampleDateSelector';
import ImportSourceSelector from './selectors/ImportSourceSelector';
import InterfaceLanguageSelector from './selectors/InterfaceLanguageSelector';
import SourceLanguageSelector from './selectors/SourceLanguageSelector';
import TargetLanguageCodeInput from './selectors/TargetLanguageCodeInput';
import TargetLanguageDropdown from './selectors/TargetLanguageDropdown';
import DocScopeSelector from './selectors/WorksheetsSelector';
import { useURLParams } from './URLParams';

const SettingsWidget: React.FC = () => {
  const { importSource } = useURLParams();
  return (
    <div className="flex flex-col gap-2">
      <InterfaceLanguageSelector display="dropdown" />
      <SourceLanguageSelector />
      {importSource !== ImportSource.Blank ? (
        <TargetLanguageDropdown />
      ) : (
        <TargetLanguageCodeInput size="short" />
      )}
      <ImportSourceSelector display="dropdown" />
      <DocScopeSelector />
      <CoverageLevelSelector />
      <BackgroundStyleSelector />
      <ExampleDateSelector />
      <AdminModeSelector />
    </div>
  );
};

export default SettingsWidget;
