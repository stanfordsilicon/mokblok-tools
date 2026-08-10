const RADIUS = 7;
const CENTER = 8; // viewBox="0 0 16 16"

type CompletionPieProps = {
  label: string;
  primaryFraction: number; // 0–1
  warningFraction?: number; // 0–1
  size?: number;
};

function PieChart({ label, primaryFraction, warningFraction, size = 32 }: CompletionPieProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className="w-full" aria-hidden="true">
      <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="var(--color-level-0)" />

      <PieSlice
        startingAngle={0}
        arcAngle={primaryFraction}
        hue={warningFraction == null ? primaryFraction : 1}
      />
      {warningFraction && (
        <PieSlice startingAngle={primaryFraction} arcAngle={warningFraction} hue={0} />
      )}
      <text
        x={CENTER}
        y={CENTER}
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

const PieSlice: React.FC<{
  startingAngle: number; // 0-1
  arcAngle: number; // 0–1
  hue: number; // 0-1
}> = ({ startingAngle, arcAngle, hue }) => {
  const value = Math.min(1, Math.max(0, arcAngle));
  const radius = 7;
  const center = 8;

  const startAngle = startingAngle * Math.PI * 2;
  const endAngle = startAngle + value * Math.PI * 2;
  const endX = center + radius * Math.sin(endAngle);
  const endY = center - radius * Math.cos(endAngle);
  const largeArcFlag = value > 0.5 ? 1 : 0;

  const path =
    value === 0 ? null : value === 1 ? (
      <circle cx={center} cy={center} r={radius} />
    ) : (
      <path
        d={[
          `M ${center} ${center}`,
          `L ${center + radius * Math.sin(startAngle)} ${center - radius * Math.cos(startAngle)}`,
          `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
          'Z',
        ].join(' ')}
      />
    );

  return <g fill={`hsl(${hue * 120}, 60%, 60%)`}>{path}</g>;
};

export default PieChart;
