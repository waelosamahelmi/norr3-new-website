/**
 * The stair-step "pixel dissolve" motif from the Figma cards, built from a
 * diagonal run of squares. Decorative only.
 */
export function PixelArt({
  color = "#000000",
  className = "",
  steps = 7,
  cell = 14,
}: {
  color?: string;
  className?: string;
  steps?: number;
  cell?: number;
}) {
  const size = steps + 2;
  const squares: { x: number; y: number; o: number }[] = [];
  for (let i = 0; i < steps; i++) {
    squares.push({ x: i, y: i, o: 1 });
    squares.push({ x: i + 1, y: i, o: 0.66 });
    squares.push({ x: i, y: i + 1, o: 0.66 });
    squares.push({ x: i + 2, y: i, o: 0.33 });
    squares.push({ x: i, y: i + 2, o: 0.33 });
  }
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${size * cell} ${size * cell}`}
      className={className}
      preserveAspectRatio="xMinYMin meet"
    >
      {squares.map((s, i) => (
        <rect
          key={i}
          x={s.x * cell}
          y={s.y * cell}
          width={cell}
          height={cell}
          fill={color}
          opacity={s.o}
        />
      ))}
    </svg>
  );
}
