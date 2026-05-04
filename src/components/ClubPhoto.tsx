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
}

const SPORT_BG_COLORS: Record<string, { bg: string; text: string }> = {
  tenis: { bg: "#E7E242", text: "#1F2937" },
  padel: { bg: "#5DB8D4", text: "#FFFFFF" },
  pickleball: { bg: "#84CC16", text: "#FFFFFF" },
};

const DEFAULT_FALLBACK = { bg: "#1F2937", text: "#FFFFFF" };

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

  return (
    <div
      role="img"
      aria-label={alt ?? clubName}
      className={`flex items-center justify-center text-center font-semibold ${className}`}
      style={{
        width,
        height,
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      <span className="px-4 text-lg leading-tight">{clubName}</span>
    </div>
  );
}
