import React from 'react';

import StepName from '@settings/StepName';

import enforceExhaustiveSwitch from '@shared/enforceExhaustiveSwitch';

import ExportWidget from './export/ExportWidget';
import ImportBody from './import/ImportBody';
import IntroBody from './intro/IntroBody';
import ReviewWidget from './review/ReviewWidget';

export type StepViewProps = {
  step: StepName;
};

const StepView: React.FC<StepViewProps> = ({ step }) => {
  switch (step) {
    case StepName.Intro:
      return <IntroBody />;
    case StepName.Import:
      return <ImportBody />;
    case StepName.Edit:
    case StepName.Vote:
      return <ReviewWidget />;
    case StepName.Export:
      return <ExportWidget />;
    default:
      enforceExhaustiveSwitch(step);
  }
};

export default StepView;
