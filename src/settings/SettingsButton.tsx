import { useState } from 'react';

import SettingsWidget from '@settings/SettingsWidget';

import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const SettingsButton: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const toggleSettings = () => setSettingsOpen(!settingsOpen);

  return (
    <div className="absolute top-5 right-5">
      <button onClick={toggleSettings}>{uitext('settings.title')} ⚙</button>
      {settingsOpen && <FloatingSettingsWidget />}
    </div>
  );
};

const FloatingSettingsWidget: React.FC = () => {
  return (
    <div className="absolute top-14 right-0 z-50 w-[min(26rem,calc(100vw-3rem))] rounded-[1.5rem] border border-(--silicon-line-strong) bg-white p-4 text-sm">
      <SettingsWidget />
    </div>
  );
};

export default SettingsButton;
