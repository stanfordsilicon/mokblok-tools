type HighlightInputProps = {
  value: string;
  onChange: (value: string) => void;
  highlight: RegExp;
  disabled?: boolean;
  style?: React.CSSProperties;
};

function HighlightInput({ value, onChange, highlight, disabled, style }: HighlightInputProps) {
  return (
    <div
      data-testid="highlight-input"
      style={{
        position: 'relative',
        display: 'inline-block',
        font: 'inherit',
        border: '1px solid var(--color-input-border)',
        backgroundColor: disabled ? 'transparent' : 'var(--color-input-background)',
        borderRadius: '2px',
        ...style,
      }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          style={{
            padding: '2px 3px',
            whiteSpace: 'pre',
            font: 'inherit',
            color: 'var(--color-text)',
          }}
        >
          {getHighlightNodes(value, highlight)}
        </div>
      </div>
      <input
        style={{
          position: 'relative',
          zIndex: 1,
          boxSizing: 'border-box',
          width: '100%',
          font: 'inherit',
          background: 'transparent',
          color: 'transparent',
          caretColor: 'var(--color-text)',
          border: 'none',
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}

function getHighlightNodes(value: string, regex: RegExp) {
  if (!value) return value;

  const flags = regex.flags.includes('g') ? regex.flags : `${regex.flags}g`;
  const matcher = new RegExp(regex.source, flags);
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = matcher.exec(value)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(value.slice(lastIndex, match.index));
    }

    const matchText = match[0];
    if (matchText) {
      nodes.push(
        <span
          key={`mark-${key}`}
          style={{
            backgroundColor: 'transparent',
            borderRadius: '2px',
            color: 'var(--color-text-highlighted)',
          }}
        >
          {matchText}
        </span>,
      );
      key += 1;
      lastIndex = match.index + matchText.length;
    }

    if (matchText.length === 0) {
      matcher.lastIndex += 1;
    }
  }

  if (lastIndex < value.length) {
    nodes.push(value.slice(lastIndex));
  }

  return nodes;
}

export default HighlightInput;
