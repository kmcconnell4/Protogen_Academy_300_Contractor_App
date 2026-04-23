# 🏗️ Carlisle Contractor Portal — GitHub Copilot Brief (v5)

## Project Overview
A mobile-first demo web app for roofing contractors to manage their relationship with Carlisle SynTec. **Jobs are the central entity** — all orders, quotes, and inspections are children of a job. Two user roles exist — **Contractors** and **Carlisle Sales Reps** — toggled via a role switcher (no auth required for demo).

---

## Tech Stack
| Layer | Choice |
|---|---|
| Framework | Vue.js (Vite) |
| Styling | Tailwind CSS |
| i18n | vue-i18n |
| Data | Local JSON files |
| Deployment | Vercel |

---

## Data Model

This is the core relationship map Copilot should respect across all components and JSON files:

```
Job
├── status: Bid | In Progress | Inspection | Warranty | Closed
├── Quotes (one or more versioned quotes, e.g. v1, v2, v3)
│   └── Line Items → Products (from global catalog)
├── Orders (one or more)
│   └── Line Items → Products (from global catalog)
└── Inspections (one or more, linked to the job)

Product (global catalog)
├── name, SKU, description, category
└── Documents
    ├── Product Data Sheet (PDS)
    ├── Safety Data Sheet (SDS)
    └── Spec Sheet

Document Library
└── Documents surfaced from Products + any universal docs
```

---

## Data Layer (`/src/data/`)

| File | Contents |
|---|---|
| `jobs.json` | 5–6 jobs across all statuses, each with nested quote IDs, order IDs, inspection IDs |
| `quotes.json` | Versioned quotes (v1, v2) tied to job IDs, with line items referencing product IDs |
| `orders.json` | Orders tied to job IDs, with line items referencing product IDs |
| `inspections.json` | Inspections tied to job IDs, with pass/fail status and response fields |
| `products.json` | Global product catalog (8–10 products), each with SKU, category, and linked document IDs |
| `documents.json` | All documents with type (PDS / SDS / Spec), linked to product IDs |
| `videos.json` | Training videos (standalone, not tied to jobs) |

---

## Roles & Permissions

**Contractor**
- Sees only their own jobs and all related data
- Can create/edit quotes and orders on their jobs
- Can submit inspection responses

**Carlisle Sales Rep**
- Sees all contractors' jobs in a combined view
- Can approve or reject quotes
- Can mark inspection responses as reviewed

> Implement a **RoleSwitcher** component in the top nav that toggles global role state via Vue's `provide/inject`.

---

## Modules & Views

### 1. Home Screen *(see full spec below)*
The primary landing screen — purpose-built for a contractor on a job site.

### 2. Jobs
- List of jobs with status badge and last updated date
- Filter/sort by status (Bid, In Progress, Under Inspection, Warranty, Closed)
- Tap a job → **Job Detail Page**

### 3. Job Detail Page (Tabbed)
Tabs: **Overview · Quotes · Orders · Inspections**

- **Overview tab:** Job name, address (tappable — opens Google/Apple Maps for directions), type, status, assigned rep, creation date
- **Quotes tab:** List of quote versions with status (Draft, Submitted, Approved, Rejected, Ordered). Tap to view line items. Contractor can add a new quote. Sales Rep can approve/reject. Approved quotes show a "Place Order" button that finalizes them as an order.
- **Orders tab:** List of orders with status (Processing, Shipped, Delivered). Tap to view line items linked to products.
- **Inspections tab:** Expanding an inspection shows each **finding** individually — with its photos, a per-finding response textarea, an upload affordance for a remediation photo, and a "Mark Resolved" toggle. A single "Submit Response" button sends all finding responses. Sales Rep can mark the inspection as reviewed.

### 4. Create Job
- Accessible via a floating action button (FAB) fixed `bottom-24 right-4` — visible on all pages, contractor role only
- Form fields: Job Name, Address, Type (Commercial / Residential / Multi-Unit), Square Footage
- On submit: creates a new reactive job, navigates to the new Job Detail page
- Route: `/jobs/new`

### 5. Create Quote
- Accessible from the Quotes tab on Job Detail (contractor role only)
- Line item builder: product selector, description (auto-fills from product), qty, unit price (auto-fills, editable), row total computed
- Computed subtotal, tax (8%), and grand total
- On submit: quote appears immediately in the job's Quotes tab
- Route: `/jobs/:id/quotes/new`

### 6. Product Detail
- Each product card navigates to `/catalog/:id`
- Not a top-level nav destination — accessed from search results or product cards
- Sections: hero (placeholder image, name, SKU, category, price/unit), Description, Related Documents (filtered by `product.documentIds`), Related Videos (matched by category), Installation Notes

