# Carlisle Contractor Portal — To Do

Updated 2026-04-22. All P0/P1 issues and most P2 issues are resolved. This list tracks:
1. **Feature Expansion (v5)** — the new functionality planned in the /shape session
2. **Remaining Polish** — open P2 items not yet addressed

---

## Feature Expansion (v5)

Phases are ordered by dependency. Complete Phase 1 before starting Phases 5, 7, or 8.

### Phase 1 — Reactive Data Layer *(prerequisite for Phases 5, 7, 8)*

- [x] **Create `src/composables/useJobsData.js`** — module-level `ref([...jobsJson])` singleton. Expose: `jobs`, `addJob(newJob)`, `jobById(id)`. Follow `useOutdoorMode.js` pattern (no Pinia needed).
- [x] **Create `src/composables/useQuotesData.js`** — module-level `ref([...quotesJson])`. Expose: `quotes`, `addQuote(q)`, `quotesByJobId(id)`, `finalizeQuoteAsOrder(quoteId)` — sets quote status to `'Ordered'`, creates an order stub, returns the new order.
- [x] **Create `src/composables/useOrdersData.js`** — module-level `ref([...ordersJson])`. Expose: `orders`, `addOrder(o)`, `ordersByJobId(id)`.
- [x] **Update `src/composables/useSearch.js`** — replace direct JSON imports with refs from the three composables above so newly created records appear in search results immediately.

### Phase 2 — Navigation Restructure *(parallel with Phase 3)*

- [x] **`src/App.vue`** — Remove `<NavBar />` import and element. Add `<CreateJobFab />` between `<RouterView>` and `<BottomNav>`.
- [x] **`src/components/shared/BottomNav.vue`** — Rewrite for 5 tabs: **Home · Jobs · Search · Videos · Profile**. Search tab is the center item: visually featured (filled `bg-interactive` circle icon, no competing label or a minimal "Search" label). Update `isActive`: `search` route activates Search tab; `job-detail` still activates Jobs tab; home route activates Home tab only.
- [x] **`src/router/index.js`** — Add routes: `/search` → `SearchView`, `/jobs/new` → `CreateJobView`, `/catalog/:id` → `ProductDetailView`, `/jobs/:id/quotes/new` → `CreateQuoteView`. Add redirects: `/catalog` → `/search`, `/documents` → `/search`. Keep `/videos`.

### Phase 3 — SearchView *(parallel with Phase 2)*

- [x] **Create `src/views/SearchView.vue`** — Full-page route at `/search`. Autofocus input on mount. Reuses `useSearch` composable and `SearchResultGroup` component. Empty state with prompt copy (`"Search jobs, products, documents, videos…"`). Update `ROUTE_MAP`: products → `{ name: 'product-detail', params: { id } }`, documents → `window.open(doc.url, '_blank')`, videos → `window.open(item.videoUrl, '_blank')`.
- [x] **`src/components/search/SearchOverlay.vue`** — No longer mounted (NavBar removed). Delete after SearchView is verified working.

### Phase 4 — Product Detail Page *(parallel with Phase 3)*

- [x] **Create `src/views/ProductDetailView.vue`** — Back nav (`router.back()`). Sections: hero (placehold.co image, name, SKU, category badge, price/unit), Description, Related Documents (filter by `product.documentIds`), Related Videos (match by category string), Installation Notes placeholder. Route: `/catalog/:id`.
- [x] **`src/components/products/ProductCard.vue`** — Wrap card root in `<router-link :to="{ name: 'product-detail', params: { id: product.id } }">`. Remove the existing click/recently-viewed handler (navigation itself is the action now).

### Phase 5 — FAB + Create Job *(depends on Phase 1)*

- [x] **Create `src/components/shared/CreateJobFab.vue`** — `fixed bottom-24 right-4 z-50`. 56×56px circle, `bg-interactive`, "+" SVG icon 24px, `router-link` to `{ name: 'create-job' }`. `v-if="role === 'contractor'"`. Press state: `active:scale-95 transition-transform duration-100`.
- [x] **Create `src/views/CreateJobView.vue`** — Back nav, heading "New Job". Form: Name (text, required), Address (text, required), Type (select: Commercial / Residential / Multi-Unit), Square Footage (number). On submit: calls `useJobsData().addJob()` with `id: 'job-' + Date.now()`, `status: 'Bid'`, `createdAt/updatedAt: today`. Navigates to `{ name: 'job-detail', params: { id: newJob.id } }`.

