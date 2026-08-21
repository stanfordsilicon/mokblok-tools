import useLanguageName from '@data/useLanguageName';

type Props = {
  current: string;
  onChange: (newLanguage: string) => void;
  options: string[];
  disabled?: boolean;
};

const LanguageButtons: React.FC<Props> = ({ current, onChange, options, disabled = false }) => {
  const { getLanguageName } = useLanguageName();
  const languageOptions = options
    .map(getLanguageName)
    .sort((a, b) => a.endonym.localeCompare(b.endonym));

  return (
    <div className="flex flex-wrap gap-1 items-center mt-1">
      {languageOptions.map((lang) => (
        <button
          key={lang.code}
          className={lang.code === current ? 'selected' : ''}
          disabled={disabled}
          onClick={() => onChange(lang.code)}
        >
          {lang.endonym}
          <br />
          <span className="font-light">{lang.localizedName}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageButtons;
