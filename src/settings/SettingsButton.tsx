import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import SettingsWidget from '@settings/SettingsWidget';

const SettingsButton: React.FC = () => {
  const { t } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const toggleSettings = () => setSettingsOpen(!settingsOpen);

  return (
    <div className="absolute top-5 right-5">
      <button
        onClick={toggleSettings}
        className="rounded-xl border border-(--silicon-line-strong) bg-white px-4 py-2 text-sm font-semibold text-(--silicon-ink) shadow-sm transition hover:border-(--silicon-purple) hover:text-(--silicon-purple)"
      >
        {t('settings.title')} ⚙
      </button>
      {settingsOpen && <FloatingSettingsWidget />}
    </div>
  );
};

const FloatingSettingsWidget: React.FC = () => {
  return (
    <div className="absolute top-14 right-0 z-100 w-[min(26rem,calc(100vw-3rem))] rounded-[1.5rem] border border-(--silicon-line-strong) bg-white p-4 text-sm shadow-[0_20px_50px_rgba(74,53,48,0.18)]">
      <SettingsWidget />
    </div>
  );
};

export default SettingsButton;
