import type React from 'react';
import InputWidget from '../data/InputWidget';
import ExportWidget from '../export/ExportWidget';
import ReviewWidget from '../review/ReviewWidget';
import { StepName } from './StepTypes';

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
    default:
      return <div>Unknown Widget</div>;
  }
};

export default StepView;
