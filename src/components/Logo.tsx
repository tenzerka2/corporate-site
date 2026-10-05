export function Logo({
  dark = false,
  markOnly = false,
}: {
  dark?: boolean;
  markOnly?: boolean;
}) {
  return (
    <svg
      className={`logo ${markOnly ? "logo-mark" : ""}`}
      width={markOnly ? 48 : 156}
      height="40"
      viewBox={markOnly ? "0 0 48 40" : "0 0 156 40"}
      role="img"
      aria-label="Онега"
    >
      <g
        fill="none"
        stroke={dark ? "#FFFFFF" : "#0B2A4A"}
        strokeWidth="4.5"
        strokeLinecap="round"
      >
        <path d="M4 11 C16 5 28 15 42 8" />
        <path d="M4 21 C14 15 23 25 35 18" />
        <path d="M4 31 C11 27 18 33 27 28" stroke="#F26B1D" />
      </g>
      {!markOnly && (
        <text
          x="53"
          y="30"
          fill={dark ? "#FFFFFF" : "#0B2A4A"}
          fontFamily="var(--font-inter), Inter, sans-serif"
          fontSize="30"
          fontWeight="700"
          letterSpacing="-1.5"
        >
          Онега
        </text>
      )}
    </svg>
  );
}
