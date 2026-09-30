import SettingsWidget from '@settings/SettingsWidget';

import { Button } from '@shared/shadcn/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@shared/shadcn/ui/popover';
import useInterfaceTranslation from '@shared/useInterfaceTranslation';

const SettingsButton: React.FC = () => {
  const { uitext } = useInterfaceTranslation();
  return (
    <div className="absolute top-5 right-5">
      <Popover>
        <PopoverTrigger
          render={
            <Button size="lg" variant="outline">
              <span className="hidden lg:inline">{uitext('settings.title')}</span>{' '}
              <span className="text-2xl leading-none lg:hidden">⚙</span>
            </Button>
          }
        />
        <PopoverContent align="end" className="flex flex-col gap-1 w-[400px] p-4">
          <SettingsWidget />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SettingsButton;
