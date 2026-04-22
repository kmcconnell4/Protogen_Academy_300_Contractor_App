## Copilot Prompting Sequence

Work through these prompts in order for best results:

1. *"Scaffold a Vue 3 + Vite project with Tailwind CSS and vue-i18n. Create the folder structure above and stub out all JSON data files with realistic mock data for a roofing contractor app. Extend tailwind.config.js with these custom color tokens: brand: #164da6, interactive: #2E6FD8, highlight: #5B9BF0, bg: #151C28, surface: #1E2A3E, surface-alt: #243044, nav: #0F1520, amber: #F5A623, emerald: #4ACA6E, error: #FF4C4C, text-secondary: #A8B8D0, border: #2E3A52. Define them as CSS custom properties in main.css as well."* ✅

2. *"Build the HomeView for a contractor using Tailwind CSS. It should include: a greeting with a weather widget tied to the most recent job's location, horizontally swipeable alert cards for pending actions, a large recent job card with an 'Open Job' CTA, a horizontally scrollable recently viewed row, two large quick-access cards for Documents and Videos, and a full-width 'Start New Job' button in Interactive Blue (#2E6FD8). Use a dark navy-black background (#151C28), blue-tinted dark card surfaces (#1E2A3E), white primary text, and amber (#F5A623) for alerts. Mobile-first, minimum 52px tap targets, high contrast for outdoor readability."* ✅

3. *"Build the JobsView with a filterable list of jobs using `jobs.json`. Each job card should show name, address, status badge, and last updated date."* ✅

4. *"Build the JobDetailView with four tabs: Overview, Quotes, Orders, Inspections. Each tab loads related data by matching the jobId from the route params. The Quotes tab should support multiple versioned quotes (v1, v2). The Orders tab should link to the product detail page."* ✅

5. *"Build the ProductCatalogView using `products.json`. Each product card shows name, SKU, category, and links to its associated documents (PDS, SDS, Spec) from `documents.json`."* ✅

6. *"Add a universal search overlay component triggered from the top nav. It should search across jobs, products, quotes, documents, and videos from their JSON files and group results by category. On mobile, render as a full-screen overlay."* ✅

7. *"Implement vue-i18n with locale files for English, Spanish, French, and Portuguese. Replace all hardcoded UI strings in every component with translation keys. Add a language selector dropdown to ProfileView.vue. Persist the choice in localStorage."* ✅

8. *"Implement the RoleSwitcher using Vue's provide/inject. When toggled to Sales Rep, the HomeView should show alerts across all contractors, replace the recent job card with recently viewed contractors, and change the CTA to 'Add Contractor'."*  ✅

9. *"Add an Outdoor Mode toggle to ProfileView.vue. When enabled, it should: add an 'outdoor-mode' class to the document body, increase all base font sizes by one step, increase all tap targets by 8px, shift secondary text from #A8B8D0 to #FFFFFF, and disable non-essential CSS transitions. Persist the preference in localStorage via a useOutdoorMode.js composable."* ✅