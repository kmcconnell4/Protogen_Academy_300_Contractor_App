# Carlisle Contractor Portal — Critique To Do List

Issues identified in a full codebase scan on 2026-04-22. Organized by severity.

> **Round 2 critique added 2026-04-22** — focus on copy consistency, navigation flow, and information architecture. Items are appended to each priority section below.

---

## P0 — Blocking / Fix Immediately

- [x] **`HomeView.vue` — "Start New Job" CTA routes to `/jobs/new`, which doesn't exist.** The link matches the `job-detail` route with `id = 'new'`, showing the "Job not found" error state. Either create a `/jobs/new` route or change the link target. `src/views/HomeView.vue`

- [x] **`NavBar.vue` — Search and Profile icon buttons are 44×44px,** below the 52px minimum tap target required by the design system. Change `h-[44px] w-[44px]` → `h-[52px] w-[52px]` (or `min-h-[52px] min-w-[52px]`). `src/components/shared/NavBar.vue`

- [x] **`JobDetailView.vue` — Back button is `h-[44px]`,** below the 52px minimum. `src/views/JobDetailView.vue`

- [x] **`style.css` is the Vite boilerplate file** with neon purple (`#aa3bff`) as its accent color — a design token explicitly banned in this project. The file is not imported anywhere, but its presence is a risk. Delete it. `src/style.css`

- [x] **`StatusBadge.vue` — Status text is never translated.** `StatusBadge` renders `{{ status }}` — the raw data string — directly. Every user regardless of locale sees English values: "In Progress", "Shipped", "Pending Response", etc. Quote statuses in `QuoteVersionList` are the only ones translated, creating inconsistency. Add a lookup map keyed on `status` that calls `t()` using the `status_*` keys already defined in each locale. `src/components/shared/StatusBadge.vue`

- [x] **`HomeView.vue` — "Start New Job / Quote" CTA copy promises creation, but routes to the jobs list.** The button reads `t('home.cta_new_job')` → `"Start New Job / Quote"` but navigates to `/jobs`. There is no creation flow. The mismatch breaks user trust immediately. Until a `/jobs/new` route exists, change the copy to `"View Jobs"` (or `"Go to Jobs"`) and update the i18n key accordingly. `src/views/HomeView.vue`, `src/locales/en.json`

---

## P1 — High Priority

### Tap Target Violations (Outdoor / Gloved-Hand Failures)

- [x] **`JobsView.vue` — Sort toggle buttons are `h-[34px]`,** well below any minimum. `src/views/JobsView.vue`

- [x] **`JobsView.vue` and `ProductCatalogView.vue` — Status/category filter chips are `h-[40px]`.** Below both the 44px WCAG minimum and the 52px design-system minimum. `src/views/JobsView.vue`, `src/views/ProductCatalogView.vue`

- [x] **`DocumentLibraryView.vue` — Filter chips use `py-1.5` with no fixed height**, making them smaller than the minimum. `src/views/DocumentLibraryView.vue`

- [x] **`RecentlyViewed.vue` — Chip buttons are `h-[40px]`.** Below minimum. `src/components/home/RecentlyViewed.vue`

### Outdoor Mode Ineffectiveness

- [x] **Outdoor Mode doesn't upscale hardcoded height classes.** The feature sets `--tap-target-min: 60px`, but dozens of buttons use Tailwind height utilities (`h-[44px]`, `h-[40px]`, `h-[34px]`) that ignore the CSS variable. The CSS `min-height` rule in `@layer base` only applies to elements that don't already have an explicit height class. Audit all interactive elements and replace fixed `h-[]` with `min-h-[var(--tap-target-min)]` or a Tailwind token equivalent. `src/assets/main.css` + multiple components

### Design System Inconsistencies

- [x] **`DocumentLibraryView.vue` and `VideosView.vue` page headers** use plain `text-xl font-bold` without the Big Shoulders Display font family (`font-family: var(--font-heading)`) and without the section overline label (e.g. "42 DOCUMENTS") used in every other view. Align with the JobsView / ProductCatalogView header pattern. `src/views/DocumentLibraryView.vue`, `src/views/VideosView.vue`

