import { Link } from "react-router-dom";
import { CourtCard } from "@/components/brand/CourtCard";
import type { SearchCourt } from "@/data/courts";
import { toSlug } from "@/lib/geo";

interface Props {
  courts: SearchCourt[];
  loading?: boolean;
  onLoadMore?: () => void;
}

export const GridView = ({ courts, loading, onLoadMore }: Props) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <GridCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courts.map((c) => (
          <Link
            key={c.id}
            to={`/canchas/argentina/${toSlug(c.city)}/${toSlug(c.neighborhood)}/${toSlug(c.name)}`}
            className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-orange rounded-xl"
          >
            <CourtCard
              name={c.name}
              neighborhood={c.neighborhood}
              city={c.city}
              image={c.thumb}
              sports={c.sports}
              premium={c.premium}
            />
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <button
          onClick={onLoadMore}
          className="inline-flex items-center justify-center px-6 h-11 rounded-md bg-orange text-white text-[13px] font-semibold uppercase tracking-wider hover:brightness-90 transition"
        >
          Cargar más
        </button>
      </div>
    </>
  );
};

const GridCardSkeleton = () => (
  <div className="rounded-xl border border-border bg-card overflow-hidden">
    <div className="aspect-[16/10] bg-muted animate-pulse" />
    <div className="p-4 space-y-2">
      <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
      <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
      <div className="h-8 w-full bg-muted animate-pulse rounded mt-3" />
    </div>
  </div>
);
