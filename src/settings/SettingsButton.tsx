import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import SettingsWidget from '@settings/SettingsWidget';

const SettingsButton: React.FC = () => {
  const { t } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const toggleSettings = () => setSettingsOpen(!settingsOpen);

  return (
    <div style={{ position: 'absolute', right: '0' }}>
      <button onClick={toggleSettings} style={{ padding: '.5em 1em' }}>
        {t('settings.title')} ⚙
      </button>
      {settingsOpen && <FloatingSettingsWidget />}
    </div>
  );
};

const FloatingSettingsWidget: React.FC = () => {
  return (
    <div
      style={{
        top: '3em',
        backgroundColor: 'var(--color-input-background)',
        border: '1px solid var(--color-input-border)',
        borderRadius: '0.5em',
        fontSize: '0.8em',
        width: '400px',
        position: 'absolute',
        right: '.25em',
        padding: '1em',
        zIndex: 100,
      }}
    >
      <SettingsWidget />
    </div>
  );
};

export default SettingsButton;