- [x] **`ProfileView.vue` heading** (`<h1 class="text-xl font-bold text-white">`) doesn't use Big Shoulders Display and lacks the overline label. Inconsistent with all other views. `src/views/ProfileView.vue`

### Data / Logic Issues

- [x] **`GreetingWeather.vue` — Contractor first name is hardcoded** as `'Marcus'`. It should pull from the same mock `profile` object used in `ProfileView.vue` (or a shared data source). `src/components/home/GreetingWeather.vue`

- [x] **`RecentContractors.vue` — All contractor cards navigate to `/jobs` without filtering.** Clicking any contractor just shows all jobs. Should pass a contractor identifier so the Jobs view can pre-filter, or navigate to a contractor-scoped job list. `src/components/home/RecentContractors.vue`

- [x] **`JobDetailTabs.vue` — Overview tab shows raw `job.repId`** (an ID string like `"REP-001"`) as the "Assigned Rep" value. Should look up the rep's display name from a data source. `src/components/jobs/JobDetailTabs.vue`

### Dead Buttons — Broken Role Interactions

- [ ] **`HomeView.vue` — "Add Contractor" button (Sales Rep view) has no `@click` handler.** The `v-else` CTA for reps is a raw `<button>` that does nothing when tapped. Never ship an interactive element that produces no response. Either wire a handler, add `title="Coming soon"` + a disabled state, or remove the button entirely. `src/views/HomeView.vue`

- [ ] **`InspectionCard.vue` — "Mark as Reviewed" button (rep view) has no `@click` handler.** The most critical rep workflow in the inspections flow — marking an inspection reviewed after reading the contractor's response — is a full-width blue button with no action attached. Wire a handler that sets `inspection.status = 'Reviewed'` locally and hides the button. `src/components/inspections/InspectionCard.vue`

- [ ] **`QuoteVersionList.vue` — "Approve Quote" and "Reject Quote" buttons have no `@click` handlers.** Both rep-facing action buttons render with no event binding. Tapping either does nothing. Wire handlers that update `quote.status` to `'Approved'` or `'Rejected'` respectively, matching the visual feedback pattern used elsewhere. `src/components/quotes/QuoteVersionList.vue`

### Navigation / Deep-Link Failures

- [ ] **`SearchOverlay.vue` + `ProductCatalogView.vue` — Searching a product and tapping the result lands on an unfiltered catalog.** `SearchOverlay` routes to `{ name: 'catalog', query: { product: item.id } }` but `ProductCatalogView` never reads `route.query.product`. The user finds "WeatherBond TPO" in search and arrives at the full product list with no scroll position, filtering, or highlight. Read the `?product` query param in `ProductCatalogView` and auto-apply it as the search term or scroll to the card. `src/components/search/SearchOverlay.vue`, `src/views/ProductCatalogView.vue`

- [ ] **`SearchOverlay.vue` — Document and video search results route to the list root, not to the specific item.** Tapping a document result opens the Document Library top-of-page; tapping a video result opens the Videos list top-of-page. Pass a `?search=` query param from the search result and pre-populate the filter in `DocumentLibraryView` and `VideosView` on arrival. `src/components/search/SearchOverlay.vue`

- [ ] **Alert cards don't deep-link to the relevant job detail tab.** All alert routes are `{ name: 'job-detail', params: { id } }`. An inspection alert should open the Inspections tab; a quote alert the Quotes tab. Instead, all alerts land on the Overview tab, requiring the user to tap again. Pass `query: { tab: 'inspections' }` (or `'quotes'`) from the alert card and read it in `JobDetailTabs` to set `activeTab` on mount. `src/components/home/AlertCards.vue`, `src/components/jobs/JobDetailTabs.vue`

