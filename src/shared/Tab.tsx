type Props<T> = {
  label: React.ReactNode;
  option: T;
  selected: T;
  setSelected: (option: T) => void;
};

function Tab<T>({ label, option, selected, setSelected }: Props<T>) {
  const isSelected = selected === option;
  return (
    <button
      onClick={() => setSelected(option)}
      className={isSelected ? 'selected' : ''}
      style={{ borderRadius: '.5em .5em 0 0', padding: '.5em 1em', position: 'relative' }}
    >
      {label}
    </button>
  );
}

export default Tab;
