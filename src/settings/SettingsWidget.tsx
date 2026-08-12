import React from 'react';

import InputSource from '@widgets/input/InputSource';

import AdminModeSelector from './selectors/AdminModeSelector';
import BackgroundStyleSelector from './selectors/BackgroundStyleSelector';
import CoverageLevelSelector from './selectors/CoverageLevelSelector';
import ExampleDateSelector from './selectors/ExampleDateSelector';
import InputSourceSelector from './selectors/InputSourceSelector';
import InterfaceLanguageSelector from './selectors/InterfaceLanguageSelector';
import SourceLanguageSelector from './selectors/SourceLanguageSelector';
import TargetLanguageCodeInput from './selectors/TargetLanguageCodeInput';
import TargetLanguageDropdown from './selectors/TargetLanguageDropdown';
import { useURLParams } from './URLParams';

const SettingsWidget: React.FC = () => {
  const { inputSource } = useURLParams();
  return (
    <div className="flex flex-col gap-4">
      <InterfaceLanguageSelector />
      <SourceLanguageSelector />
      {inputSource !== InputSource.Blank ? (
        <TargetLanguageDropdown />
      ) : (
        <TargetLanguageCodeInput size="short" />
      )}
      <InputSourceSelector />
      <CoverageLevelSelector />
      <BackgroundStyleSelector />
      <ExampleDateSelector />
      <AdminModeSelector />
    </div>
  );
};

export default SettingsWidget;
