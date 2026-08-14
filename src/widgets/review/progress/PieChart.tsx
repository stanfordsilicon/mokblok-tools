const RADIUS = 7;
const CENTER = 8; // viewBox="0 0 16 16"

type CompletionPieProps = {
  label?: string; // text that appears in the center of the pie chart
  size?: number;

  // Fraction can be a single number (0-1) that will show a slice colored by the hue of the fraction (0 = red, 1 = green)
  //
  // Alternatively, you can specify multiple slices by passing an array of numbers.
  // 2 numbers will show 2 slices that are colored red & green
  // 3+ numbers will show evenly colored hues from red to green
  // 5+ numbers will use the --color-level-* colors for the slices (red, orange, yellow, green, cyan, blue, purple)
  fraction: number | number[]; // 0–1 or list of 0-1, with each number representing a slice of the pie. corresponding to the colors
};

function PieChart({ label, fraction, size = 32 }: CompletionPieProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className="w-full" aria-hidden="true">
      <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="var(--silicon-beige)" />

      {Array.isArray(fraction) ? (
        fraction.map((value, index) => {
          const startingAngle =
            index === 0 ? 0 : fraction.slice(0, index).reduce((a, b) => a + b, 0);
          let hue = index / Math.min(fraction.length - 1, 4); // evenly spaced hues
          if (fraction.length > 4) {
            if (hue >= 0.75) hue += 0.25; // skip lime
          }
          return <PieSlice key={index} startingAngle={startingAngle} arcAngle={value} hue={hue} />;
        })
      ) : (
        <PieSlice startingAngle={0} arcAngle={fraction} hue={fraction} />
      )}
      {label && (
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
      )}
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