### Phase 6 — Map / Directions on Job Detail *(parallel with Phase 5)*

- [x] **`src/views/JobDetailView.vue`** — In the address block, wrap the address paragraph in an `<a>` with `:href="'https://maps.google.com/?q=' + encodeURIComponent(job.address)"` `target="_blank" rel="noopener noreferrer"`. Add a sibling "Get Directions" link (with inline SVG arrow) using the same href, styled `text-highlight text-[13px] font-[700]`.

### Phase 7 — Add Quote from Job Detail *(depends on Phase 1)*

- [x] **`src/components/jobs/JobDetailTabs.vue`** — In the Quotes tab panel, add an "Add Quote" button above `<QuoteVersionList>`. Contractor role only (`v-if="role === 'contractor'"`). Routes to `{ name: 'create-quote', params: { id: job.id } }`.
- [x] **Create `src/views/CreateQuoteView.vue`** — Receives `:id` (jobId). Line item rows: product `<select>` (from `products.json`), description text (auto-fills on product select), qty (number), unit price (auto-fills, editable), row total (computed). Add row / remove row buttons. Computed: subtotal, tax 8%, grand total. "Save Quote" calls `useQuotesData().addQuote({ id: 'quote-' + Date.now(), jobId, status: 'Draft', lineItems, ... })`. Navigates to `{ name: 'job-detail', params: { id: jobId }, query: { tab: 'quotes' } }`.

### Phase 8 — Finalize Quote → Order *(depends on Phases 1 + 7)*

- [x] **`src/components/quotes/QuoteVersionList.vue`** — Add a "Place Order" CTA on quotes where `status === 'Approved'`. On click: calls `useQuotesData().finalizeQuoteAsOrder(quote.id)` which (1) sets `quote.status = 'Ordered'`, (2) calls `useOrdersData().addOrder()` with a stub (generated `poNumber`, `jobId`, `lineItems` from quote, `status: 'Processing'`), (3) pushes the new `orderId` into `useJobsData().jobById(quote.jobId).orderIds`. Navigates to Orders tab on completion (`{ query: { tab: 'orders' } }`).

### Phase 9 — Per-Finding Inspection Responses

- [x] **`src/components/inspections/InspectionCard.vue`** — In the expanded section, replace the single `InspectionResponseForm` with a per-finding loop. Each finding renders: its `photoUrls` images, a response textarea (`v-model` bound to a `responses[finding.id]` map), an "Add Photo" upload affordance (styled button + labeled drop zone — **no file input required for demo**), and a "Mark Resolved" toggle (`resolved[finding.id]`). Keep a single "Submit Response" button at the bottom of the expanded card that bundles all responses.
- [x] **`src/components/inspections/InspectionResponseForm.vue`** — Refactor into `InspectionFindingResponse.vue`: accepts `finding` prop, emits `update:response` and `update:resolved`. Used by the loop above.

---

## Remaining Polish (P2)

### Copy & Labels
- [x] **`jobs.sort_updated` key reused as a field label.** Add dedicated `jobs.detail_updated: "Last Updated"` key and use it in `JobDetailTabs` Overview. `src/components/jobs/JobDetailTabs.vue`, `src/locales/en.json`
- [x] **`home.section_recent_contractors` is factually wrong.** Section shows all contractors, not recently viewed. Change label to `"Your Contractors"`. `src/components/home/RecentContractors.vue`, `src/locales/en.json`
- [x] **`"Inspection"` job status reads as a type, not a state.** Rename to `"Under Inspection"` in `src/data/jobs.json` and all referencing components/locale keys. `src/components/shared/StatusBadge.vue`
- [x] **`home.open_job` CTA reads "Open Job →".** Change copy to "View Job" and replace raw `→` with an inline SVG chevron. `src/locales/en.json`, `src/components/home/RecentJobCard.vue`
- [x] **Nav label / page heading mismatches.** Standardize: `"Videos"` everywhere (BottomNav + page heading). `src/views/VideosView.vue`, `src/locales/en.json`

