# GitHub Copilot Instructions — Ridgeline Contractor Portal

## Project Overview

A mobile-first demo web app for roofing contractors to manage their relationship with Ridgeline, a fictional roofing materials manufacturer. Jobs are the central entity — all orders, quotes, and inspections are children of a job. Single-user, contractor-only (no auth, no role switching). See `BRIEF.md` for the full spec.

**Stack:** Vue 3 + Vite · Tailwind CSS v4 (`@tailwindcss/vite`) · vue-i18n · Local JSON data · Vercel (behind a password gate)

**Path alias:** `@` resolves to `./src`

---

## Design Context

### Users

**Primary:** Roofing contractors in the field — on rooftops or job sites, one hand free, often gloved, in direct sunlight. Their job-to-be-done is fast: get to the right document, check an order status, or respond to an inspection. They are not browsing — they are executing.

**Secondary:** none in this build — Ridgeline sales reps are referenced as read-only job data (assigned rep name), not a distinct app user. A prior build had a rep-facing role switcher; it was removed to keep the demo scoped to the primary contractor journey.

**Context of use:** Bright sun on a phone screen, with gloves, under time pressure. White UIs are unreadable outdoors.

**Primary journey:** Job → Product → Document in 3 taps or fewer.

---

### Brand Personality

> "The Cadillac of construction materials. Expensive, but the best of the best. High quality, reliable."

**In 3 words: precise · authoritative · durable**

This is the premium tier of the roofing industry. Every surface should feel engineered, not assembled. Physically, this is the stamped-metal spec plate on professional tooling, or the label inside a Carhartt jacket made in Detroit. Expensive without being showy. Confident without being loud.

---

### Aesthetic Direction

**Theme:** Dark. Not for atmosphere — for function. Glare reduction is a real-world requirement. All backgrounds carry a blue undertone derived from `--color-brand: #164da6`. Pure charcoal (`#1A1A1A`) must never be used.

**Typography:**
- **Display / headings:** `Big Shoulders Display` — wide, compressed, premium-industrial. Chicago manufacturing heritage. Authoritative without being corporate.
- **UI / body:** `Barlow` — designed for military/official contexts. Exceptional small-size legibility in data-dense UIs. No startup-font associations.
- Load both from Google Fonts. Apply via `font-family: 'Big Shoulders Display', sans-serif` on headings and `font-family: 'Barlow', sans-serif` on body/UI.
- **Minimum size:** 16px body. 700 weight for anything below 18px. 500 minimum weight throughout.
- **Section labels and status badges:** all-caps + `tracking-widest`. Faster to scan outdoors.

**Color tokens (locked — never deviate):**
```
--color-brand:          #164da6   Brand blue. Logo, headers, structural anchors.
--color-interactive:    #2E6FD8   Buttons, active states, primary actions.
--color-highlight:      #5B9BF0   Focus rings, hover states, tab indicators.
--color-bg:             #151C28   App background.
--color-surface:        #1E2A3E   Card surfaces.
--color-surface-alt:    #243044   Nested / secondary surfaces.
--color-nav:            #0F1520   Persistent chrome (top nav, bottom nav).
--color-amber:          #F5A623   Alerts, pending, urgency. Highest outdoor visibility.
--color-emerald:        #4ACA6E   Success, approved, delivered.
--color-error:          #FF4C4C   Failure, rejected, destructive only. Not a brand color.
--color-text-secondary: #A8B8D0   Blue-tinted secondary text.
--color-border:         #2E3A52   Card borders, dividers.
```

**References:** Leading manufacturer field-service apps in the roofing/building-materials space — this should exceed them. Angi's List but more rugged and premium.

**Anti-references:** Generic Tailwind admin templates. Consumer-soft apps (rounded-everything, pastel states). Procore-style corporate nav density.

---

### Design Principles

1. **Premium over rugged.** The Cadillac of contractor apps. Every surface feels engineered and precise. "Good enough" is not the bar.
2. **Speed is the offering.** The most recent job, the most urgent alert, and the document library are reachable in one or two taps from anywhere. Navigation must never require thought.
3. **Outdoor-first legibility.** Every contrast, size, and weight decision passes a "direct sunlight + gloves" test. Minimum 52px tap targets. No outlined-only badges — solid fill only. No thin-stroke icons.
4. **Authoritative hierarchy.** The most important information on any screen is unmistakably obvious. Status is readable at a glance. Secondary info recedes visually. Nothing competes for attention.
5. **Purposeful motion only.** Transitions that orient (page entry, tab switch, accordion expand) are correct. Decorative animation is noise in a time-pressured field context. Use `grid-template-rows` for expand/collapse, `opacity + translateY` for entrances. No bounce, no elastic easing.

---

### Accessibility & Standards

- WCAG AA minimum for all text contrast
- Status badges: solid filled backgrounds only — never outlined
- All interactive elements: `min-height: 52px`. Increased to 60px in Outdoor Mode.
- All UI strings use vue-i18n translation keys. No hardcoded strings in templates.
- Language preference persists via `localStorage` key `carlisle_locale`.
- Role preference persists via `localStorage` key `carlisle_role`.
- Outdoor Mode persists via `localStorage` key `carlisle_outdoor_mode` (adds `outdoor-mode` class to `<body>`).

---

### Absolute Bans (Design)

These patterns are never acceptable in this codebase:

- **No side-stripe borders on cards/alerts.** Never `border-left` or `border-right` wider than 1px as a colored accent. Use full borders, background tints, or typographic hierarchy instead.
- **No gradient text.** No `background-clip: text` with a gradient. Solid colors only.
- **No pure black or pure white.** Always use the tinted values from the token list above.
- **No gray-on-gray text combinations.** Use `--color-text-secondary` (#A8B8D0) on dark surfaces only.
- **No glassmorphism** (backdrop-blur cards as decoration).
- **No cyan/purple/neon accent palette.** This is the default AI dark-mode palette and it is explicitly wrong for this brand.
