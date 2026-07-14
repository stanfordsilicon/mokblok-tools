import { useTranslation } from 'react-i18next';

import StepName from '@settings/StepName';
import StepSelector from '@settings/StepSelector';
import { useURLParams } from '@settings/URLParams';

import IntroCTAs from '@widgets/intro/IntroCTAs';
import DataTypeSelector from '@widgets/review/DataTypeSelector';

import enforceExhaustiveSwitch from '@shared/enforceExhaustiveSwitch';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',
        borderRight: '1px solid var(--color-input-border)',
        width: '18em',
      }}
    >
      <header style={{ padding: '0.5em 1em', marginBottom: '1em' }}>
        <h1 style={{ margin: 0 }}>
          <a href="/">{t('title')}</a>
        </h1>
      </header>
      <StepSelector />
      <div style={{ overflow: 'auto', flex: 1 }}>
        <SidebarContents />
      </div>
    </div>
  );
};

const SidebarContents: React.FC = () => {
  const { step } = useURLParams();

  switch (step) {
    case StepName.Input:
    case StepName.Export:
      return 'TODO: Add instructions';
    case StepName.Review:
      return <DataTypeSelector />;
    case StepName.Intro:
      return <IntroCTAs />;
    default:
      enforceExhaustiveSwitch(step);
  }
};

export default Sidebar;
