## 🏗️ Carlisle Contractor Portal — GitHub Copilot Brief

### Project Overview
A mobile-first demo web app for roofing contractors to manage their relationship with Carlisle SynTec. Two user roles exist — **Contractors** and **Carlisle Sales Reps** — with no authentication required for the demo (role is toggled manually or via a simple role switcher in the UI).

---

### Tech Stack
| Layer | Choice |
|---|---|
| Framework | Vue.js (Vite) |
| Styling | Tailwind CSS |
| Data | Local JSON files (mock/seed data) |
| Deployment | Vercel |

---

### Roles & Permissions

**Contractor**
- Views and manages their own jobs, orders, quotes, inspections, documents, and videos only

**Carlisle Sales Rep**
- Views data across all contractor accounts
- Can approve or reject quotes and inspection responses

> For the demo, implement a simple **role switcher** (e.g. a toggle in the nav or a selector on a "demo home" screen) that swaps between the two views without login.

---

### Modules to Build

**1. Job Management**
- List view of all jobs with status badges (e.g. In Progress, Completed, Pending)
- Ability to create a new job (form with job name, address, type, start date)
- Tap into a job to see detail view

**2. Order Management**
- List of Carlisle product orders tied to jobs
- Each order shows product name, quantity, order date, and status (Processing, Shipped, Delivered)

**3. Quote Builder**
- Form to create a new quote (line items, quantities, labor, materials)
- Quote list view showing status (Draft, Submitted, Approved, Rejected)
- Sales Reps can approve or reject submitted quotes

**4. Inspection Responses**
- List of inspections with pass/fail status
- Contractors can tap in and submit a written response to a failed inspection
- Sales Reps can mark responses as reviewed

**5. Document Library**
- Grid or list of downloadable documents (install guides, spec sheets, warranties)
- Filter by category
- Mock PDF links (can be placeholder `#` hrefs for the demo)

**6. Training Video Library**
- Grid of training video cards with thumbnail, title, and duration
- Mock video links (can embed a placeholder YouTube video or use a static thumbnail)

---

### Design Direction
- **Modern and sleek** with Carlisle's brand colors as the foundation
- Carlisle's primary brand colors: **Red (`#C8102E`)** and **Dark Gray (`#333333`)** with white backgrounds
- Use Tailwind utility classes throughout — no custom CSS files unless necessary
- **Mobile-first layout**: bottom nav bar for primary module navigation, cards for list items, large tap targets
- Clean sidebar or top nav for the desktop breakpoint

---

### Data Layer
- All data lives in `/src/data/` as JSON files
- One file per module: `jobs.json`, `orders.json`, `quotes.json`, `inspections.json`, `documents.json`, `videos.json`
- Each JSON file should contain at least **4–6 realistic mock records**
- Vue components import JSON directly — no API calls or backend needed

---

### Project Structure (suggested)
```
/src
  /assets
  /components
    /jobs
    /orders
    /quotes
    /inspections
    /documents
    /videos
    /shared (NavBar, RoleSwitcher, StatusBadge, etc.)
  /data
    jobs.json
    orders.json
    quotes.json
    inspections.json
    documents.json
    videos.json
  /views
    JobsView.vue
    OrdersView.vue
    QuotesView.vue
    InspectionsView.vue
    DocumentsView.vue
    VideosView.vue
  /router
    index.js
  App.vue
  main.js
```
