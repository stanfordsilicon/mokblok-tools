import useLanguageName from '@data/useLanguageName';

type Props = {
  current: string;
  onChange: (newLanguage: string) => void;
  options: string[];
};

const LanguageButtons: React.FC<Props> = ({ current, onChange, options }) => {
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