### 7. Document Library
- No longer a dedicated nav destination — documents are accessed via **Global Search**
- Document search results open the file directly in a new tab (`window.open`)

### 8. Training Videos
- Grid of video cards with thumbnail, title, category, and duration
- Each card is fully tappable (no separate Watch button) — opens `videoUrl` in a new tab and logs to Recently Viewed
- Accessible via the Library hub ("See All Videos") and from Search results
- Route: `/videos` (still exists as a standalone route; Library is the nav entry point)

### 9. Global Search
- Full-page view at `/search` — accessed via the **floating search bar** (see Layout below)
- Searches across: Jobs, Products, Quotes, Orders, Inspections, Documents, Videos
- Results grouped by category with tap-to-navigate
- Products → Product Detail page; Documents → opens file in new tab; Videos → opens video in new tab
- The floating search bar is hidden when the user is already on `/search` (SearchView has its own autofocused full-width input)

### 10. Profile & Settings
- Language selector: **English, Spanish, French, Portuguese**
- Role switcher (mirrored here from nav for convenience)
- Outdoor Mode toggle
- Mock contractor profile info (name, company, region)

### 11. Library Hub
- Hub page replacing the Videos tab in the bottom nav. Route: `/library`
- Three curated sections: **Featured Products**, **Featured Documents**, **Featured Videos** — each showing items with `"featured": true` in the corresponding JSON data file
- Each section has an all-caps section label and a "See All →" link to the full browse view:
  - Featured Products → Product Catalog (redirects to Search)
  - Featured Documents → Document Library (redirects to Search)
  - Featured Videos → `/videos` (full Videos view)
- Tapping a featured Video opens it in a new tab AND logs it to Recently Viewed
- Tapping from Search results also logs videos to Recently Viewed
- Featured items are manually curated via a `featured: true` field added to `products.json`, `documents.json`, and `videos.json`

---

## Home Screen Spec

### Design Philosophy
This screen is built for **a contractor on a roof, one hand free, under the sun.** Every decision prioritizes speed, large tap targets, and getting to a document in 3 taps or less. It is a **launchpad**, not a dashboard.

The primary user journey this screen enables is: **Job → Product → Document.**

### Layout (Mobile-First, Scrollable)

```
┌─────────────────────────────────┐
│  Good morning, Marcus           │
│  📍 Cincinnati, OH  64°F        │  ← No top bar — starts directly with content
├─────────────────────────────────┤
│  ACTION REQUIRED                │
│  ┌─────────────────────────┐   │
│  │ Inspection response due │   │  ← Alert cards, swipeable
│  │    · Elm St Reroof      │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ Quote v2 awaiting       │   │
│  │    approval · Park Ave  │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│  CONTINUE WHERE YOU LEFT OFF    │
│  ┌─────────────────────────┐   │
│  │ Elm St Commercial       │   │  ← Most recent job, large card
│  │ In Progress             │   │
│  │ 3 products · 2 orders   │   │
│  │         View Job  ›     │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│  RECENTLY VIEWED                │
│  [TPO Membrane] [EPDM Adhesive] │  ← Horizontally scrollable chips
│  [Install Guide v3]             │
├─────────────────────────────────┤
│  QUICK ACCESS                   │
│  ┌──────────┐  ┌──────────┐    │
│  │  Search  │  │  Videos  │    │  ← 2-up grid, large tap targets
│  └──────────┘  └──────────┘    │
└─────────────────────────────────┘
│  Home │ Jobs │ [⊕ Search] │ Library │ Profile  │  ← Bottom nav
                                            [+]  ← FAB fixed bottom-right (contractor only)
```

### Section-by-Section Breakdown

#### 1. Global Chrome
- **No top navigation bar.** The app uses bottom navigation only.
- Bottom nav: **4 tabs — Home · Jobs · Library · Profile**
- A **floating search bar** sits above the BottomNav on every page except Profile and SearchView. Tapping navigates to `/search`. Mic button enables voice-to-text.
- A **floating action button (FAB)** — `fixed bottom-36 right-4` — provides job creation, visible on every page, contractor role only

#### 2. Greeting + Weather Widget
- Personalized greeting using contractor's first name
- Weather pulled from the **active job's address location** (or most recent job if none active)
- Shows city, condition icon, and temperature
- Subtle — one line, not a full widget
- Helps contractor make real-time decisions (rain delay, wind, heat)