- [ ] **`BottomNav.vue` — Home route incorrectly activates the Jobs tab.** `isActive` treats `route.name === 'home'` as a match for the Jobs tab, so the Jobs tab glows blue when the user is on the home screen. Tapping Jobs then appears to do nothing (it navigates to `/jobs` which looks like "still Jobs"). Remove the `home === jobs` coupling. If no Home tab exists, leave all tabs inactive while on Home. `src/components/shared/BottomNav.vue`

- [ ] **No Home tab in BottomNav — Home is only reachable by tapping the logo.** The Home route (`/`) has no bottom-nav representation. Reaching Home requires tapping the "Carlisle" text logo in the top bar — a convention that isn't universal and has no visual indicator (there is no house icon, no underline affordance). Add a Home tab as the first bottom-nav item (house icon + "Home" label), or replace the least-used existing tab. `src/components/shared/BottomNav.vue`

- [ ] **`JobDetailView.vue` — `router.back()` fails on direct URL entry or shared links.** If a user opens `/jobs/job-001` directly (bookmark, share link), `window.history` has no prior entry and `router.back()` exits the app. Guard with `window.history.state?.back ? router.back() : router.push({ name: 'jobs' })`. `src/views/JobDetailView.vue`

- [ ] **`InspectionResponseForm.vue` — Submitted state resets on accordion collapse and re-expand.** After a contractor submits a response, collapsing and re-expanding the `InspectionCard` destroys and remounts the form, resetting `submitted = true`. The confirmed response appears as an empty textarea again. Lift the submitted state to `InspectionCard` (emit `submitted` event) or persist it to `localStorage` keyed by `inspection.id`. `src/components/inspections/InspectionResponseForm.vue`, `src/components/inspections/InspectionCard.vue`

### Component Consistency

- [ ] **`QuoteVersionList.vue` — Local `statusConfig` map and inline badge `<span>`s duplicate `StatusBadge`.** The component defines its own color map and renders status badges as hand-coded `<span>` elements — bypassing the shared `<StatusBadge>` component entirely. Replace with `<StatusBadge :status="quote.status" />`. `src/components/quotes/QuoteVersionList.vue`

- [ ] **Doc type badges styled differently in `DocumentCard.vue` vs `ProductCard.vue`.** A PDS badge on a document card is solid blue (`bg-interactive text-white`); on a product card it's a muted chip (`bg-interactive/20 text-highlight`). Same data type, two completely different visual treatments. Extract a shared `DocTypeBadge` component or constant and use it in both locations. `src/components/documents/DocumentCard.vue`, `src/components/products/ProductCard.vue`

---

## P2 — Medium Priority

### Accessibility

- [x] **`SearchOverlay.vue` — No focus trap.** When the overlay is open, pressing Tab cycles through all interactive elements behind it (bottom nav, job cards, etc.) instead of being contained within the dialog. Implement a focus trap (e.g. `focus-trap` library or manual `keydown` handling). `src/components/search/SearchOverlay.vue`

- [x] **`InspectionCard.vue`, `OrderList.vue`, `QuoteVersionList.vue` — Expand/collapse buttons missing `aria-expanded`.** Screen readers cannot announce the toggle state. Add `:aria-expanded="isExpanded"` (or `expandedId === item.id`) to each trigger button.

- [x] **`DocumentLibraryView.vue` — Product filter `<select>` has no `<label>`.** Add a visually hidden `<label for="product-filter">` or use `aria-label`. `src/views/DocumentLibraryView.vue`

- [x] **`ProductCatalogView.vue` — Search input missing `aria-label`.** The field is only identified by its placeholder. Add `aria-label` or a visually hidden `<label>`. `src/views/ProductCatalogView.vue`

- [x] **`ProfileView.vue` — Language `<select>` missing `aria-label`.** Add `aria-label` or associate a `<label>`. `src/views/ProfileView.vue`

- [x] **`NavBar.vue` — Home/brand button missing `aria-label`.** The button text "Carlisle" doesn't communicate its action (navigate home). Add `aria-label="Go to home"` or equivalent i18n key. `src/components/shared/NavBar.vue`

