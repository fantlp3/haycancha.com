import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Filter, List, Map as MapIcon } from "lucide-react";
import { Navbar } from "@/components/brand/Navbar";
import { SearchHeader } from "@/components/search/SearchHeader";
import { FiltersPanel, type FiltersState } from "@/components/search/FiltersPanel";
import { ResultCard, ResultCardSkeleton } from "@/components/search/ResultCard";
import { MapView } from "@/components/search/MapView";
import { EmptyState } from "@/components/search/EmptyState";
import { SearchQueryChip } from "@/components/search/SearchQueryChip";
import { PromoSlot } from "@/components/promo/PromoSlot";
import { Breadcrumb } from "@/components/search/Breadcrumb";
import { ViewToggle, type ViewMode } from "@/components/search/ViewToggle";
import { GridView } from "@/components/search/GridView";
import { ListView } from "@/components/search/ListView";
import { ActiveFiltersChips } from "@/components/search/ActiveFiltersChips";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdSlot } from "@/components/brand/AdSlot";
import { countrySlugToName, countryNameToSlug } from "@/lib/geo";
import { filterClubs } from "@/lib/filter";
import { getDefaultView } from "@/lib/view-mode";
import {
  useAllClubes,
  useClubesByPais,
  useClubesByCiudad,
  useClubesByBarrio,
} from "@/hooks/useClubes";

const DEFAULT_FILTERS: FiltersState = {
  sports: [],
  surfaces: [],
  services: [],
  sort: "Relevancia",
  country: "Todos los países",
};

const VIEW_LABELS: Record<ViewMode, string> = {
  map: "mapa",
  grid: "grilla",
  list: "lista",
};

const titleCase = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const nfAR = new Intl.NumberFormat("es-AR");

const isViewMode = (v: string | null): v is ViewMode =>
  v === "map" || v === "grid" || v === "list";

