import SettingsButton from '@settings/SettingsButton';
import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const PageTitle: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { page, step } = useURLParams();

  return (
    <div className="relative mb-4 rounded-[2rem] border border-(--silicon-line) bg-white/70 px-5 py-5 shadow-sm backdrop-blur-sm sm:px-6 relative z-20">
      <SettingsButton />
      <div className="text-3xl font-black leading-none tracking-tight sm:text-5xl">
        {uitext(`${step.toLowerCase()}.title`)}{' '}
        {(step === StepName.Review || step === StepName.Edit) && (
          <span className="mt-2 block text-base font-semibold tracking-normal text-(--silicon-ink-soft) sm:mt-0 sm:ml-2 sm:inline">
            / {uitext(`dataPage.${page}`)}
          </span>
        )}
      </div>
    </div>
  );
};

export default PageTitle;
