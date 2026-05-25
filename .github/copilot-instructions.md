# GitHub Copilot Instructions — Basic Music Academy

## Project Purpose

Basic Music Academy is a **hackathon starter** — a deliberately simple website for a music school that lets users browse instrument classes, compare monthly fees in INR, book free demo lessons, and register for paid programs. The codebase is designed to be easy to read first, then refactored, extended, or migrated to a framework by hackathon participants using GitHub Copilot.

---

## Current Implementation

| Layer | Technology |
|---|---|
| Runtime | Next.js 15 App Router + React 18 |
| Entry | `src/app/layout.jsx` mounts Navbar, Footer, QueryProvider |
| Styling | Bootstrap 5 (npm) + custom design tokens in `css/style.css` |
| Data | `src/data/classes.js` ESM module with 7 seeded class objects (served via API) |
| API routes | `src/app/api/classes/route.js` · `src/app/api/classes/[id]/route.js` |
| API client | `src/lib/api.js` — axios instance + `classesApi` helpers |
| Data fetching | TanStack React Query (`useQuery`) on all client components |
| Forms | `src/app/enroll/EnrollContent.jsx` + `src/hooks/useSubmissions.js` (persisted to `localStorage`) |
| Dev server | `npm install` then `npm run dev` → `http://localhost:3000` |

---

## Domain Model

Each music class has these fields:

```js
{
  id,           // kebab-case slug, used as URL param (?class=<id>)
  name,         // display name
  category,     // "Strings" | "Keys" | "Percussion" | "Wind" | "Vocals"
  level,        // "Beginner" | "Intermediate" | "Advanced"
  monthlyFee,   // number in INR (format with Intl.NumberFormat "en-IN")
  duration,     // session length string e.g. "60 min"
  schedule,     // human-readable schedule string
  batch,        // "Weekday" | "Weekend"
  demoAvailable,// boolean — if false, show "Join Waitlist" instead of "Book Demo"
  ageGroup,     // minimum age string e.g. "10+ years"
  icon,         // emoji
  blurb,        // one-sentence description
  instructor    // instructor full name
}
```

Seeded programs: Contemporary Guitar, Piano Essentials, Violin Performance Lab, Drums Rhythm Lab, Flute Expression, Keyboard and Harmony, Vocals Stage Ready.

---

## Key Behaviors

- **Homepage** (`src/pages/HomePage.jsx`) shows hero content and 3 featured classes from seeded data.
- **Classes page** (`src/pages/ClassesPage.jsx`) has live filters: category dropdown, level dropdown, free-text search (searches name + category + blurb + instructor, case-insensitive).
- **Enroll page** (`src/pages/EnrollPage.jsx`) has two forms: a registration form and a demo booking form. Both pre-select a class when loaded with `?class=<id>` in the URL.
- **Form submissions** are stored under the `"basic-music-academy-submissions"` key in `localStorage`. Only the last 4 submissions are shown in the sidebar.
- **INR formatting** always uses the shared formatter utility in `src/utils/format.js`.
- **Active nav link** is handled by `NavLink` in `src/components/Navbar.jsx`.

---

## Run & Build

- Install dependencies: `npm install`
- Start local dev server: `npm run dev`
- Build production assets: `npm run build`
- Preview build: `npm run preview`

---

## Coding Conventions

- Use React function components and hooks; keep page-level state in page components and shared persistence logic in hooks.
- Apply appropriate software design patterns as a mandatory coding rule for new and refactored code (for example, composition, separation of concerns, and reusable module patterns where suitable).
- Keep seeded catalog data in `src/data/classes.js` and avoid mutating the exported `classes` array in-place.
- Keep currency formatting centralized in `src/utils/format.js`; do not inline `Intl.NumberFormat` elsewhere.
- Keep class search/filter behavior case-insensitive across `name`, `category`, `blurb`, and `instructor`.
- For local persistence, continue using `"basic-music-academy-submissions"` and handle storage failures safely.
- Preserve Bootstrap-first layout patterns and custom tokens from `css/style.css`.
- **All API calls from client components must use TanStack React Query (`useQuery` / `useMutation`) together with the axios-based helpers in `src/lib/api.js`.** Never use raw `fetch` or bare `axios` calls inside components.
- Add new API endpoints in `src/app/api/` and expose them through `src/lib/api.js` before consuming them in components.
- The `QueryClientProvider` is mounted in `src/components/QueryProvider.jsx` and included in the root layout — do not create additional providers.

---

## Suggested Refactor Directions (README checklist)

- [x] Migrate to React (Vite), Vue, or Svelte — component per class card, per form
- [x] Replace `window.musicAcademyData` global with an ESM data module (`src/data/classes.js`)
- [ ] Replace `localStorage` with a real backend API
- [ ] Add authentication and an admin dashboard
- [ ] Add payment integration
- [x] Split rendering into reusable UI components
- [x] Bootstrap 5 already in use for layout and utility classes

---

## Custom Agents

| Agent | Purpose |
|---|---|
| **Scrutinizer** | Write Vitest unit tests for frontend components, exhaustive edge-case and boundary coverage, 80% lines/branches target. Frontend-only scope. Does not edit production code without explicit approval. |
| **RoutePilot** | Detect missing API requirements, design and implement REST endpoints, replace seeded `window.musicAcademyData` with API-driven responses. |
| **LeakLens** | Review code for memory leaks, architecture improvements, and design-pattern opportunities with prioritized recommendations. |

---

## What Copilot Should Always Do

- Keep fees in **INR**; format using the existing `formatPrice()` utility.
- Treat design-pattern usage as mandatory: choose clear, maintainable patterns that fit the feature instead of ad-hoc logic.
- When adding new class data, follow the exact domain-model shape above.
- When generating filters or search logic, keep them case-insensitive and operating on the same fields (`name`, `category`, `blurb`, `instructor`).
- For app features, prefer React route pages in `src/app/` and follow Next.js App Router conventions.
- Treat this repository as React-only (`src/` + shared assets); do not introduce or depend on a parallel vanilla JS implementation.
- When generating tests, use **Vitest** as the default framework.
- Do not add `console.log` debug statements; use `console.warn` for recoverable errors when warning logs are needed.
- **Never use raw `fetch` or bare `axios` in client components.** Always use `useQuery` / `useMutation` from TanStack React Query with the helpers exported from `src/lib/api.js`.