- [x] **`InspectionResponseForm.vue` — `<textarea>` missing `id` and associated `<label>`.** The response textarea is only identified by its placeholder. Add a visually hidden label. `src/components/inspections/InspectionResponseForm.vue`

### Code Quality / DRY

- [x] **`formatDate` is duplicated in 6+ files.** Identical function appears in `JobCard.vue`, `JobDetailView.vue` (inline), `JobDetailTabs.vue`, `OrderList.vue`, `QuoteVersionList.vue`, and `InspectionCard.vue`. Extract to a shared composable `src/composables/useFormatDate.js`.

- [x] **Status badge styles are manually duplicated in `InspectionCard.vue` and `OrderList.vue`** instead of using the shared `<StatusBadge>` component. Both define their own `statusConfig` objects. Use `<StatusBadge :status="..." />` to stay in sync with the central color map.

- [x] **`formatDate` calls hardcode `'en-US'` locale.** For Spanish/French/Portuguese users, dates (e.g. "Apr 5, 2025") should respect the active i18n locale. Pass `useI18n().locale.value` to `Intl.DateTimeFormat`.

- [x] **`useOutdoorMode.js` — Module-level DOM side effect.** The line `document.body.classList.add('outdoor-mode')` runs at import time outside any composable function. Wrap it in a guard: `if (typeof document !== 'undefined')` or move initial sync into the exported function. `src/composables/useOutdoorMode.js`

### Localization Gaps

- [x] **`ProductCatalogView.vue` and `VideosView.vue` — Category chip labels are raw data strings** (e.g. `"Membranes"`, `"Installation"`) with no i18n translation key. French and Spanish users see English category names. Add translation keys or document that categories are data-driven.

### Design System — Visual Consistency

- [x] **`StatusBadge.vue` — `'Bid'` and `'Inspection'` share the same amber color.** On the Jobs list, these two distinct statuses are visually indistinguishable. Give `'Inspection'` a different color (e.g. the highlight blue `bg-highlight/90 text-nav`) to differentiate. `src/components/shared/StatusBadge.vue`

- [x] **`RecentlyViewed.vue` — Unicode symbols `⬡` and `⬗` are used as type icons.** These render inconsistently across OS/fonts. Replace with small SVG icons matching the icon language used in the rest of the app. `src/components/home/RecentlyViewed.vue`

- [x] **`GreetingWeather.vue` — Weather condition icon is an emoji (`⛅`).** The rest of the app uses SVG icons exclusively. Use an SVG weather icon or a simple icon-mapping approach. `src/components/home/GreetingWeather.vue`

- [x] **`InspectionResponseForm.vue` — Success state uses `✓` emoji.** Replace with an SVG checkmark consistent with the icon language used elsewhere. `src/components/inspections/InspectionResponseForm.vue`

### Copy Consistency

- [ ] **Navigation label "Catalog" conflicts with page heading "Product Catalog".** `nav.catalog` → `"Catalog"` (BottomNav), `catalog.title` → `"Product Catalog"` (page heading + SearchOverlay Quick Jumps). The same destination has two names across the app. Align to a single canonical label across all three locations. `src/components/shared/BottomNav.vue`, `src/views/ProductCatalogView.vue`, `src/components/search/SearchOverlay.vue`

- [ ] **Navigation label "Docs" conflicts with page heading "Document Library".** BottomNav and QuickAccess use `"Docs"`; the page heading and SearchOverlay quick-jump use `"Document Library"`. Users who reach the library via search see a different name than the tab they used. Standardize to `"Documents"` everywhere. `src/components/shared/BottomNav.vue`, `src/locales/en.json`

- [ ] **Navigation label "Videos" conflicts with page heading "Training Videos".** BottomNav shows `"Videos"`, page heading shows `"Training Videos"`. Pick one and apply it consistently. `src/components/shared/BottomNav.vue`, `src/views/VideosView.vue`

