# 🏗️ Carlisle Contractor Portal — GitHub Copilot Brief (v4)

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
- Filter/sort by status (Bid, In Progress, Inspection, Warranty, Closed)
- Tap a job → **Job Detail Page**

### 3. Job Detail Page (Tabbed)
Tabs: **Overview · Quotes · Orders · Inspections**

- **Overview tab:** Job name, address, type, status, assigned rep, creation date
- **Quotes tab:** List of quote versions (v1, v2…) with status (Draft, Submitted, Approved, Rejected). Tap to view line items (product name, qty, unit price, total). Sales Rep can approve/reject.
- **Orders tab:** List of orders with status (Processing, Shipped, Delivered). Tap to view line items linked to products. Each product links to its documents.
- **Inspections tab:** List of inspections with pass/fail badge. Tap to view findings and submit a contractor response. Sales Rep can mark as reviewed.

### 4. Product Catalog
- Searchable/filterable grid of all products from `products.json`
- Each product card shows name, SKU, category, and document links (PDS, SDS, Spec)
- Documents open as a modal or navigate to the Document Library filtered by that product

### 5. Document Library
- List/grid of all documents filterable by type (PDS / SDS / Spec) and by product
- Each document card shows name, type badge, associated product, and a mock download link

### 6. Training Videos
- Grid of video cards with thumbnail, title, and duration
- Standalone module — not tied to jobs or products
- Mock video links (static thumbnails + placeholder href)

### 7. Universal Search
- Persistent search icon in the top nav bar
- Searches across: Jobs (by name/address), Products (by name/SKU), Quotes (by job name/status), Documents (by name/type), Videos (by title)
- Results grouped by category with tap-to-navigate
- Implemented as a full-screen overlay on mobile

### 8. Profile & Settings
- Language selector: **English, Spanish, French, Portuguese**
- Role switcher (mirrored here from nav for convenience)
- Mock contractor profile info (name, company, region)

---

## Home Screen Spec

### Design Philosophy
This screen is built for **a contractor on a roof, one hand free, under the sun.** Every decision prioritizes speed, large tap targets, and getting to a document in 3 taps or less. It is a **launchpad**, not a dashboard.

The primary user journey this screen enables is: **Job → Product → Document.**

### Layout (Mobile-First, Scrollable)

```
┌─────────────────────────────────┐
│  ☰  Carlisle          🔍  👤   │  ← Top nav
├─────────────────────────────────┤
│  Good morning, Marcus 👋        │
│  📍 Cincinnati, OH  ⛅ 64°F    │  ← Weather tied to active job location
├─────────────────────────────────┤
│  ⚠️  ACTION REQUIRED            │
│  ┌─────────────────────────┐   │
│  │ 🔴 Inspection response  │   │  ← Alert cards, swipeable
│  │    due · Elm St Reroof  │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │ 🟡 Quote v2 awaiting    │   │
│  │    approval · Park Ave  │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│  CONTINUE WHERE YOU LEFT OFF    │
│  ┌─────────────────────────┐   │
│  │ Elm St Commercial       │   │  ← Most recent job, large card
│  │ 🟢 In Progress          │   │
│  │ 3 products · 2 orders   │   │
│  │         → Open Job      │   │
│  └─────────────────────────┘   │
├─────────────────────────────────┤
│  RECENTLY VIEWED                │
│  [TPO Membrane] [EPDM Adhesive] │  ← Horizontally scrollable chips
│  [Install Guide v3]             │
├─────────────────────────────────┤
│  QUICK ACCESS                   │
│  ┌──────────┐  ┌──────────┐    │
│  │ 📄 Docs  │  │ 🎥 Videos│    │  ← 2-up grid, large tap targets
│  └──────────┘  └──────────┘    │
├─────────────────────────────────┤
│  [+  Start New Job / Quote    ] │  ← Full-width CTA, Interactive Blue (#2E6FD8)
└─────────────────────────────────┘
│  Jobs │ Catalog │ Docs │ Videos  │  ← Bottom nav
```

### Section-by-Section Breakdown

#### 1. Top Bar
- Carlisle logo (left), Search icon + Profile avatar (right)
- Persistent across all screens — not part of the scroll

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
- Two large equal-width cards: **Documents** and **Videos**
- Contractor's #1 use case — prominent placement
- Tap goes directly to the full Document Library or Video Library

#### 7. Start New Job / Quote CTA
- Full-width button in Interactive Blue (`#2E6FD8`) at bottom of scroll
- Opens a modal or navigates to job creation flow
- Kept at bottom intentionally — creation is less frequent than retrieval

### Key UX Decisions & Rationale

| Decision | Rationale |
|---|---|
| Most recent job front and center | Contractors typically work one job at a time on-site |
| Weather tied to job location | Directly relevant to their work — not a gimmick |
| Alerts above the job card | Urgent items must be seen before anything else |
| Recently viewed as chips, not a list | Fast one-tap recovery without leaving the home screen |
| Docs & Videos as large tap targets | Primary use case deserves primary real estate |
| CTA at the bottom | Creation is less frequent than retrieval — don't front-load it |
| No stats or charts | On a roof with gloves — data visualization is noise |

### Sales Rep Home Screen (Role Switch)
When role is toggled to **Sales Rep**, the home screen adapts:
- Greeting remains, weather is removed
- "Action Required" shows quotes pending approval and inspection responses to review — **across all contractors**
- "Continue Where You Left Off" becomes **"Recently Viewed Contractors"**
- Quick Access becomes **"All Jobs"** and **"Contractor Accounts"**
- CTA changes to **"Add Contractor"**

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
- **Mobile-first:** bottom navigation bar with icons + labels for Jobs, Catalog, Docs, Videos
- **Desktop breakpoint:** left sidebar nav using `--color-nav` background
- Tailwind utility classes throughout — extend `tailwind.config.js` with the custom color tokens above
- No custom CSS files beyond `main.css` for the custom property definitions

---

## Project Structure
```
/src
  /components
    /home         (GreetingWeather, AlertCards, RecentJobCard, RecentlyViewed, QuickAccess)
    /jobs         (JobCard, JobStatusBadge, JobDetailTabs)
    /quotes       (QuoteVersionList, QuoteLineItems)
    /orders       (OrderList, OrderLineItems)
    /inspections  (InspectionCard, InspectionResponseForm)
    /products     (ProductCard, ProductCatalog)
    /documents    (DocumentCard, DocumentLibrary)
    /videos       (VideoCard, VideoLibrary)
    /search       (SearchOverlay, SearchResultGroup)
    /shared       (NavBar, BottomNav, RoleSwitcher, StatusBadge)
  /data
    jobs.json / quotes.json / orders.json
    inspections.json / products.json
    documents.json / videos.json
  /locales
    en.json / es.json / fr.json / pt.json
  /views
    HomeView.vue
    JobsView.vue / JobDetailView.vue
    ProductCatalogView.vue / DocumentLibraryView.vue
    VideosView.vue / ProfileView.vue
  /router
    index.js
  /composables
    useRole.js        (provide/inject role state)
    useSearch.js      (cross-entity search logic)
    useLocale.js      (language preference + localStorage persistence)
    useRecentlyViewed.js  (track + retrieve recently viewed products/docs)
    useOutdoorMode.js     (toggle outdoor mode class on body + persist in localStorage)
  App.vue
  main.js
```

