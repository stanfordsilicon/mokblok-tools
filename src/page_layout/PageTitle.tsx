import { useTranslation } from 'react-i18next';

import SettingsButton from '@settings/SettingsButton';
import StepName from '@settings/StepName';
import { useURLParams } from '@settings/URLParams';

const PageTitle: React.FC = () => {
  const { t } = useTranslation();
  const { page, step } = useURLParams();

  return (
    <div className="relative mb-4 rounded-[2rem] border border-(--silicon-line) bg-white/70 px-5 py-5 shadow-sm backdrop-blur-sm sm:px-6">
      <SettingsButton />
      <div className="mt-3 pr-24 text-3xl font-black leading-none tracking-tight text-(--silicon-ink) sm:text-5xl">
        {t(`${step.toLowerCase()}.title`)}{' '}
        {step === StepName.Review && (
          <span className="mt-2 block text-base font-semibold tracking-normal text-(--silicon-ink-soft) sm:mt-0 sm:ml-2 sm:inline">
            / {t(`dataPage.${page}`)}
          </span>
        )}
      </div>
    </div>
  );
};

export default PageTitle;
