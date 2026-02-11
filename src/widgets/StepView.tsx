import React from 'react';

import SettingsWidget from '@settings/SettingsWidget';
import StepName from '@settings/StepName';

import ExportWidget from './export/ExportWidget';
import InputWidget from './input/InputWidget';
import ReviewWidget from './review/ReviewWidget';

export type StepViewProps = {
  step: StepName;
};

const StepView: React.FC<StepViewProps> = ({ step }) => {
  switch (step) {
    case StepName.Input:
      return <InputWidget />;
    case StepName.Review:
      return <ReviewWidget />;
    case StepName.Export:
      return <ExportWidget />;
    case StepName.Settings:
      return <SettingsWidget />;
    default:
      return <div>Unknown Widget</div>;
  }
};

export default StepView;
