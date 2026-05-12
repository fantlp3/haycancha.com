type SportKey = "tenis" | "padel" | "pickleball";

interface SportIconProps {
  sport: SportKey;
  size?: number;
  className?: string;
}

const ARIA_LABELS: Record<SportKey, string> = {
  tenis: "Tenis",
  padel: "Pádel",
  pickleball: "Pickleball",
};

export function SportIcon({ sport, size = 16, className }: SportIconProps) {
  const ariaLabel = ARIA_LABELS[sport];

  if (sport === "tenis") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 100"
        role="img"
        aria-label={ariaLabel}
        className={className}
      >
        <ellipse cx="40" cy="30" rx="22" ry="26" fill="#E7E242" stroke="#1a1a1a" strokeWidth="3" />
        <line x1="40" y1="8" x2="40" y2="52" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.6" />
        <line x1="22" y1="30" x2="58" y2="30" stroke="#1a1a1a" strokeWidth="1.5" opacity="0.6" />
        <rect x="36" y="56" width="8" height="28" fill="#1a1a1a" rx="2.5" />
      </svg>
    );
  }

  if (sport === "padel") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 100"
        role="img"
        aria-label={ariaLabel}
        className={className}
      >
        <path
          d="M 40 4 C 60 4 64 24 64 36 C 64 50 56 60 40 60 C 24 60 16 50 16 36 C 16 24 20 4 40 4 Z"
          fill="#5DB8D4"
          stroke="#1a1a1a"
          strokeWidth="3"
        />
        <circle cx="32" cy="28" r="2.2" fill="#1a1a1a" />
        <circle cx="48" cy="28" r="2.2" fill="#1a1a1a" />
        <circle cx="40" cy="38" r="2.2" fill="#1a1a1a" />
        <circle cx="32" cy="48" r="2.2" fill="#1a1a1a" />
        <circle cx="48" cy="48" r="2.2" fill="#1a1a1a" />
        <rect x="36" y="60" width="8" height="28" fill="#1a1a1a" rx="2.5" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 100"
      role="img"
      aria-label={ariaLabel}
      className={className}
    >
      <path
        d="M 40 4 C 58 4 62 18 62 32 C 62 46 56 56 40 56 C 24 56 18 46 18 32 C 18 18 22 4 40 4 Z"
        fill="#84CC16"
        stroke="#1a1a1a"
        strokeWidth="3"
      />
      <rect x="36" y="56" width="8" height="28" fill="#1a1a1a" rx="2.5" />
      <circle cx="40" cy="30" r="8" fill="#fff" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="37" cy="28" r="1.3" fill="#1a1a1a" />
      <circle cx="43" cy="28" r="1.3" fill="#1a1a1a" />
      <circle cx="40" cy="31" r="1.3" fill="#1a1a1a" />
      <circle cx="38" cy="33" r="1.3" fill="#1a1a1a" />
      <circle cx="42" cy="33" r="1.3" fill="#1a1a1a" />
    </svg>
  );
}
