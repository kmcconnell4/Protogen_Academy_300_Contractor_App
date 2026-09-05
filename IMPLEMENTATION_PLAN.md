# IMPLEMENTATION_PLAN.md — Ridgeline Contractor Portal

Phased build checklist for the P303 mobile experience.

**How to use this file (AI):** Work top-to-bottom within a phase. Complete one phase before starting the next unless a phase is explicitly marked parallel-safe. When a task is genuinely done and working, change its checkbox from `- [ ]` to `- [x]` and commit with a descriptive message. Do **not** check a box until the task actually works — verify in the browser, not just by reading the diff. See `context/decisions.md` for the *why* behind non-obvious calls; this file tracks the *what* and *done/not done*.

---

## Phase 0 — Original Scaffolding Prompts

The literal Copilot prompting sequence used to scaffold the project, in order. Two are marked superseded rather than rewritten — the prompt is a historical record of what was actually asked, not a live spec.

- [x] *"Scaffold a Vue 3 + Vite project with Tailwind CSS and vue-i18n. Create the folder structure above and stub out all JSON data files with realistic mock data for a roofing contractor app. Extend tailwind.config.js with these custom color tokens: brand: #164da6, interactive: #2E6FD8, highlight: #5B9BF0, bg: #151C28, surface: #1E2A3E, surface-alt: #243044, nav: #0F1520, amber: #F5A623, emerald: #4ACA6E, error: #FF4C4C, text-secondary: #A8B8D0, border: #2E3A52. Define them as CSS custom properties in main.css as well."*
- [x] *"Build the HomeView for a contractor using Tailwind CSS. It should include: a greeting with a weather widget tied to the most recent job's location, horizontally swipeable alert cards for pending actions, a large recent job card with an 'Open Job' CTA, a horizontally scrollable recently viewed row, two large quick-access cards for Documents and Videos, and a full-width 'Start New Job' button in Interactive Blue (#2E6FD8). Use a dark navy-black background (#151C28), blue-tinted dark card surfaces (#1E2A3E), white primary text, and amber (#F5A623) for alerts. Mobile-first, minimum 52px tap targets, high contrast for outdoor readability."*
- [x] *"Build the JobsView with a filterable list of jobs using `jobs.json`. Each job card should show name, address, status badge, and last updated date."*
- [x] *"Build the JobDetailView with four tabs: Overview, Quotes, Orders, Inspections. Each tab loads related data by matching the jobId from the route params. The Quotes tab should support multiple versioned quotes (v1, v2). The Orders tab should link to the product detail page."*
- [x] *"Build the ProductCatalogView using `products.json`. Each product card shows name, SKU, category, and links to its associated documents (PDS, SDS, Spec) from `documents.json`."* — **superseded:** this view was later deleted as dead code (Phase 13) and rebuilt from scratch as `CatalogView.vue` with two-tier category filtering (Phase 14).
- [x] *"Add a universal search overlay component triggered from the top nav. It should search across jobs, products, quotes, documents, and videos from their JSON files and group results by category. On mobile, render as a full-screen overlay."*
- [x] *"Implement vue-i18n with locale files for English, Spanish, French, and Portuguese. Replace all hardcoded UI strings in every component with translation keys. Add a language selector dropdown to ProfileView.vue. Persist the choice in localStorage."*
- [x] *"Implement the RoleSwitcher using Vue's provide/inject. When toggled to Sales Rep, the HomeView should show alerts across all contractors, replace the recent job card with recently viewed contractors, and change the CTA to 'Add Contractor'."* — **superseded:** the entire role switcher and every rep-facing view were removed in Phase 13 to keep the demo scoped to the single contractor journey.
- [x] *"Add an Outdoor Mode toggle to ProfileView.vue. When enabled, it should: add an 'outdoor-mode' class to the document body, increase all base font sizes by one step, increase all tap targets by 8px, shift secondary text from #A8B8D0 to #FFFFFF, and disable non-essential CSS transitions. Persist the preference in localStorage via a useOutdoorMode.js composable."*

---

## Phase 1 — Reactive Data Layer *(prerequisite for Phases 5, 7, 8)*

- [x] `useJobsData.js` — module-level `ref([...jobsJson])` singleton (`jobs`, `addJob`, `jobById`)
- [x] `useQuotesData.js` — `quotes`, `addQuote`, `quotesByJobId`, `finalizeQuoteAsOrder`
- [x] `useOrdersData.js` — `orders`, `addOrder`, `ordersByJobId`
- [x] `useSearch.js` reads from the three composables above so new records appear in search immediately

## Phase 2 — Navigation Restructure

- [x] Removed old top `NavBar`, added `CreateJobFab`
- [x] `BottomNav` rebuilt for Home · Jobs · Search · Videos · Profile (later revised in Phase 12)
- [x] Router: added `/search`, `/jobs/new`, `/catalog/:id`, `/jobs/:id/quotes/new`; `/catalog` and `/documents` redirected to `/search` (superseded in Phase 14)

## Phase 3 — SearchView

- [x] `SearchView.vue` at `/search`, autofocus, `ROUTE_MAP` per entity type
- [x] Deleted dead `SearchOverlay.vue`

## Phase 4 — Product Detail Page

- [x] `ProductDetailView.vue` at `/catalog/:id` — hero, description, related docs/videos, installation notes
- [x] `ProductCard.vue` routes via `router-link` to `product-detail`

## Phase 5 — FAB + Create Job *(depends on Phase 1)*

- [x] `CreateJobFab.vue` — floating "+" button, routes to `create-job`
- [x] `CreateJobView.vue` — form (name, address, type, sq ft), calls `useJobsData().addJob()`

## Phase 6 — Map / Directions on Job Detail

