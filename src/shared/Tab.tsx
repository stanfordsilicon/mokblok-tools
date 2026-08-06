type Props<T> = {
  label: React.ReactNode;
  option: T;
  selected: T;
  setSelected: (option: T) => void;
  style?: React.CSSProperties;
};

function Tab<T>({ label, option, selected, setSelected, style }: Props<T>) {
  const isSelected = selected === option;
  return (
    <button
      onClick={() => setSelected(option)}
      className={isSelected ? 'selected' : ''}
      style={style}
    >
      {label}
    </button>
  );
}

export default Tab;