### Empty States
- [x] **`jobs.no_jobs` used for both filter-empty and truly-empty states.** Add `jobs.no_jobs_filtered: "No jobs match this filter."` and use it conditionally when `activeFilter !== 'All'`. `src/views/JobsView.vue`, `src/locales/en.json`
- [x] **Jobs empty state ignores active contractor filter.** Render `"No jobs found for {contractorName}."` when `contractorId` is set, with a "Show All Jobs" clear button. `src/views/JobsView.vue`
- [x] **Inspection success confirmation reuses the timestamp key.** Add `inspections.response_submitted_confirmation` for the success state copy. `src/components/inspections/InspectionResponseForm.vue`, `src/locales/en.json`
- [x] **Job detail back button always reads "Jobs".** Change to `t('common.back')` → `"Back"`. `src/views/JobDetailView.vue`

### Information Architecture
- [x] **Tracking numbers are plain text.** Wrap in `<a :href="trackingUrl(order)" target="_blank" rel="noopener">` constructed from `order.carrier` field (UPS, FedEx, etc.). `src/components/orders/OrderList.vue`
- [x] **Three different accordion expand behaviors.** Standardize Orders, Quotes, and Inspections on the `expandedId` pattern (one open at a time). `src/components/orders/OrderList.vue`, `src/components/quotes/QuoteVersionList.vue`, `src/components/inspections/InspectionCard.vue`
- [x] **"Job not found" uses `text-error` (red).** An absent job is not a destructive failure. Change to `text-text-secondary` and add a "Go to Jobs" router-link. `src/views/JobDetailView.vue`
- [x] **`RecentContractors.vue` has no empty state.** Add `v-if="contractorsWithStats.length"` guard with a `v-else` message. `src/components/home/RecentContractors.vue`

---

## Feature Expansion (v6)

### Phase 10 — Library Hub Page *(complete)*

- [x] **`src/data/products.json`** — Added `"featured": true` to 3 products: WeatherBond TPO 60-mil, EPDM Sure-Seal 60-mil, FlashBand Self-Adhesive Flashing.
- [x] **`src/data/documents.json`** — Added `"featured": true` to 3 documents: WeatherBond TPO PDS, WeatherBond TPO Install Spec, EPDM Fully Adhered System Spec.
- [x] **`src/data/videos.json`** — Added `"featured": true` to 3 videos: TPO Seam Welding, Warranty Program Overview, FlashBand Penetration Detailing.
- [x] **`src/composables/useRecentlyViewed.js`** — Extended JSDoc to document `type: 'video'` with `videoUrl` field. Logic unchanged (already generic).
- [x] **`src/components/home/RecentlyViewed.vue`** — Added video type handling: amber play-icon badge, `window.open(item.videoUrl)` on click.
- [x] **`src/components/videos/VideoCard.vue`** — Converted from `<a>` to `<button>` with `openVideo()` handler that calls `addItem` + `window.open`. All video taps now log to Recently Viewed.
- [x] **`src/views/SearchView.vue`** — Import `useRecentlyViewed`; ROUTE_MAP videos handler calls `addItem` before `window.open`.
- [x] **`src/locales/en.json`, `es.json`, `fr.json`, `pt.json`** — Added `nav.library` and `library.*` section keys (title, featured_products, featured_docs, featured_videos, see_all).
- [x] **`src/router/index.js`** — Added `{ path: '/library', name: 'library', component: LibraryView }`. `/videos` route retained.
- [x] **Created `src/views/LibraryView.vue`** — Three sections: Featured Products (horizontal scroll + ProductCard), Featured Documents (bordered list + DocumentCard), Featured Videos (2-col grid + VideoCard). Each section has "See All →" link.
- [x] **`src/components/shared/BottomNav.vue`** — Replaced Videos tab with Library tab: layers icon, `t('nav.library')`, active on both `library` and `videos` routes.

-----

## Ideas

- Add in map view similar to help details page with button to get directions
- Rework Action required a bit