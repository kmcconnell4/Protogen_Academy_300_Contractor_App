# Ridgeline Contractor Portal

A mobile-first web app that gives roofing contractors fast, one-hand access to their jobs, quotes, orders, and product documentation on a job site. Built for **Protogen P303 — Mobile Experience**.

> **The context:** a contractor on a roof, one hand free, in direct sunlight, often wearing gloves. The interface has to get them to a document, an order status, or an inspection response in as few taps as possible — not invite browsing.

*Uses invented data. Contains no client- or Slalom-specific information. "Ridgeline" is a fictional roofing materials manufacturer created for this project.*

---

## What this is

Jobs are the central entity — quotes, orders, and inspections are all children of a job. A contractor can create a job, build a quote, place an order once a quote is approved, and respond to inspection findings, all from a phone.

Full concept, data model, and design direction live in **[BRIEF.md](BRIEF.md)**. Phased build tracking lives in **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)**, with the reasoning behind notable calls in **[context/decisions.md](context/decisions.md)**.

**Live demo:** password-protected — ask Kirsten for the password.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Vue 3 (Vite) |
| Styling | Tailwind CSS v4 |
| Routing | vue-router |
| i18n | vue-i18n (English, Spanish, French, Portuguese) |
| Data | Local JSON, made reactive via composables |
| Deployment | Vercel |

## Running locally

```bash
npm install
npm run dev
```

## Project structure

```
src/
  components/     UI components, grouped by feature (home, jobs, quotes, orders, inspections, products, shared)
  composables/     Reactive data singletons (useJobsData, useQuotesData, useOrdersData) + UI state (role removed;
                   outdoor mode, locale, recently-viewed, search)
  data/            Mock JSON — jobs, quotes, orders, inspections, products, documents, videos, reps
  locales/         en / es / fr / pt translation files
  router/          Route definitions
  views/           Page-level components
BRIEF.md           Spec + design direction
IMPLEMENTATION_PLAN.md   Phased build checklist
context/           AI scaffolding — decisions.md (dated decision log)
.github/           copilot-instructions.md — design system reference for AI tooling
```

## Design direction

Dark, blue-branded theme — dark backgrounds cut glare outdoors, where a white UI becomes unreadable in direct sun. Minimum 52px tap targets, solid-fill status badges, and an Outdoor Mode toggle that bumps font size, tap targets, and contrast further. Full rationale in `BRIEF.md`.

## Rubric alignment (P303)

| Rubric requirement | Where it's addressed |
|---|---|
| Site is live, accessible, password-protected | Deployed on Vercel behind `PasswordGate.vue` |
| Core flows work end-to-end | Job → Quote → Order, and per-finding Inspection response, both fully wired to reactive data |
| Works well across screen sizes | Bottom nav on mobile, persistent left sidebar at desktop widths (`md:` breakpoint) |
| AI scaffolding in place | `BRIEF.md`, `IMPLEMENTATION_PLAN.md` (including the original scaffolding prompts), `context/decisions.md` + `.github/copilot-instructions.md` |
| Commit history shows real progress | See `git log` — phased, descriptive commits across multiple sessions |
| Design fits the industry, not generic | Outdoor-legibility rules, locked color tokens, and an explicit list of banned patterns in `BRIEF.md` |
