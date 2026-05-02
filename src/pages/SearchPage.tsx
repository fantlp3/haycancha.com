import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Filter, List, Map as MapIcon } from "lucide-react";
import { Navbar } from "@/components/brand/Navbar";
import { SearchHeader } from "@/components/search/SearchHeader";
import { FiltersPanel, type FiltersState } from "@/components/search/FiltersPanel";
import { ResultCard, ResultCardSkeleton } from "@/components/search/ResultCard";
import { MapView } from "@/components/search/MapView";
import { EmptyState } from "@/components/search/EmptyState";
import { Breadcrumb } from "@/components/search/Breadcrumb";
import { SAMPLE_COURTS } from "@/data/courts";
import { cn } from "@/lib/utils";

const DEFAULT_FILTERS: FiltersState = {
  sports: [],
  surface: "Todos",
  services: [],
  sort: "Relevancia",
};

const titleCase = (s: string) =>
  s
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const SearchPage = () => {
  const { provincia, barrio } = useParams();
  const [params] = useSearchParams();
  const sportParam = params.get("deporte");

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FiltersState>(() => ({
    ...DEFAULT_FILTERS,
    sports: sportParam ? [sportParam] : [],
  }));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading] = useState(false);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return SAMPLE_COURTS.filter((c) => {
      if (filters.sports.length && !c.sports.some((s) => filters.sports.includes(s))) return false;
      if (filters.surface !== "Todos" && c.surface !== filters.surface) return false;
      if (query && !`${c.name} ${c.neighborhood} ${c.city}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [filters, query]);

  const locationLabel = barrio
    ? titleCase(barrio)
    : provincia
    ? titleCase(provincia)
    : "Argentina";

  const crumbs = [
    { label: "Canchas", href: "/canchas" },
    ...(provincia ? [{ label: titleCase(provincia), href: `/canchas/${provincia}` }] : []),
    ...(barrio ? [{ label: titleCase(barrio) }] : []),
  ];
  if (!provincia && !barrio) crumbs[crumbs.length - 1] = { label: "Canchas" };

  const activeFiltersCount =
    filters.sports.length +
    filters.services.length +
    (filters.surface !== "Todos" ? 1 : 0);

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setQuery("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />

      <div className="flex flex-1 min-h-0" style={{ height: "calc(100vh - 64px)" }}>
        {/* Left column */}
        <aside
          className={cn(
            "w-full md:w-[420px] md:shrink-0 flex flex-col bg-white border-r border-border md:shadow-[0_2px_4px_rgba(0,0,0,0.05)] z-10",
            "md:flex",
            mobileView === "list" ? "flex" : "hidden md:flex"
          )}
        >
          {/* Sticky header */}
          <div className="shrink-0">
            <div className="px-4 pt-4">
              <Breadcrumb items={crumbs} />
            </div>
            <SearchHeader
              value={query}
              onChange={setQuery}
              resultsLabel={`${filtered.length} canchas en ${locationLabel}`}
            />
          </div>

          {/* Filters (collapsible on mobile) */}
          <div
            className={cn(
              "shrink-0",
              "md:block",
              filtersOpen ? "block" : "hidden md:block"
            )}
          >
            <FiltersPanel
              value={filters}
              onChange={setFilters}
              onApply={() => setFiltersOpen(false)}
              onClear={clearFilters}
            />
          </div>

          {/* Mobile filters toggle */}
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className="md:hidden flex items-center justify-center gap-2 py-2.5 text-[13px] font-semibold text-dark border-b border-border bg-light"
          >
            <Filter size={14} />
            {filtersOpen ? "Ocultar filtros" : "Mostrar filtros"}
            {activeFiltersCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-orange text-white text-[11px] font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Results list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <ResultCardSkeleton key={i} />)
            ) : filtered.length === 0 ? (
              <EmptyState onClear={clearFilters} />
            ) : (
              <>
                {filtered.map((c) => (
                  <ResultCard
                    key={c.id}
                    court={c}
                    active={activeId === c.id}
                    onClick={() => setActiveId(c.id)}
                    onHover={() => setActiveId(c.id)}
                  />
                ))}
                <div className="p-4">
                  <button className="w-full py-3 border border-border rounded-md text-[13px] font-semibold text-dark hover:border-orange hover:text-orange transition">
                    Cargar más
                  </button>
                </div>
              </>
            )}
          </div>
        </aside>

        {/* Right column — map */}
        <div
          className={cn(
            "flex-1 relative",
            mobileView === "map" ? "block" : "hidden md:block"
          )}
        >
          <MapView courts={filtered} activeId={activeId} onSelect={setActiveId} />

          {/* Mobile floating "Ver lista / Ver mapa" toggle */}
          <button
            onClick={() => setMobileView(mobileView === "map" ? "list" : "map")}
            className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 bg-orange text-white px-5 py-3 rounded-full shadow-card-hover text-[13px] font-semibold uppercase tracking-wider hover:brightness-90 transition"
          >
            {mobileView === "map" ? (
              <>
                <List size={16} /> Ver lista ({filtered.length})
              </>
            ) : (
              <>
                <MapIcon size={16} /> Ver mapa
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
