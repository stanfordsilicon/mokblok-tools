import React from 'react';

import AdminModeSelector from './selectors/AdminModeSelector';
import BackgroundStyleSelector from './selectors/BackgroundStyleSelector';
import CoverageLevelSelector from './selectors/CoverageLevelSelector';
import ExampleDateSelector from './selectors/ExampleDateSelector';
import ImportSourceSelector from './selectors/ImportSourceSelector';
import InterfaceLanguageSelector from './selectors/InterfaceLanguageSelector';
import SourceLanguageSelector from './selectors/SourceLanguageSelector';
import TargetLanguageCodeInput from './selectors/TargetLanguageCodeInput';
import TargetLanguageDropdown from './selectors/TargetLanguageDropdown';
import WorksheetsSelector from './selectors/WorksheetsSelector';

const SettingsWidget: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <InterfaceLanguageSelector display="dropdown" />
      <SourceLanguageSelector />
      <TargetLanguageDropdown />
      <TargetLanguageCodeInput size="short" />
      <ImportSourceSelector display="dropdown" />
      <WorksheetsSelector />
      <CoverageLevelSelector />
      <BackgroundStyleSelector />
      <ExampleDateSelector />
      <AdminModeSelector />
    </div>
  );
};

export default SettingsWidget;