- [ ] **`jobs.sort_updated` i18n key is reused as a detail-row field label.** `JobDetailTabs` uses `t('jobs.sort_updated')` → `"Last Updated"` as an Overview field label. This couples a sort-control label to a data display label — changing one would silently mutate the other. Add a dedicated `jobs.detail_updated: "Last Updated"` key. `src/components/jobs/JobDetailTabs.vue`, `src/locales/en.json`

- [ ] **`home.section_recent_contractors` label is factually wrong.** The section renders as `"Recently Viewed Contractors"` but shows ALL contractors sorted by `lastActivity` — there is no "recently viewed" filtering. Change to `"Your Contractors"` or `"Active Contractors"` to match what is actually displayed. `src/components/home/RecentContractors.vue`, `src/locales/en.json`

- [ ] **`"Inspection"` job status reads as a type, not a state.** All other status values (`"In Progress"`, `"Warranty"`, `"Closed"`) describe a job's current state. `"Inspection"` reads as a job type. Rename the data value and all references to `"Under Inspection"` or `"Awaiting Inspection"`. `src/data/jobs.json`, `src/components/shared/StatusBadge.vue`

- [ ] **`home.open_job` CTA uses file-cabinet language; trailing `→` is a Unicode character.** `"Open Job →"` — field contractors open files; they *view* or *continue* jobs. Change copy to `"View Job"`. Replace the raw `→` with a small inline SVG chevron matching the icon pattern used elsewhere. `src/locales/en.json`, `src/components/home/RecentJobCard.vue`

### Empty States & Copy Clarity

- [ ] **`jobs.no_jobs` is identical for "filter empty" and "truly empty" states.** `"No jobs found."` shows when a status filter returns no results. The user has no way to know whether filtering is the cause. Add `jobs.no_jobs_filtered: "No jobs match this filter."` and conditionally use it when `activeFilter !== 'All'`. `src/views/JobsView.vue`, `src/locales/en.json`

- [ ] **Empty states on catalog, documents, and videos views give no actionable guidance.** `"No products found."`, `"No documents found."`, `"No videos found."` tell users what isn't there but not what to do (clear search, change filter). When a search or filter is active, append a `"Try clearing the filter"` inline CTA or `"No results for "{query}". Try a different search."` `src/views/ProductCatalogView.vue`, `src/views/DocumentLibraryView.vue`, `src/views/VideosView.vue`

- [ ] **`InspectionResponseForm.vue` — Success confirmation reuses the timestamp i18n key.** The submitted confirmation renders via `t('inspections.response_submitted', { date })`. This key is also used as a field-label for existing responses, so both the confirmation message and the "submitted on" label use the same string. Add a distinct `inspections.response_submitted_confirmation: "Response submitted. Your Carlisle rep will review it shortly."` key and use it only in the success state. `src/components/inspections/InspectionResponseForm.vue`, `src/locales/en.json`

- [ ] **Job detail back button unconditionally reads `"Jobs"`** regardless of the user's entry point. A user who tapped "View Job" from the Home screen still sees "Jobs" in the back button. Functional navigation is correct (it uses `router.back()`), but the label is misleading. Use `t('common.back')` → `"Back"` as a generic fallback, or derive the label from router history metadata. `src/views/JobDetailView.vue`

- [ ] **Jobs empty state doesn't acknowledge an active contractor filter.** When arriving via `?contractor=contractor-003` and that contractor has no jobs, the filter banner and `"No jobs found."` appear together with no explanation. Render `"No jobs found for {contractorName}."` when `contractorId` is set and results are empty, with a prominent "Show All Jobs" clear button. `src/views/JobsView.vue`

### Information Architecture

- [ ] **Profile page is not reachable from BottomNav — only via the header icon.** Profile is in the router but has no bottom-nav tab. Thumb-reachable bottom navigation is the primary interaction zone for field use. The person icon in the top header has no text label and no affordance indicating it leads to a settings/profile page. Add Profile to BottomNav or restructure the 5 navigation destinations to include it. `src/components/shared/BottomNav.vue`