#### 3. Action Required — Alert Cards
- Only appears when there are pending items
- Each card shows: alert type, urgency color (🔴 urgent / 🟡 pending), job name, tap-to-navigate
- Horizontally swipeable if more than 2 alerts
- Alert types to surface:
  - Inspection response due
  - Quote approved or rejected by rep
  - Order shipped or delivered
  - New document added to a product on their job

#### 4. Continue Where You Left Off
- Single large card showing the **most recently accessed job**
- Shows: job name, status badge, product count, order count
- One clear CTA: **"Open Job →"**
- Primary path to job → product → document

#### 5. Recently Viewed
- Horizontally scrollable row of chips/pills
- Surfaces the last 4–6 products or documents the contractor tapped
- Each chip shows an icon (📄 or 📦) and a truncated name
- Tap navigates directly back to that product or document

#### 6. Quick Access
- Two large equal-width cards: **Search** and **Videos**
- Contractor's #1 use case — prominent placement
- Tapping Search goes to `/search`; Tapping Videos goes to `/videos`

### Key UX Decisions & Rationale

| Decision | Rationale |
|---|---|
| Most recent job front and center | Contractors typically work one job at a time on-site |
| Weather tied to job location | Directly relevant to their work — not a gimmick |
| Alerts above the job card | Urgent items must be seen before anything else |
| Recently viewed as chips, not a list | Fast one-tap recovery without leaving the home screen |
| Search & Videos as large tap targets | Primary cross-cutting use cases deserve primary real estate |
| FAB for job creation | Creation is less frequent than retrieval — persistent but unobtrusive |
| No stats or charts | On a roof with gloves — data visualization is noise |

### Sales Rep Home Screen (Role Switch)
When role is toggled to **Sales Rep**, the home screen adapts:
- Greeting remains, weather is removed
- "Action Required" shows quotes pending approval and inspection responses to review — **across all contractors**
- "Continue Where You Left Off" becomes **"Recently Viewed Contractors"**
- Quick Access becomes **"All Jobs"** and **"Contractor Accounts"**
- FAB is hidden (rep role cannot create jobs)

---

## Internationalization (i18n)
- Use **vue-i18n** for all UI strings
- Create locale files: `/src/locales/en.json`, `es.json`, `fr.json`, `pt.json`
- All nav labels, status badges, button text, tab names, form labels, section headings, and alert messages must use translation keys — no hardcoded UI strings
- Mock data (job names, addresses) can stay in English
- Language preference persists via `localStorage`
- Language selector lives in the **Profile & Settings** screen as a dropdown

---

## Design Direction

### Philosophy
This app is used **on rooftops, in direct sunlight, with one hand, often with gloves.** Every design decision must serve that context. The UI uses a **dark-anchored, blue-branded theme** — dark backgrounds eliminate glare (white UIs reflect sunlight and become unreadable outdoors), and Carlisle blue provides a stable, high-visibility brand anchor.

---

### Brand Personality

> "The Cadillac of construction materials. Expensive, but the best of the best. High quality, reliable."

**In 3 words: precise · authoritative · durable**

This is not a rough field tool — it is the premium tier of the roofing industry. Every surface should feel engineered and considered, not assembled. The physical analogy: the stamped-metal spec plate on a piece of professional tooling, or the label sewn inside a Carhartt jacket made in Detroit. Expensive without being showy. Confident without being loud.

---

### Emotional Goals

When a contractor opens this app on a job site, they should feel:

- **Confident** — I know exactly where to go
- **Fast** — get me to the document and get out of my way

Every navigation decision, information hierarchy choice, and interaction pattern should serve these two feelings. If a design choice creates hesitation or requires thought, it is wrong.

---

### References & Anti-References

**References (aim for or surpass):**
- Carlisle's own Elevate Technical App — this portal should feel more polished and faster than it
- Angi's List — but more rugged, more premium, zero consumer-facing softness

**Anti-references (explicitly avoid):**
- Generic Tailwind admin templates — same-card grids, cyan accents, identical spacing everywhere
- Consumer-soft apps — rounded-everything, pastel states, playful or casual microcopy
- Procore-style corporate heaviness — dense nav trees, overwhelming sidebar structures

---

### Design Principles

1. **Premium over rugged.** The Cadillac of contractor apps. Every surface feels engineered and precise. If a choice looks "good enough," keep pushing until it looks intentional.

2. **Speed is the offering.** The most recent job, the most urgent alert, and the document library must be reachable in one or two taps from anywhere. Navigation must never require thought.

3. **Outdoor-first legibility.** Every contrast, size, and weight decision must pass a "direct sunlight + gloves" mental test. Solid-fill badges only. Filled icons only. No thin-stroke anything.

