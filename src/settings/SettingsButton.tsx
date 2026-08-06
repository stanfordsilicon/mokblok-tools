import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import SettingsWidget from '@settings/SettingsWidget';

const SettingsButton: React.FC = () => {
  const { t } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const toggleSettings = () => setSettingsOpen(!settingsOpen);

  return (
    <div className="absolute top-5 right-5">
      <button onClick={toggleSettings}>{t('settings.title')} ⚙</button>
      {settingsOpen && <FloatingSettingsWidget />}
    </div>
  );
};

const FloatingSettingsWidget: React.FC = () => {
  return (
    <div className="absolute top-14 right-0 z-100 w-[min(26rem,calc(100vw-3rem))] rounded-[1.5rem] border border-(--silicon-line-strong) bg-white p-4 text-sm">
      <SettingsWidget />
    </div>
  );
};

export default SettingsButton;
