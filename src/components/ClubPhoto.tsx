import { assetUrl } from "@/lib/directus";

interface ClubPhotoProps {
  clubName: string;
  fileId: string | null | undefined;
  primarySportSlug?: "tenis" | "padel" | "pickleball" | null;
  width: number;
  height: number;
  alt?: string;
  className?: string;
  loading?: "eager" | "lazy";
  /**
   * Typography scale for the no-photo placeholder. Container size is governed
   * by `className` from the parent (e.g. `w-full h-full`); this prop only
   * controls the rendered name's font size and padding.
   *   sm → 11px (≤80px thumbs, list / map sidebar)
   *   md → 14px (default, ~150–250px grid cards)
   *   lg → 18px (hero / featured premium cards)
   */
  size?: "sm" | "md" | "lg";
}

const DARK_TEXT = "#2C2D35";

const SPORT_BG_COLORS: Record<string, { bg: string; text: string }> = {
  tenis: { bg: "#E7E242", text: DARK_TEXT },
  padel: { bg: "#5DB8D4", text: DARK_TEXT },
  pickleball: { bg: "#84CC16", text: DARK_TEXT },
};

// No primary sport known → neutral gray (per spec), still with dark text.
const DEFAULT_FALLBACK = { bg: "#9CA3AF", text: DARK_TEXT };

const SIZE_STYLES: Record<NonNullable<ClubPhotoProps["size"]>, { text: string; pad: string }> = {
  sm: { text: "text-[11px]", pad: "p-2" },
  md: { text: "text-[14px]", pad: "p-3" },
  lg: { text: "text-[18px]", pad: "p-4" },
};

/**
 * Renders the club's foto_portada via Directus assets endpoint, or a colored
 * placeholder with the club name when no photo exists. Placeholder background
 * uses the primary sport color when known.
 */
export function ClubPhoto({
  clubName,
  fileId,
  primarySportSlug,
  width,
  height,
  alt,
  className = "",
  loading = "lazy",
  size = "md",
}: ClubPhotoProps) {
  if (fileId) {
    const url = assetUrl(fileId, { width, height, fit: "cover", quality: 80 });
    return (
      <img
        src={url}
        alt={alt ?? clubName}
        width={width}
        height={height}
        loading={loading}
        className={className}
      />
    );
  }

  const colors = primarySportSlug
    ? SPORT_BG_COLORS[primarySportSlug] ?? DEFAULT_FALLBACK
    : DEFAULT_FALLBACK;
  const { text, pad } = SIZE_STYLES[size];

  return (
    <div
      role="img"
      aria-label={alt ?? clubName}
      className={`flex items-center justify-center text-center font-semibold ${pad} ${className}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      <span className={`${text} leading-tight line-clamp-2 break-words [overflow-wrap:anywhere]`}>
        {clubName}
      </span>
    </div>
  );
}
