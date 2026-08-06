import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import AccountBadge from '@settings/auth/AccountBadge';
import StepName from '@settings/StepName';
import StepSelector from '@settings/StepSelector';
import { useURLParams } from '@settings/URLParams';

import enforceExhaustiveSwitch from '@shared/enforceExhaustiveSwitch';

import IntroCTAs from '../widgets/intro/IntroCTAs';
import DataTypeSelector from '../widgets/review/DataTypeSelector';

import LoadingStatus from './LoadingStatus';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { admin } = useURLParams();

  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 border-b border-(--silicon-line-strong) bg-(--silicon-panel) px-4 py-5 lg:min-h-screen lg:w-[22rem] lg:border-r lg:border-b-0 lg:px-5 lg:py-6">
      <header className="rounded-[1.75rem] border border-(--silicon-line) bg-white px-5 py-4 shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-(--silicon-purple)">
          SILICON
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-(--silicon-ink)">
          <Link
            href="/"
            className="text-(--silicon-ink) no-underline hover:text-(--silicon-purple)"
          >
            {t('title')}
          </Link>
        </h1>
        <p className="mt-2 text-sm text-(--silicon-ink-soft)">{t('bySILICON')}</p>
      </header>
      <AccountBadge />

      <StepSelector />
      <div className="flex-1 overflow-auto rounded-[1.75rem] border border-(--silicon-line) bg-white px-4 py-4 shadow-sm">
        <SidebarContents />
      </div>
      {admin && (
        <div className="rounded-[1.5rem] border border-(--silicon-line) bg-white px-4 py-3 shadow-sm">
          <LoadingStatus />
        </div>
      )}
    </aside>
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
