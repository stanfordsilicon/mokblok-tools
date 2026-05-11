import React from 'react';
import { useTranslation } from 'react-i18next';

import StepName from '@settings/StepName';

import ExportWidget from './export/ExportWidget';
import InputBody from './input/InputBody';
import ReviewWidget from './review/ReviewWidget';

export type StepViewProps = {
  step: StepName;
};

const StepView: React.FC<StepViewProps> = ({ step }) => {
  const { t } = useTranslation();
  switch (step) {
    case StepName.Input:
      return <InputBody />;
    case StepName.Review:
      return <ReviewWidget />;
    case StepName.Export:
      return <ExportWidget />;
    default:
      return <div>{t('errors.unknownWidget')}</div>;
  }
};

export default StepView;