- [x] `JobDetailView.vue` — address links to Google Maps directions

## Phase 7 — Add Quote from Job Detail *(depends on Phase 1)*

- [x] "Add Quote" button on the Quotes tab, routes to `create-quote`
- [x] `CreateQuoteView.vue` — line item builder, subtotal/tax/total, `useQuotesData().addQuote()`

## Phase 8 — Finalize Quote → Order *(depends on Phases 1 + 7)*

- [x] "Place Order" CTA on approved quotes → `finalizeQuoteAsOrder()` creates an order stub and links it to the job

## Phase 9 — Per-Finding Inspection Responses

- [x] `InspectionCard.vue` — per-finding response textarea, photo affordance, resolved toggle, single Submit button
- [x] Refactored `InspectionResponseForm.vue` → `InspectionFindingResponse.vue`

## Phase 10 — Library Hub Page

- [x] `featured: true` added to 3 products, 3 documents, 3 videos
- [x] `RecentlyViewed.vue`/`VideoCard.vue` log video views
- [x] `LibraryView.vue` at `/library` — Featured Products / Documents / Videos sections with "See All" links
- [x] `BottomNav` — Library tab replaces Videos tab (active on both `library` and `videos` routes)

## Phase 11 — Library Card Polish

- [x] `DocumentCard` fully tappable, download button removed
- [x] `ProductCard` tap feedback matches `VideoCard`
- [x] Consistent card heights across Library's three sections
- [x] Card name typography normalized
- [x] Product horizontal-scroll peek improved

## Phase 12 — Floating Search Bar + Voice Search

- [x] `FloatingSearchBar.vue` — persistent pill above `BottomNav`, mic button (Web Speech API, hidden if unsupported)
- [x] `BottomNav` reduced to 4 tabs (Home · Jobs · Library · Profile); FAB repositioned to clear the bar
- [x] Page bottom padding updated app-wide (`pb-24` → `pb-36`)

## Phase 13 — Rubric Pass: Rebrand, Role Removal, Desktop Nav, Password Gate, Bugfixes

Driven by a P303 rubric review against the Protogen case-study guide.

- [x] Removed the Contractor/Sales Rep role switcher entirely (`useRole.js`, `RoleSwitcher.vue`, dead `NavBar.vue`/`SearchOverlay.vue`, `RecentContractors.vue`, `contractors.json` all deleted; every `role === ...` conditional stripped)
- [x] Rebranded off Carlisle to a fictional manufacturer, Ridgeline — app copy, all data files, all 4 locales, docs, and every real trademarked product name (WeatherBond, Sure-Seal, FleeceBACK, CavGard, SecurTAPE, Sure-Grip, FlashBand) replaced with generic descriptors; SKUs de-branded; `localStorage` keys renamed `carlisle_*` → `ridgeline_*`
- [x] Fixed the Create Job bug: `JobsView`/`JobDetailView`/`HomeView`/`AlertCards`/`RecentJobCard`/`GreetingWeather` were reading static `jobs.json` instead of the reactive `useJobsData()` singleton, so new jobs never appeared outside Search
- [x] Fixed a crash on newly created jobs with blank Square Footage (`null.toLocaleString()`)
- [x] Fixed a stale-page bug in client-side route transitions (missing `:key` on `<RouterView>`'s dynamic component)
- [x] Built the desktop left sidebar nav (`SidebarNav.vue`, `md:` breakpoint) that the brief had always specified but was never implemented
- [x] Added a password gate (`PasswordGate.vue`) wrapping the whole app
- [x] Generated SVG product illustrations (`public/products/*.svg`) replacing `placehold.co` boxes
- [x] Wrote a real README, added LICENSE (MIT), removed starter cruft, added a proper favicon

## Phase 14 — Catalog & Documents browse pages, doc preview art, doc restructuring

- [x] `CatalogView.vue` at `/catalog` — search + two-tier group/category filters (Membranes groups TPO + EPDM; all other groups map 1:1 to their existing category)
- [x] `DocumentsView.vue` at `/documents` — search + type filter chips (PDS/SDS/Spec) + product filter dropdown
- [x] Router: replaced the `/catalog`/`/documents` redirect-to-search routes with the two real views above
- [x] Generated 19 unique SVG "fake PDF" preview thumbnails (`public/documents/*.svg`), added `previewUrl` to every `documents.json` entry, wired into `DocumentCard.vue`
- [x] Fixed `RecentlyViewed.vue`/`DocumentCard.vue` so a recently-viewed document reopens the actual file (`fileUrl`) instead of landing on the generic Documents list — same pattern as videos
- [x] Fixed `SearchView.vue`'s `ROUTE_MAP.documents` referencing a nonexistent `item.url` instead of `item.fileUrl`
- [x] Added `catalog.groups.Membranes` i18n key (4 locales) and backfilled a missing `pt.documents.search_placeholder`
- [x] Deleted dead `InspectionResponseForm.vue` (superseded in Phase 9, never removed) and renamed its leftover `carlisle_inspection_resp_*`/`carlisle_recently_viewed` storage keys
- [x] Updated `BRIEF.md` §6/§7/§11 to describe the real browse pages instead of "redirects to Search"
- [x] Migrated `memory_bank/TODO.md` into this file and `memory_bank/decisions.md`; deleted `TODO.md`
- [x] Renamed `memory_bank/` to `context/` and moved `BRIEF.md` to the repo root, matching the Charlotte project's exact structure; updated every stale reference across `README.md`, `IMPLEMENTATION_PLAN.md`, and `BRIEF.md`

---

## Ideas (not scheduled)

- Map view (similar to Yelp) with a button to get directions
- Notification center intro on the home page
- In-app PDF preview (currently: generated static preview image + opens the real file in a new tab)
