import Link from 'next/link';
import { useState } from 'react';

import AccountBadge from '@settings/auth/AccountBadge';
import StepName from '@settings/StepName';
import StepSelector from '@settings/StepSelector';
import { useURLParams } from '@settings/URLParams';

import enforceExhaustiveSwitch from '@shared/enforceExhaustiveSwitch';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

import PageSectionSelector from '../widgets/review/PageSectionSelector';

import LoadingStatus from './LoadingStatus';

const Sidebar: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { admin } = useURLParams();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 border-b border-(--silicon-line-strong) bg-(--silicon-panel) p-4 lg:min-h-screen lg:w-[22rem] lg:border-r lg:border-b-0 lg:p-6">
      <header className="">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-(--silicon-purple)">
          SILICON
        </p>
        <h1 className="text-3xl font-black tracking-tight">
          <Link
            href="/"
            className="text-(--silicon-ink) no-underline hover:text-(--silicon-purple)"
          >
            {uitext('title')}
          </Link>
        </h1>
      </header>

      <button
        className={`${isOpen ? 'bg-(--silicon-line)' : ''} lg:hidden`}
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <AccountBadge />
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <StepSelector />
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} lg:flex lg:flex-1 overflow-auto  h-min`}>
        <SidebarContents />
      </div>

      {admin && (
        <div
          className={`${isOpen ? 'block' : 'hidden'} lg:block rounded-[1.5rem] border border-(--silicon-line) bg-white px-4 py-3 shadow-sm`}
        >
          <LoadingStatus />
        </div>
      )}
      {/* On a small display, the sidebar is hidden by default. Click the ☰ button in the top left to show it. */}
    </aside>
  );
};

const SidebarContents: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { step } = useURLParams();

  switch (step) {
    case StepName.Import:
      return uitext('import.instructions');
    case StepName.Export:
      return uitext('export.instructions');
    case StepName.Edit:
    case StepName.Vote:
      return <PageSectionSelector />;
    case StepName.Intro:
      return uitext('intro.instructions');
    default:
      enforceExhaustiveSwitch(step);
  }
};

export default Sidebar;