const SearchPage = () => {
  // 4-seg URLs use :barrio; 3-seg URLs proxied via GeoRouterPage use :slug.
  // Treat either as the barrio filter.
  const { pais, ciudad, barrio: barrioParam, slug } = useParams();
  const barrio = barrioParam ?? slug;
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const sportParam = params.get("deporte");

  const initialCountry = pais ? countrySlugToName(pais) : "Todos los países";

  // View mode: URL > device default (grid on md+, list otherwise).
  // No localStorage — the URL is the single source of truth so links are
  // shareable and the back/forward buttons restore the prior view.
  const initialView: ViewMode = useMemo(() => {
    const fromUrl = params.get("view");
    if (isViewMode(fromUrl)) return fromUrl;
    return getDefaultView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [view, setView] = useState<ViewMode>(initialView);
  const [transitioning, setTransitioning] = useState(false);

  const urlQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const [filters, setFilters] = useState<FiltersState>(() => ({
    ...DEFAULT_FILTERS,
    sports: sportParam ? [sportParam] : [],
    country: initialCountry,
  }));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersSheetOpen, setFiltersSheetOpen] = useState(false);

  // Persist view to URL only. All three modes carry an explicit ?view= so
  // /canchas with no param falls back to the device default (grid/list).
  const handleViewChange = (next: ViewMode) => {
    if (next === view) return;
    setTransitioning(true);
    setView(next);
    const sp = new URLSearchParams(params);
    sp.set("view", next);
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

  // Re-sync local query state when ?q= changes externally (navigation, X-close).
  useEffect(() => {
    setQuery((prev) => (prev === urlQuery ? prev : urlQuery));
  }, [urlQuery]);

  const clearQuery = () => {
    setQuery("");
    const sp = new URLSearchParams(params);
    sp.delete("q");
    setParams(sp, { replace: true });
  };

  // Pick the correct data hook based on the deepest URL segment present.
  // Each hook gates itself with `enabled` so only one fetches.
  const barrioQuery = useClubesByBarrio(barrio);
  const ciudadQuery = useClubesByCiudad(!barrio ? ciudad : undefined);
  const paisQuery = useClubesByPais(!ciudad && !barrio ? pais : undefined);
  const allQuery = useAllClubes(!pais && !ciudad && !barrio);
  const clubsQuery = barrio
    ? barrioQuery
    : ciudad
    ? ciudadQuery
    : pais
    ? paisQuery
    : allQuery;
  const clubsData = clubsQuery.data;
  const dataLoading = clubsQuery.isLoading;

  // Keep filters.country aligned with the URL — country is URL-canonical, the
  // dropdown navigates rather than mutating in-memory state, and this useEffect
  // back-fills the panel so it reflects the live URL on every render.
  useEffect(() => {
    const expected = pais ? countrySlugToName(pais) : "Todos los países";
    setFilters((f) => (f.country === expected ? f : { ...f, country: expected }));
  }, [pais]);

  const handleCountryChange = (countryName: string) => {
    if (countryName === "Todos los países") {
      if (pais || ciudad || barrio) navigate("/canchas");
      return;
    }
    navigate(`/canchas/${countryNameToSlug(countryName)}`);
  };

  const filtered = useMemo(
    () =>
      filterClubs(clubsData ?? [], {
        sports: filters.sports,
        surfaces: filters.surfaces,
        services: filters.services,
        query,
      }),
    [clubsData, filters.sports, filters.surfaces, filters.services, query]
  );

  const scopeLabel =
    barrio && ciudad
      ? `${titleCase(barrio)}, ${titleCase(ciudad)}`
      : barrio
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
    filters.surfaces.length +
    (pais ? 1 : 0);

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setQuery("");
    if (pais || ciudad || barrio) navigate("/canchas");
  };

  // Counter is driven by the filtered list, not global stats. When any
  // in-memory filter is active we switch from "X clubes en {scope}" to
  // "X resultados en {scope}" so the wording reflects that the number is
  // narrowed. Scope is appended only when the URL has one — top-level
  // /canchas with active filters reads simply "X resultados".
  const inMemoryFilterActive =
    filters.sports.length > 0 ||
    filters.surfaces.length > 0 ||
    filters.services.length > 0;

  const n = filtered.length;
  const scopeContext = pais || ciudad || barrio ? ` en ${scopeLabel}` : "";
  const resultsLabel = dataLoading
    ? "Cargando…"
    : n === 0
    ? "Sin resultados"
    : inMemoryFilterActive
    ? n === 1
      ? `1 resultado${scopeContext}`
      : `${nfAR.format(n)} resultados${scopeContext}`
    : `${nfAR.format(n)} ${n === 1 ? "club" : "clubes"} en ${scopeLabel}`;

  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />

      {/* SR-only live region announcing view changes */}
      <div className="sr-only" aria-live="polite">
        Vista cambiada a {VIEW_LABELS[view]}
      </div>

      {view === "map" ? (
        // ===== MAP VIEW =====
        // Uses `fixed` to pull the map+sidebar out of the document flow so
        // no ancestor's height/overflow can leak page scroll. Navbar is 60px
        // sticky, so we start the fixed layer at top-[60px] and stretch to
        // bottom-0 — browser computes height, no vh/dvh/calc needed.
        <div className="fixed inset-x-0 top-[60px] bottom-0 flex">
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
                onClose={() => setFiltersOpen(false)}
                resultsCount={filtered.length}
                onClear={clearFilters}
                onCountryChange={handleCountryChange}
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

            {query.trim() !== "" && (
              <div className="shrink-0 px-4 py-2 border-b border-border bg-white">
                <SearchQueryChip query={query.trim()} onClear={clearQuery} />
              </div>
            )}

            <div className="flex-1 min-h-0 overflow-y-auto" id="results-top">
              {dataLoading ? (
                Array.from({ length: 5 }).map((_, i) => <ResultCardSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <EmptyState
                  onClear={query.trim() ? clearQuery : clearFilters}
                  query={query.trim() || undefined}
                />
              ) : (
                <>
                  {filtered.map((c, i) => (
                    <div key={c.id}>
                      <ResultCard
                        club={c}
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
                  <div className="px-3 pt-3">
                    <PromoSlot variant="rectangle" />
                  </div>
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
            <MapView clubs={filtered} />
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

              {/* Header row: search + filters trigger + view toggle (desktop) */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-[260px]">
                  <SearchHeader
                    value={query}
                    onChange={setQuery}
                    resultsLabel={resultsLabel}
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Sheet open={filtersSheetOpen} onOpenChange={setFiltersSheetOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 gap-2 border-border"
                      >
                        <SlidersHorizontal size={16} />
                        Filtros
                        {activeFiltersCount > 0 && (
                          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-orange text-white text-[11px] font-bold leading-none">
                            {activeFiltersCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
                      <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
                        <SheetTitle>Filtros</SheetTitle>
                      </SheetHeader>
                      <div className="flex-1 overflow-y-auto">
                        <FiltersPanel
                          value={filters}
                          onChange={setFilters}
                          resultsCount={filtered.length}
                          onClear={clearFilters}
                          onCountryChange={(name) => {
                            handleCountryChange(name);
                            setFiltersSheetOpen(false);
                          }}
                        />
                      </div>
                      <SheetFooter className="px-6 py-4 border-t border-border flex-row gap-2 sm:gap-2 sm:justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            clearFilters();
                          }}
                          className="text-[13px] font-medium text-gray hover:text-orange transition"
                        >
                          Limpiar todo
                        </button>
                        <Button onClick={() => setFiltersSheetOpen(false)} className="bg-orange hover:bg-orange/90 text-white">
                          Ver resultados ({nfAR.format(filtered.length)})
                        </Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                  <div className="hidden md:block">
                    <ViewToggle value={view} onChange={handleViewChange} />
                  </div>
                </div>
              </div>
              {/* Mobile toggle */}
              <div className="md:hidden">
                <ViewToggle value={view} onChange={handleViewChange} stacked />
              </div>

              {query.trim() !== "" && (
                <div>
                  <SearchQueryChip query={query.trim()} onClear={clearQuery} />
                </div>
              )}

              {/* Active filter chips — only renders when at least one facet is active. */}
              <ActiveFiltersChips
                value={filters}
                onChange={setFilters}
                paisSlug={pais}
                onCountryClear={() => handleCountryChange("Todos los países")}
                onClearAll={clearFilters}
              />

              {/* Desktop-only — on mobile the promo is intercalated after the
                  6th result (passed as mobilePromo prop below). */}
              <div className="hidden md:block">
                <PromoSlot variant="inline" />
              </div>

              <div className="pt-2">
                {dataLoading ? (
                  view === "grid" ? (
                    <GridView clubs={[]} loading />
                  ) : (
                    <ListView clubs={[]} loading />
                  )
                ) : filtered.length === 0 ? (
                  <div className="bg-white rounded-lg border border-border">
                    <EmptyState
                      onClear={query.trim() ? clearQuery : clearFilters}
                      query={query.trim() || undefined}
                    />
                  </div>
                ) : view === "grid" ? (
                  <GridView
                    clubs={filtered}
                    loading={dataLoading}
                    mobilePromo={
                      <div className="md:hidden">
                        <PromoSlot variant="inline" />
                      </div>
                    }
                  />
                ) : (
                  <ListView
                    clubs={filtered}
                    loading={dataLoading}
                    mobilePromo={
                      <div className="md:hidden">
                        <PromoSlot variant="inline" />
                      </div>
                    }
                  />
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
