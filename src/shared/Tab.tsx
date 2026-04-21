type Props<T> = {
  label: React.ReactNode;
  option: T;
  selected: T;
  setSelected: (option: T) => void;
  style?: React.CSSProperties;
};

function Tab<T>({ label, option, selected, setSelected, style }: Props<T>) {
  const isSelected = selected === option;
  const border = isSelected ? 'solid #ccc' : 'none';
  return (
    <button
      onClick={() => setSelected(option)}
      className={isSelected ? 'selected' : ''}
      style={{
        borderRadius: '.5em .5em 0 0',
        borderTop: border,
        borderLeft: border,
        borderRight: border,
        padding: '.5em 1em',
        ...style,
      }}
    >
      {label}
    </button>
  );
}

export default Tab;
