# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **bun** (see `bun.lockb`). npm scripts run fine, but `bun install` is the install path.

- `bun run dev` — Vite dev server on port **8080** (HMR overlay disabled).
- `bun run build` / `bun run build:dev` — production / development-mode build.
- `bun run lint` — ESLint over the project.
- `bun run test` — Vitest single run. `bun run test:watch` for watch mode.
- Run a single test: `bunx vitest run src/path/to/file.test.ts` (or `-t "name"` to filter by test name).
- `bun run scripts/generate-sitemap.ts` — regenerates `public/sitemap.xml` from `LATAM_COUNTRIES` + a hardcoded GEO map (the GEO map is currently a demo dataset, not pulled from Directus).

`.env` must define `VITE_DIRECTUS_URL` — `src/lib/directus.ts` throws at import time if missing, which crashes the whole app.

## Architecture

**Stack:** Vite + React 18 + TypeScript + React Router v6 + TanStack Query + react-helmet-async + Tailwind + shadcn/ui (Radix). Data layer is **Directus** via `@directus/sdk` over REST. There is no backend in this repo — Directus is the CMS/API.

### Data flow: Directus → queries → hooks → pages

1. `src/lib/directus.ts` creates the singleton `directus` client and exposes `assetUrl(fileId, params?)` for image URLs (with width/height/fit/quality transforms).
2. `src/lib/directus-types.ts` defines the schema (`HayCanchaSchema`) and entity types (`Pais`, `Ciudad`, `Barrio`, `Club`, `ClubDeporte`, `Deporte`, `ClubPendingSubmission`). It also defines the **projection types** that match what queries actually return: `ClubCard` (list view) and `ClubFull` (detail view, with relations expanded). Use these — they capture the difference between "id reference" and "expanded object."
3. `src/lib/queries.ts` wraps `readItems` / `aggregate` calls. The Directus SDK's generated field types are too strict for nested expansion, so `readItems` and `aggregate` are cast to `any` at the top of the file and return values are cast back to `ClubCard[]` / `ClubFull`. Follow this pattern when adding queries — don't fight the SDK types.
4. `src/hooks/useClubes.ts` wraps every query in `useQuery` with stable `queryKey`s (`["clubes", "barrio", slug]`, etc.) and per-query stale times. Pages consume hooks, not raw queries.
5. `QueryClient` is configured in `src/main.tsx` (5min staleTime default, no refetch-on-focus, retry 1).

### Sport-club junction is the source of truth for sport classification

Clubs ↔ deportes is a many-to-many through `clubes_deportes`. Filtering by sport goes through the junction (`fetchClubesByDeporte` / `fetchClubesByDeportes`) — clubs do not have a direct sport field. Each junction row has `es_primario`; `getPrimarySportSlug` in `src/lib/queries.ts` is the canonical way to pick a club's primary sport (use the `es_primario` flag, **not** a hardcoded sport priority — this was a recent fix).

### Submissions ("Agregá tu cancha")

`src/lib/submissions.ts` posts to the `clubes_pending` collection. **The endpoint returns 204 No Content on success** — don't expect the SDK to return a created row. There are forbidden fields (`estado`, `club_creado`, `ip_remitente`, `notas_admin`, `procesado_at`) that the API rejects with 403. The function maps 422 errors back to per-field messages.

### Routing & SEO

Routes are declared in `src/App.tsx`. The geo URL hierarchy is `/canchas/:pais/:ciudad/:barrio/:slug` — all four params are slugs, and the same `SearchPage` component handles every level above the detail page. Sport landing pages (`/tenis`, `/padel`, `/pickleball`) all render `SportLandingPage` driven by `src/lib/sports.ts`'s `SPORTS` config — adding a new sport means adding a key there + a route.

`src/lib/geo.ts` owns slug ↔ display-name mapping for LATAM countries and a generic ASCII slugifier (`toSlug`). Use these for any country-name handling — accents and `ñ` need to round-trip correctly.

`SeoMeta` (in `src/components/`) wraps `react-helmet-async` and is the canonical way to set per-page `<title>`, OG, and canonical tags. Use it once per route.

### Sport theming via Tailwind

Sport accent colors (`yellow`, `celeste`, `lime`) are dynamic — class names are built from `SportConfig.color`. Tailwind would tree-shake these, so they're explicitly listed in the `safelist` in `tailwind.config.ts`. If you add a new sport color, add the matching `bg-/text-/border-/border-l-/hover:border-` classes to the safelist or they'll be purged in production.

Brand fonts: `font-display` = Barlow Condensed (uppercase headings), `font-body`/`font-sans` = Inter.

### TS config quirks

`tsconfig.json` runs with `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`, and `strictNullChecks` all **off**. Don't be surprised by code that relies on this (e.g. nullable fields used without narrowing). ESLint also has `@typescript-eslint/no-unused-vars` disabled.

### Path alias

`@/` → `src/` (configured in `vite.config.ts`, `vitest.config.ts`, and `tsconfig.json`). Use it for all imports.

### Tests

Vitest + jsdom + Testing Library. Setup is `src/test/setup.ts` (registers `@testing-library/jest-dom` + a `matchMedia` polyfill). Test files live alongside source: `src/**/*.{test,spec}.{ts,tsx}`.
