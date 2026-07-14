import { useState } from 'react';

import { DataProvider } from '@data/DataContext';
import { LinguisticsProvider } from '@data/LinguisticsContext';

import SettingsWidget from '@settings/SettingsWidget';
import StepSelector from '@settings/StepSelector';
import { useURLParams } from '@settings/URLParams';

import StepView from '@widgets/StepView';

const PageBody: React.FC = () => {
  const { step } = useURLParams();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const toggleSettings = () => setSettingsOpen(!settingsOpen);

  return (
    <LinguisticsProvider>
      <DataProvider>
        <StepSelector toggleSettings={toggleSettings} />
        <div
          style={{
            border: '1px solid var(--color-input-border)',
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
  );
};

const FloatingSettingsWidget: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '.25em',
        right: '.25em',
        backgroundColor: 'var(--color-input-background)',
        border: '1px solid var(--color-input-border)',
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
