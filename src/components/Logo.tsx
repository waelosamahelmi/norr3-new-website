const LOGO_SRC = "https://norr3.fi/wp-content/uploads/2025/02/Logo-01.png";

export function Logo({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <img
      src={LOGO_SRC}
      alt="NØRR3"
      className={`h-6 w-auto select-none ${variant === "light" ? "brightness-0 invert" : ""} ${className}`}
      draggable={false}
    />
  );
}
