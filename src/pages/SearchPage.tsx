import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Filter, List, Map as MapIcon } from "lucide-react";
import { Navbar } from "@/components/brand/Navbar";
import { SearchHeader } from "@/components/search/SearchHeader";
import { FiltersPanel, type FiltersState } from "@/components/search/FiltersPanel";
import { ResultCard, ResultCardSkeleton } from "@/components/search/ResultCard";
import { MapView } from "@/components/search/MapView";
import { EmptyState } from "@/components/search/EmptyState";
import { Breadcrumb } from "@/components/search/Breadcrumb";
import { ViewToggle, type ViewMode } from "@/components/search/ViewToggle";
import { GridView } from "@/components/search/GridView";
import { ListView } from "@/components/search/ListView";
import { FiltersChipBar } from "@/components/search/FiltersChipBar";
import { SAMPLE_COURTS } from "@/data/courts";
import { cn } from "@/lib/utils";
import { AdSlot } from "@/components/brand/AdSlot";
import { countrySlugToName } from "@/lib/geo";

const DEFAULT_FILTERS: FiltersState = {
  sports: [],
  surface: "Todos",
  services: [],
  sort: "Relevancia",
  country: "Todos los países",
};

const VIEW_STORAGE_KEY = "haycancha:search:view";
const VIEW_LABELS: Record<ViewMode, string> = {
  map: "mapa",
  grid: "grilla",
  list: "lista",
};

const titleCase = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const isViewMode = (v: string | null): v is ViewMode =>
  v === "map" || v === "grid" || v === "list";

