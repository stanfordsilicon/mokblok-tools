import useLanguageName from '@data/useLanguageName';

import { Button } from '@shared/shadcn/ui/button';

type Props = {
  current: string;
  onChange: (newLanguage: string) => void;
  options: string[];
  disabled?: boolean;
};

const LanguageButtons: React.FC<Props> = ({ current, onChange, options, disabled = false }) => {
  const { getLanguageName } = useLanguageName();
  const languageOptions = options.map(getLanguageName).sort((a, b) => {
    if (a.code === '') return 1; // Put "none" always at the end of the list
    if (b.code === '') return -1;
    return a.endonym.localeCompare(b.endonym);
  });

  return (
    <div className="flex flex-wrap gap-1 items-center mt-1">
      {languageOptions.map((lang) => (
        <Button
          key={lang.code}
          className=" flex-col h-auto py-1 gap-0"
          variant={lang.code === current ? 'selected' : 'outline'}
          disabled={disabled}
          onClick={() => onChange(lang.code)}
        >
          {lang.endonym}
          <span className="font-light">{lang.localized}</span>
        </Button>
      ))}
    </div>
  );
};

export default LanguageButtons;
