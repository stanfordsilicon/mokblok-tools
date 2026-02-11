import { useState } from 'react';

import { DataProvider } from '@data/DataContext';

import { SettingsProvider } from '@settings/Settings';
import StepName from '@settings/StepName';
import StepSelector from '@settings/StepSelector';

import StepView from '@widgets/StepView';

const PageBody: React.FC = () => {
  const [step, setStep] = useState<StepName>(StepName.Input);

  return (
    <SettingsProvider>
      <DataProvider>
        <StepSelector step={step} setStep={setStep} />
        <div
          style={{
            border: '1px solid #ccc',
            padding: '1em',
            borderRadius: '1em',
            fontSize: '0.8em',
            minWidth: '400px',
          }}
        >
          <StepView step={step} />
        </div>
      </DataProvider>
    </SettingsProvider>
  );
};

export default PageBody;
