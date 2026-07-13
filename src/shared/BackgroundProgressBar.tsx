import React from 'react';

type Props = React.PropsWithChildren<{
  percentage: number;
  style?: React.CSSProperties;
}>;

const BackgroundProgressBar: React.FC<Props> = ({ percentage, children, style }) => {
  const colorLevel = Math.floor(percentage / 25) + 1;

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'var(--color-button-background)',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          zIndex: 0,
          top: 0,
          left: 0,
          height: '100%',
          width: `${percentage}%`,
          backgroundColor: `var(--color-level-${colorLevel})`,
          ...style,
        }}
      />
      <div style={{ zIndex: 1, position: 'relative', height: '100%', alignContent: 'center' }}>
        {children}
      </div>
    </div>
  );
};

export default BackgroundProgressBar;
