import { useState } from 'react';

import { DataProvider } from '@data/DataContext';
import { LinguisticsProvider } from '@data/LinguisticsContext';

import { SettingsProvider } from '@settings/Settings';
import SettingsWidget from '@settings/SettingsWidget';
import StepName from '@settings/StepName';
import StepSelector from '@settings/StepSelector';

import StepView from '@widgets/StepView';

const PageBody: React.FC = () => {
  const [step, setStep] = useState<StepName>(StepName.Input);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const toggleSettings = () => setSettingsOpen(!settingsOpen);

  return (
    <SettingsProvider>
      <LinguisticsProvider>
        <DataProvider>
          <StepSelector step={step} setStep={setStep} toggleSettings={toggleSettings} />
          <div
            style={{
              border: '1px solid #ccc',
              padding: '1em',
              borderRadius: '1em',
              fontSize: '0.8em',
              minWidth: '400px',
              position: 'relative',
            }}
          >
            {settingsOpen && <FloatingSettingsWidget />}
            <StepView step={step} />
          </div>
        </DataProvider>
      </LinguisticsProvider>
    </SettingsProvider>
  );
};

const FloatingSettingsWidget: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '1em',
        right: '1em',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '0.5em',
        maxWidth: '400px',
        padding: '1em',
        zIndex: 100,
      }}
    >
      <SettingsWidget />
    </div>
  );
};

export default PageBody;