const SearchPage = () => {
  const { pais, ciudad, barrio } = useParams();
  const [params, setParams] = useSearchParams();
  const sportParam = params.get("deporte");

  const initialCountry = pais ? countrySlugToName(pais) : "Todos los países";

  // View mode: URL > localStorage > "map"
  const initialView: ViewMode = useMemo(() => {
    const fromUrl = params.get("view");
    if (isViewMode(fromUrl)) return fromUrl;
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
      if (isViewMode(stored)) return stored;
    }
    return "map";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [view, setView] = useState<ViewMode>(initialView);
  const [transitioning, setTransitioning] = useState(false);

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FiltersState>(() => ({
    ...DEFAULT_FILTERS,
    sports: sportParam ? [sportParam] : [],
    country: initialCountry,
  }));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading] = useState(false);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Persist view to URL + localStorage
  const handleViewChange = (next: ViewMode) => {
    if (next === view) return;
    setTransitioning(true);
    setView(next);
    window.localStorage.setItem(VIEW_STORAGE_KEY, next);
    const sp = new URLSearchParams(params);
    if (next === "map") sp.delete("view");
    else sp.set("view", next);
    setParams(sp, { replace: true });
    // Reset scroll to top of results area
    requestAnimationFrame(() => {
      document.getElementById("results-top")?.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
    });
    setTimeout(() => setTransitioning(false), 160);
  };

  // Sync view from URL on first mount (in case it differed from state initializer race)
  useEffect(() => {
    const fromUrl = params.get("view");
    if (isViewMode(fromUrl) && fromUrl !== view) {
      setView(fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    : ciudad
    ? titleCase(ciudad)
    : pais
    ? countrySlugToName(pais)
    : "Latinoamérica";

  const crumbs = [
    { label: "Canchas", href: "/canchas" },
    ...(pais ? [{ label: countrySlugToName(pais), href: `/canchas/${pais}` }] : []),
    ...(ciudad ? [{ label: titleCase(ciudad), href: `/canchas/${pais}/${ciudad}` }] : []),
    ...(barrio ? [{ label: titleCase(barrio) }] : []),
  ];
  if (!pais && !ciudad && !barrio) crumbs[crumbs.length - 1] = { label: "Canchas" };

  const activeFiltersCount =
    filters.sports.length +
    filters.services.length +
    (filters.surface !== "Todos" ? 1 : 0) +
    (filters.country !== "Todos los países" ? 1 : 0);

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setQuery("");
  };

  const resultsLabel = `${filtered.length} canchas en ${locationLabel}`;

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />

      {/* SR-only live region announcing view changes */}
      <div className="sr-only" aria-live="polite">
        Vista cambiada a {VIEW_LABELS[view]}
      </div>

      {view === "map" ? (
        // ===== MAP VIEW (DEFAULT — unchanged behavior) =====
        <div className="flex flex-1 min-h-0" style={{ height: "calc(100vh - 60px)" }}>
          {/* Left column */}
          <aside
            className={cn(
              "w-full md:w-[420px] md:shrink-0 flex flex-col bg-white border-r border-border md:shadow-[0_2px_4px_rgba(0,0,0,0.05)] z-10",
              "md:flex",
              mobileView === "list" ? "flex" : "hidden md:flex"
            )}
          >
            <div className="shrink-0">
              <div className="px-4 pt-4 flex items-start justify-between gap-3">
                <Breadcrumb items={crumbs} />
              </div>
              <SearchHeader
                value={query}
                onChange={setQuery}
                resultsLabel={resultsLabel}
              />
              {/* Toggle: desktop right-aligned in header strip */}
              <div className="hidden md:flex items-center justify-between px-4 py-2 border-b border-border bg-white">
                <span className="text-[12px] uppercase tracking-wider text-gray font-semibold">Vista</span>
                <ViewToggle value={view} onChange={handleViewChange} />
              </div>
              {/* Toggle: mobile full-width below search bar */}
              <div className="md:hidden px-4 py-2 border-b border-border bg-white">
                <ViewToggle value={view} onChange={handleViewChange} stacked />
              </div>
            </div>

            <div className={cn("shrink-0", "md:block", filtersOpen ? "block" : "hidden md:block")}>
              <FiltersPanel
                value={filters}
                onChange={setFilters}
                onApply={() => setFiltersOpen(false)}
                onClear={clearFilters}
              />
            </div>

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

            <div className="flex-1 overflow-y-auto" id="results-top">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <ResultCardSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <EmptyState onClear={clearFilters} />
              ) : (
                <>
                  {filtered.map((c, i) => (
                    <div key={c.id}>
                      <ResultCard
                        court={c}
                        active={activeId === c.id}
                        onClick={() => setActiveId(c.id)}
                        onHover={() => setActiveId(c.id)}
                      />
                      {i === 5 && (
                        <div className="px-3">
                          <AdSlot slot="search-infeed-1" format="infeed" />
                        </div>
                      )}
                      {i === 17 && filtered.length > 18 && (
                        <div className="px-3">
                          <AdSlot slot="search-infeed-2" format="infeed" />
                        </div>
                      )}
                    </div>
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

          <div className={cn("flex-1 relative", mobileView === "map" ? "block" : "hidden md:block")}>
            <MapView courts={filtered} activeId={activeId} onSelect={setActiveId} />
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
      ) : (
        // ===== GRID & LIST VIEWS =====
        <div className="flex-1">
          <div
            className={cn(
              "mx-auto px-6 py-6 transition-opacity duration-150 ease-out",
              view === "grid" ? "max-w-[1200px]" : "max-w-[1000px]",
              transitioning ? "opacity-0" : "opacity-100"
            )}
          >
            <div className="space-y-4" id="results-top">
              <Breadcrumb items={crumbs} />

              {/* Header row: title + view toggle (desktop) */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-[260px]">
                  <SearchHeader
                    value={query}
                    onChange={setQuery}
                    resultsLabel={resultsLabel}
                  />
                </div>
                <div className="hidden md:block pt-1">
                  <ViewToggle value={view} onChange={handleViewChange} />
                </div>
              </div>
              {/* Mobile toggle */}
              <div className="md:hidden">
                <ViewToggle value={view} onChange={handleViewChange} stacked />
              </div>

              {/* Chip filter bar */}
              <FiltersChipBar
                value={filters}
                onChange={setFilters}
                onClear={clearFilters}
                resultsLabel={resultsLabel}
              />

              <div className="pt-2">
                {filtered.length === 0 ? (
                  <div className="bg-white rounded-lg border border-border">
                    <EmptyState onClear={clearFilters} />
                  </div>
                ) : view === "grid" ? (
                  <GridView courts={filtered} loading={loading} />
                ) : (
                  <ListView courts={filtered} loading={loading} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
