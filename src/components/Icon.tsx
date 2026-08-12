export function Icon({
  name,
  className = "",
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={`material-symbols-outlined select-none leading-none ${className}`}
      style={style}
    >
      {name}
    </span>
  );
}