4. **Authoritative hierarchy.** The most important information on any screen should be unmistakably obvious. Status readable at a glance. Secondary info recedes. Nothing competes.

5. **Purposeful motion only.** Transitions that orient (page entry, tab switch, accordion expand) are correct. Decorative animation is noise in a time-pressured field context.

---

### Color Palette

All colors are defined as CSS custom properties in `main.css` and mapped to Tailwind's config via `tailwind.config.js`.

#### Brand Blues
| Role | Name | Hex |
|---|---|---|
| Logo, headers, card accents | Carlisle Blue | `#164da6` |
| Buttons, active states, links | Interactive Blue | `#2E6FD8` |
| Hover states, focus rings | Blue Highlight | `#5B9BF0` |

#### Backgrounds & Surfaces
| Role | Name | Hex |
|---|---|---|
| App background | Navy Black | `#151C28` |
| Card surface | Dark Blue Card | `#1E2A3E` |
| Nested / alt card surface | Deep Blue Card | `#243044` |
| Bottom nav | Darkest Anchor | `#0F1520` |

> All background colors carry a blue undertone to tie the dark UI back to the Carlisle brand. Pure charcoal (`#1A1A1A`) should not be used.

#### Text
| Role | Hex |
|---|---|
| Primary text | `#FFFFFF` |
| Secondary text | `#A8B8D0` (blue-tinted gray) |

#### Borders & Dividers
| Role | Hex |
|---|---|
| Card borders, section dividers | `#2E3A52` (blue-tinted, subtle) |

#### Functional / Status Colors
| Role | Name | Hex | Usage |
|---|---|---|---|
| Alerts, warnings, pending | Amber | `#F5A623` | Highest outdoor visibility — use for anything needing attention |
| Success, approved, delivered | Emerald | `#4ACA6E` | Positive states only |
| Error, rejected, failed | Red | `#FF4C4C` | Destructive states only — do not use for branding |

> **Red is no longer a brand color.** It is reserved exclusively for destructive or failure states (rejected quotes, failed inspections, error messages). Using red outside of these contexts will create confusion.

> **Amber is the contrast partner to blue.** Blue and amber sit near-opposite on the color wheel — together they create the strongest possible visual tension for alerts and urgent actions. Amber is also the highest-visibility color in direct sunlight (think road signs).

#### Status Badge Color Mapping
| Job Status | Color | Hex |
|---|---|---|
| Bid | Amber | `#F5A623` |
| In Progress | Interactive Blue | `#2E6FD8` |
| Inspection | Amber | `#F5A623` |
| Warranty | Emerald | `#4ACA6E` |
| Closed | Secondary Text | `#A8B8D0` |

---

### CSS Custom Properties
Define these in `/src/assets/main.css`:

```css
:root {
  /* Brand */
  --color-brand:           #164da6;
  --color-interactive:     #2E6FD8;
  --color-highlight:       #5B9BF0;

  /* Backgrounds */
  --color-bg:              #151C28;
  --color-surface:         #1E2A3E;
  --color-surface-alt:     #243044;
  --color-nav:             #0F1520;

  /* Text */
  --color-text-primary:    #FFFFFF;
  --color-text-secondary:  #A8B8D0;

  /* Borders */
  --color-border:          #2E3A52;

  /* Functional */
  --color-amber:           #F5A623;
  --color-emerald:         #4ACA6E;
  --color-error:           #FF4C4C;
}
```

---

### Typography & Sizing

**Typefaces:**
- **Display / headings:** `Big Shoulders Display` (Google Fonts) — Wide, compressed, premium-industrial. Chicago manufacturing heritage. Reads as authoritative and engineered, not corporate or startup. Use for screen titles, section headings, and large status labels.
- **UI / body:** `Barlow` (Google Fonts) — Originally designed for military/official communications. Exceptional legibility at small sizes in data-dense UI contexts. No startup-font associations. Use for all body text, labels, buttons, and nav items.

**Sizing rules:**
- **Minimum body font size: 16px** — bump from typical 14px
- **Minimum font weight: 500 (medium)** — thin strokes (300/400) vanish in glare
- **All-caps + letter-spacing (`tracking-widest`)** for section labels and status badges — faster to scan than mixed case outdoors
- **Bold (700) for all text below 18px**
- **Big Shoulders Display** for headings only — never for body copy or long-form content

---

### Component Rules for Outdoor Readability