- [ ] **Orders and inspections are not indexed in search.** `useSearch.js` indexes jobs, products, quotes, documents, and videos. Orders (searchable by PO number or carrier) and inspections (searchable by type or status) are invisible to search. A contractor trying to find a shipment by typing "PO-2026-0041" gets no results. Add both data types to the search index. `src/composables/useSearch.js`

- [ ] **Tracking numbers in `OrderList.vue` are plain text, not carrier links.** Carrier tracking numbers appear in a `<span class="font-mono">`. Universal field convention is that tracking numbers are tappable links to the carrier's tracking page. Wrap in `<a :href="trackingUrl(order)" target="_blank" rel="noopener">` and construct the URL from the order's `carrier` field (UPS, FedEx, etc.). `src/components/orders/OrderList.vue`

- [ ] **Three different accordion expand behaviors for structurally identical card types.** `OrderList` and `QuoteVersionList` use a shared `expandedId` ref (one open at a time). `InspectionCard` uses a per-instance `isExpanded` ref (all can be open simultaneously). All three live in the same job detail view and are visually indistinguishable. Standardize on the `expandedId` pattern (one open at a time) for all three. `src/components/orders/OrderList.vue`, `src/components/quotes/QuoteVersionList.vue`, `src/components/inspections/InspectionCard.vue`

- [ ] **"Job not found" state uses `text-error` (red).** `text-error` (`#FF4C4C`) is reserved for destructive/failure states per the design system. A missing job is an absence, not an error — red signals urgency and irreversibility that isn't warranted here. Change to `text-text-secondary`. Add a `"Go to Jobs"` router-link button below the message. `src/views/JobDetailView.vue`

- [ ] **`RecentContractors.vue` has no empty state.** If `contractors.json` is empty (or a future API returns none), the section renders a blank horizontal scroll container with no message. Add a `v-if="contractorsWithStats.length"` guard with a matching `v-else` empty state. `src/components/home/RecentContractors.vue`

- [ ] **Section label typography varies between `ProfileView` and all other views.** Other views use `text-[11px] font-bold uppercase tracking-[0.12em]`; `ProfileView` uses `text-xs font-bold uppercase tracking-widest`. `text-xs` = 12px vs 11px; `tracking-widest` = 0.1em vs 0.12em. Visually close but expressed through different Tailwind utilities, making global changes error-prone. Extract a `section-label` CSS utility class and apply it everywhere. `src/assets/main.css`, `src/views/ProfileView.vue`

---

## P3 — Low Priority / Polish

- [x] **`VideoCard.vue` — Thumbnail `<img>` missing `loading="lazy"`.** All video thumbnails load immediately. Add `loading="lazy"` for performance on slower connections. `src/components/videos/VideoCard.vue`

- [x] **No page transition animations.** The design system specifies `opacity + translateY` entrances for page navigation, but `<RouterView>` has no `<Transition>` wrapper. Implement subtle entry transitions to add purposeful motion. `src/App.vue`

- [x] **`main.css` — CSS custom properties defined twice.** The `@theme {}` block generates `--color-*` custom properties automatically in Tailwind v4; the duplicate `:root {}` block is redundant. Remove the redundant `:root {}` block to reduce maintenance surface. `src/assets/main.css`

- [x] **`InspectionResponseForm.vue` — Success confirmation uses raw `ISO.slice(0, 10)` string** for the submitted date instead of the app's `formatDate` pattern. Use the same formatting for consistency. `src/components/inspections/InspectionResponseForm.vue`

- [x] **`ProductCard.vue` — Click tracks to "recently viewed" but does not navigate anywhere.** There is no product detail route. This is acceptable for the current demo scope, but the `cursor-pointer` and `active:bg-surface-alt` affordances imply navigation. Either add a product detail view or remove the click affordance. `src/components/products/ProductCard.vue`

- [x] **`RecentContractors.vue` — No accessible label on contractor buttons** describing their navigation destination. Cards just say the company name. Add a descriptive `aria-label` such as `"View jobs for Rivera Roofing LLC"`. `src/components/home/RecentContractors.vue`

