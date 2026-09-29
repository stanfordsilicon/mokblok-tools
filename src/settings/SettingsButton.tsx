import { useEffect, useRef, useState } from 'react';

import SettingsWidget from '@settings/SettingsWidget';

import { Button } from '@shared/shadcn/ui/button';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const SettingsButton: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const toggleSettings = () => setSettingsOpen(!settingsOpen);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleEvent(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setSettingsOpen(false);
    }
    document.addEventListener('mousedown', handleEvent);
    return () => {
      document.removeEventListener('mousedown', handleEvent);
    };
  }, [setSettingsOpen]);

  return (
    <div ref={ref} className="absolute top-5 right-5">
      <Button onClick={toggleSettings} size="lg" variant="outline">
        <span className="hidden lg:inline">{uitext('settings.title')}</span>{' '}
        <span className="text-2xl leading-none lg:hidden">⚙</span>
      </Button>
      {settingsOpen && <FloatingSettingsWidget />}
    </div>
  );
};

const FloatingSettingsWidget: React.FC = () => {
  return (
    <div className="absolute top-12 right-0 z-50 w-[min(26rem,calc(100vw-3rem))] rounded-[1.5rem] border border-(--silicon-line-strong) bg-white p-4 text-sm">
      <SettingsWidget />
    </div>
  );
};

export default SettingsButton;
