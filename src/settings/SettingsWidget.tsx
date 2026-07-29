import React from 'react';

import AdminModeSelector from './selectors/AdminModeSelector';
import BackgroundStyleSelector from './selectors/BackgroundStyleSelector';
import CoverageLevelSelector from './selectors/CoverageLevelSelector';
import ExampleDateSelector from './selectors/ExampleDateSelector';
import InputSourceSelector from './selectors/InputSourceSelector';
import InterfaceLanguageSelector from './selectors/InterfaceLanguageSelector';
import SourceLanguageSelector from './selectors/SourceLanguageSelector';
import TargetLanguageSelector from './selectors/TargetLanguageSelector';

const SettingsWidget: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}>
      <InterfaceLanguageSelector />
      <SourceLanguageSelector />
      <TargetLanguageSelector />
      <InputSourceSelector />
      <CoverageLevelSelector />
      <BackgroundStyleSelector />
      <ExampleDateSelector />
      <AdminModeSelector />
    </div>
  );
};

export default SettingsWidget;