- [ ] **Dead i18n keys: `home.greeting_morning/afternoon/evening` never used.** `en.json` (and all other locales) define `greeting_morning`, `greeting_afternoon`, and `greeting_evening` with `{name}` interpolation, but `GreetingWeather` uses `home.greeting_label_*` variants instead. Remove the unused keys from all 4 locale files. `src/locales/en.json`, `src/locales/es.json`, `src/locales/fr.json`, `src/locales/pt.json`

- [ ] **Dead i18n keys: `documents.filter_pds`, `filter_sds`, `filter_spec` never referenced.** `DocumentLibraryView` renders raw type strings (falling back to the data value) and never calls these keys. Either use them in the template (`t('documents.filter_' + type.toLowerCase())`) or remove them from all locales. `src/views/DocumentLibraryView.vue`, `src/locales/en.json`

- [ ] **Duplicate / conflicting i18n keys: `videos.filter_*` and `videos.categories.*` cover the same data.** After the P2 fix, `videos.categories.*` is now used by the template. The older `videos.filter_installation`, `filter_warranty`, `filter_detailing`, `filter_admin`, `filter_training` keys are dead. Remove the `filter_*` keys from all 4 locales to eliminate ambiguity. `src/locales/en.json`, `src/locales/es.json`, `src/locales/fr.json`, `src/locales/pt.json`

- [ ] **`VideoCard.vue` and `DocumentCard.vue` CTAs use raw Unicode glyphs.** `VideoCard` renders `▶ {{ t('videos.watch') }}`, `DocumentCard` renders `↓ {{ t('documents.download') }}`. These raw characters render at different sizes and weights across browsers and cannot be styled independently. Replace both with inline SVG icons sized `w-4 h-4`, matching every other interactive element in the codebase. `src/components/videos/VideoCard.vue`, `src/components/documents/DocumentCard.vue`

- [ ] **`InspectionCard.vue` — `inspection.repName` renders with no null fallback.** If `repName` is absent or null, the card renders `"Conducted Apr 22 ·"` with a trailing middot and nothing after it. Add `|| t('common.unknown_rep')` → `"Unknown Rep"` as fallback. `src/components/inspections/InspectionCard.vue`

- [ ] **`AlertCards.vue` — Section disappears entirely when there are no alerts.** When `alerts.length === 0`, the component is hidden with `v-if`, creating a visual jump from the greeting directly to "Continue Where You Left Off". A contractor who previously had alerts and cleared them will be confused by the sudden absence. Show a minimal "You're all caught up" one-liner, or keep the section header with a green status indicator. `src/components/home/AlertCards.vue`

- [ ] **`GreetingWeather.vue` — Weather city is hardcoded as `"Cincinnati, OH"`.** Every user in every locale always sees Cincinnati, OH. The weather widget should derive the city from the contractor's most recent active job address, with a guard so it only renders when a city can be determined. `src/components/home/GreetingWeather.vue`

- [ ] **`inspections.finding_resolved` i18n key bakes a Unicode `✓` into the string.** `finding_resolved: "✓ Resolved"` stores a presentation character inside an i18n string. The checkmark cannot be styled independently and renders differently across fonts. Change the value to `"Resolved"` and render the checkmark as an inline SVG at the call site, matching the pattern in `InspectionResponseForm`. `src/locales/en.json`, `src/components/inspections/InspectionCard.vue`

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | 4 (+2) | Blocking — broken route, tap targets below minimum, banned orphan file; + untranslated status badges, misleading home CTA |
| P1 | 9 (+11) | High — outdoor mode, headers, data binding; + dead buttons, broken search deep-links, alert tab routing, bottom-nav home, response reset |
| P2 | 14 (+17) | Medium — a11y, DRY, localization, visual consistency; + copy naming conflicts, empty states, IA, accordion consistency |
| P3 | 6 (+9) | Low — performance, polish, redundant code; + dead i18n keys, Unicode icons, missing fallbacks |
| **Total** | **33 → 72** | |
