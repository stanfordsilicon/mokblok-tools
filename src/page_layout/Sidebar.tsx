import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import StepName from '@settings/StepName';
import StepSelector from '@settings/StepSelector';
import { useURLParams } from '@settings/URLParams';

import enforceExhaustiveSwitch from '@shared/enforceExhaustiveSwitch';

import IntroCTAs from '../widgets/intro/IntroCTAs';
import DataTypeSelector from '../widgets/review/DataTypeSelector';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',
        borderRight: '1px solid var(--color-input-border)',
        width: '20em',
      }}
    >
      <header style={{ padding: '0.5em 1em', marginBottom: '1em' }}>
        <h1 style={{ margin: '.5em 0 0 0' }}>
          <Link to="/" style={{ color: 'var(--color-text)' }}>
            {t('title')}
          </Link>
        </h1>
        <h3 style={{ margin: 0 }}>{t('bySILICON')}</h3>
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
