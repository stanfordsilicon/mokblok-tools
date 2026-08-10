import React from 'react';

import StepName from '@settings/StepName';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import ExportWidget from './export/ExportWidget';
import InputBody from './input/InputBody';
import IntroBody from './intro/IntroBody';
import ReviewWidget from './review/ReviewWidget';

export type StepViewProps = {
  step: StepName;
};

const StepView: React.FC<StepViewProps> = ({ step }) => {
  const { uitext } = useInterfaceTranslation();
  switch (step) {
    case StepName.Intro:
      return <IntroBody />;
    case StepName.Input:
      return <InputBody />;
    case StepName.Edit:
    case StepName.Review:
      return <ReviewWidget />;
    case StepName.Export:
      return <ExportWidget />;
    default:
      return <div>{uitext('errors.unknownWidget')}</div>;
  }
};

export default StepView;
