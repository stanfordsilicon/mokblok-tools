import type { DataPage, DataSection } from '@data/DataSection';

import { getCompletionForSection } from './getDataEntriesForSection';

type Props = {
  page: DataPage;
  section?: DataSection;
};

const ProgressCircle: React.FC<Props> = ({ page, section }) => {
  const completion = getCompletionForSection(page, section);
  if (completion === undefined) return null;
  return <CompletionPie label={`${completion.toFixed(0)}%`} progress={completion / 100} />;
  //   return (
  //     <div
  //       style={{
  //         backgroundColor: 'var(--color-button-background)',
  //         opacity: 0.5,
  //         width: '2.5em',
  //         height: '2.5em',
  //         borderRadius: '2em',
  //         textAlign: 'center',
  //         lineHeight: '2.5em',
  //         fontWeight: 200,
  //       }}
  //     >
  //       {completion.toFixed(0)}
  //       <span style={{ fontSize: '0.5em' }}>%</span>
  //     </div>
  //   );
};

type CompletionPieProps = {
  label: string;
  progress: number; // 0–1
  size?: number;
  className?: string;
};

export function CompletionPie({ label, progress, size = 32, className }: CompletionPieProps) {
  const value = Math.min(1, Math.max(0, progress));
  const radius = 7;
  const center = 8;

  const angle = value * Math.PI * 2;
  const endX = center + radius * Math.sin(angle);
  const endY = center - radius * Math.cos(angle);
  const largeArcFlag = value > 0.5 ? 1 : 0;

  const path =
    value === 0 ? null : value === 1 ? (
      <circle cx={center} cy={center} r={radius} />
    ) : (
      <path
        d={[
          `M ${center} ${center}`,
          `L ${center} ${center - radius}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
          'Z',
        ].join(' ')}
      />
    );

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className={className} aria-hidden="true">
      <circle cx={center} cy={center} r={radius} fill="var(--color-level-0)" />

      <g fill={`hsl(${value * 120}, 60%, 60%)`}>{path}</g>
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-primary"
        fontSize="0.5em"
        fill="var(--color-text)"
      >
        {label}
      </text>
    </svg>
  );
}

export default ProgressCircle;
