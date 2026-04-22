# Carlisle Contractor Portal — Critique To Do List

Issues identified in a full codebase scan on 2026-04-22. Organized by severity.

---

## P0 — Blocking / Fix Immediately

- [x] **`HomeView.vue` — "Start New Job" CTA routes to `/jobs/new`, which doesn't exist.** The link matches the `job-detail` route with `id = 'new'`, showing the "Job not found" error state. Either create a `/jobs/new` route or change the link target. `src/views/HomeView.vue`

- [x] **`NavBar.vue` — Search and Profile icon buttons are 44×44px,** below the 52px minimum tap target required by the design system. Change `h-[44px] w-[44px]` → `h-[52px] w-[52px]` (or `min-h-[52px] min-w-[52px]`). `src/components/shared/NavBar.vue`

- [x] **`JobDetailView.vue` — Back button is `h-[44px]`,** below the 52px minimum. `src/views/JobDetailView.vue`

- [x] **`style.css` is the Vite boilerplate file** with neon purple (`#aa3bff`) as its accent color — a design token explicitly banned in this project. The file is not imported anywhere, but its presence is a risk. Delete it. `src/style.css`

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

- [ ] **`ProductCatalogView.vue` and `VideosView.vue` — Category chip labels are raw data strings** (e.g. `"Membranes"`, `"Installation"`) with no i18n translation key. French and Spanish users see English category names. Add translation keys or document that categories are data-driven.

### Design System — Visual Consistency

- [x] **`StatusBadge.vue` — `'Bid'` and `'Inspection'` share the same amber color.** On the Jobs list, these two distinct statuses are visually indistinguishable. Give `'Inspection'` a different color (e.g. the highlight blue `bg-highlight/90 text-nav`) to differentiate. `src/components/shared/StatusBadge.vue`

- [x] **`RecentlyViewed.vue` — Unicode symbols `⬡` and `⬗` are used as type icons.** These render inconsistently across OS/fonts. Replace with small SVG icons matching the icon language used in the rest of the app. `src/components/home/RecentlyViewed.vue`

- [x] **`GreetingWeather.vue` — Weather condition icon is an emoji (`⛅`).** The rest of the app uses SVG icons exclusively. Use an SVG weather icon or a simple icon-mapping approach. `src/components/home/GreetingWeather.vue`

- [x] **`InspectionResponseForm.vue` — Success state uses `✓` emoji.** Replace with an SVG checkmark consistent with the icon language used elsewhere. `src/components/inspections/InspectionResponseForm.vue`

---

## P3 — Low Priority / Polish

- [ ] **`VideoCard.vue` — Thumbnail `<img>` missing `loading="lazy"`.** All video thumbnails load immediately. Add `loading="lazy"` for performance on slower connections. `src/components/videos/VideoCard.vue`

- [ ] **No page transition animations.** The design system specifies `opacity + translateY` entrances for page navigation, but `<RouterView>` has no `<Transition>` wrapper. Implement subtle entry transitions to add purposeful motion. `src/App.vue`

- [ ] **`main.css` — CSS custom properties defined twice.** The `@theme {}` block generates `--color-*` custom properties automatically in Tailwind v4; the duplicate `:root {}` block is redundant. Remove the redundant `:root {}` block to reduce maintenance surface. `src/assets/main.css`

- [ ] **`InspectionResponseForm.vue` — Success confirmation uses raw `ISO.slice(0, 10)` string** for the submitted date instead of the app's `formatDate` pattern. Use the same formatting for consistency. `src/components/inspections/InspectionResponseForm.vue`

- [ ] **`ProductCard.vue` — Click tracks to "recently viewed" but does not navigate anywhere.** There is no product detail route. This is acceptable for the current demo scope, but the `cursor-pointer` and `active:bg-surface-alt` affordances imply navigation. Either add a product detail view or remove the click affordance. `src/components/products/ProductCard.vue`

- [ ] **`RecentContractors.vue` — No accessible label on contractor buttons** describing their navigation destination. Cards just say the company name. Add a descriptive `aria-label` such as `"View jobs for Rivera Roofing LLC"`. `src/components/home/RecentContractors.vue`

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | 4 | Blocking — broken route, tap targets below minimum, banned orphan file |
| P1 | 9 | High — outdoor mode ineffective, inconsistent headers, bad data binding |
| P2 | 14 | Medium — a11y gaps, duplicated code, localization holes, visual inconsistency |
| P3 | 6 | Low — performance, polish, redundant code |
| **Total** | **33** | |
