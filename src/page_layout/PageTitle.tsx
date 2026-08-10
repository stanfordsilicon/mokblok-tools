import SettingsButton from '@settings/SettingsButton';
import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const PageTitle: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const { page, step } = useURLParams();

  return (
    <div className="mb-4 flex items-center justify-between gap-2">
      <div className="text-3xl font-black leading-none sm:text-5xl">
        {uitext(`${step.toLowerCase()}.title`)}{' '}
        {(step === StepName.Vote || step === StepName.Edit) && (
          <span className="mt-2 block text-base font-semibold tracking-normal text-(--silicon-ink-soft) sm:mt-0 sm:ml-2 sm:inline">
            / {uitext(`dataPage.${page}`)}
          </span>
        )}
      </div>
      <SettingsButton />
    </div>
  );
};

export default PageTitle;