- **Status badges:** solid filled backgrounds only — outlined badges disappear in sunlight
- **Icons:** filled variants only — stroke/outline icons thin out visually outdoors
- **Buttons:** minimum height `52px` (not 44px) — larger target for gloved hands
- **Buttons:** full-width wherever possible on mobile
- **Cards:** differentiate with full border (`border border-border`) + background tint (`bg-surface`) — do NOT use side-stripe accent borders (border-left/border-right wider than 1px); side-stripes are visually weak and inconsistent with the premium aesthetic
- **Bottom nav:** large icons (28px+) with text labels — never icons alone
- **Avoid:** gradients on interactive elements, thin dividing lines under 1px, gray-on-gray text combinations, glassmorphism, cyan/neon accent colors

---

### Motion

**Principle:** Transitions that orient the user (page entry, tab switch, accordion expand/collapse) are correct. Decorative animation is noise in a time-pressured field context and should never be used.

**Rules:**
- Use `grid-template-rows` transitions for expand/collapse animations — never animate `height` directly
- Use `opacity` + `translateY` for page/section entrances — never `scale` on large containers
- Easing: `ease-out` or `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) — natural deceleration
- No bounce, no elastic easing — they feel dated and wrong in a professional tool
- No decorative hover sparkles, scroll-triggered reveals, or floating elements
- **Outdoor Mode** disables all transitions and animations via `animation-duration: 0.001ms; transition-duration: 0.001ms`

---

### Outdoor Mode
Add an **"Outdoor Mode"** toggle in Profile & Settings that:
- Increases all font sizes by one step (e.g. base 16px → 18px)
- Increases all tap targets by 8px
- Disables non-essential animations
- Increases text contrast (secondary text shifts from `#A8B8D0` → `#FFFFFF`)

This should be implemented as a CSS class on `<body>` (e.g. `class="outdoor-mode"`) toggled via a composable and persisted in `localStorage`.

---

### Layout
- **Mobile-first:** bottom navigation bar with **4 tabs — Home · Jobs · Library · Profile**. No top navigation bar. Search is accessed via a **floating search bar** (see below) rather than a dedicated nav tab.
- **Floating Search Bar:** A persistent `fixed bottom-16 inset-x-0` pill anchored above the BottomNav on every page except `/profile` and `/search`. Tapping navigates to `/search`. Contains a mic button that triggers Web Speech API voice-to-text, pre-fills the query, and navigates to `/search`. Mic button is hidden silently on browsers without Speech API support.
- **FAB:** `position: fixed; bottom: 9rem; right: 1rem` (`bottom-36`) — clears the floating search bar. Contractor role only, routes to `/jobs/new`.
- **Desktop breakpoint:** left sidebar nav using `--color-nav` background
- Tailwind utility classes throughout — extend `tailwind.config.js` with the custom color tokens above
- No custom CSS files beyond `main.css` for the custom property definitions

---

## Project Structure
```
/src
  /components
    /home         (GreetingWeather, AlertCards, RecentJobCard, RecentlyViewed, QuickAccess)
    /jobs         (JobCard, JobDetailTabs)
    /quotes       (QuoteVersionList, QuoteLineItems)
    /orders       (OrderList, OrderLineItems)
    /inspections  (InspectionCard, InspectionFindingResponse)
    /products     (ProductCard)
    /documents    (DocumentCard)
    /videos       (VideoCard)
    /search       (SearchResultGroup)
    /shared       (BottomNav, CreateJobFab, RoleSwitcher, StatusBadge, DocTypeBadge)
  /data
    jobs.json / quotes.json / orders.json
    inspections.json / products.json
    documents.json / videos.json
  /locales
    en.json / es.json / fr.json / pt.json
  /views
    HomeView.vue
    JobsView.vue / JobDetailView.vue
    CreateJobView.vue           ← /jobs/new
    CreateQuoteView.vue         ← /jobs/:id/quotes/new
    SearchView.vue              ← /search (center nav tab)
    ProductDetailView.vue       ← /catalog/:id
    LibraryView.vue             ← /library (Library hub, bottom nav tab)
    VideosView.vue / ProfileView.vue
  /router
    index.js
  /composables
    useRole.js            (provide/inject role state)
    useSearch.js          (cross-entity search — consumes reactive data composables)
    useLocale.js          (language preference + localStorage persistence)
    useRecentlyViewed.js  (track + retrieve recently viewed products/docs)
    useOutdoorMode.js     (toggle outdoor mode class on body + persist in localStorage)
    useJobsData.js        (module-level reactive jobs ref; addJob, jobById)
    useQuotesData.js      (module-level reactive quotes ref; addQuote, finalizeQuoteAsOrder)
    useOrdersData.js      (module-level reactive orders ref; addOrder, ordersByJobId)
  App.vue
  main.js
```

