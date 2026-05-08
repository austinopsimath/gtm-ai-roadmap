# GTM AI Roadmap Management — Build Plan

A static, free-to-use, browser-persisted PWA that operationalizes the framework defined in [GTM_AI_Roadmap_Framework.md](GTM_AI_Roadmap_Framework.md).

---

## Locked Decisions

| Decision | Choice |
|---|---|
| **App name** | GTM AI Roadmap Management |
| **Repo slug** | `gtm-ai-roadmap` |
| **Code location** | This folder: `/Users/jerrypharr/.../AI Agents/AI Roadmap Management/` (Google Drive synced — see "Drive sync caveat" below) |
| **Hosting** | Netlify (free tier, GitHub auto-deploy) |
| **Domain plan** | Free `*.netlify.app` URL initially → CNAME `roadmap.salesexcellence.xyz` to Netlify in Phase 8 |
| **Repo visibility** | Public on GitHub |
| **Build cadence** | Claude drives; checkpoint at each phase boundary and on non-trivial mid-phase design calls |
| **Visual style** | Clean and minimal — Inter or system font, neutral palette with one accent color, generous whitespace, Vercel-dashboard influence. Refine in Phase 1+ once real screens exist. |

### Drive Sync Caveat

The project lives inside a Google Drive synced folder. `node_modules/` and `dist/` will exist locally but should be excluded from Drive sync (via the Drive for Desktop client's selective sync settings) to avoid quota burn and slow installs. They're already gitignored. If Drive sync becomes painful in practice, escape hatch: move the code outside Drive (e.g., `~/Desktop/gtm-ai-roadmap/`) and keep the framework markdown + build plan here.

---

## Architecture

- **Stack:** Vite + React + TypeScript + Tailwind CSS
- **State:** Zustand with `persist` middleware → automatic `localStorage` sync
- **Persistence model:** Browser-only `localStorage`. No backend, no accounts, no analytics, no PII collection.
- **Backup pattern:** Auto-save on every change + JSON export/import + "last backed up" indicator + periodic backup nudges
- **Print/export:** `window.print()` with print-specific stylesheets for PRD and Accountability Compact PDF generation (no PDF library needed)
- **PWA:** `manifest.json` + minimal service worker for offline use and install-to-home-screen
- **Hosting:** Netlify, auto-deployed from GitHub `main` branch
- **No environment variables, no secrets, no server-side anything.** Truly zero ops.

---

## UX Pattern

**Detail page + ceremony wizards** — not a single end-to-end wizard.

- **Day-to-day editing** happens on a per-initiative detail page with collapsible/tabbed sections; all sections editable in any order; gate checklist sidebar shows what's needed to advance
- **Ceremony wizards** trigger only at meaningful moments:
  - New initiative intake (name, description, CARET scoring → priority score reveal)
  - Stage transition gate reviews
  - Pilot decision (Scale / Fix and Re-Pilot / Kill)
  - Accountability Compact signing (conditional and executed versions)

This mirrors Linear/Notion/Asana — focused capture for new items, free-form detail page for ongoing work.

---

## Phasing

Each phase is independently shippable. Could realistically launch after Phase 4 and add the rest based on real user feedback.

### Phase 0 — Foundations
- Local repo at `~/Desktop/gtm-ai-roadmap/`
- Vite + React + TS + Tailwind scaffolded
- Zustand + persist set up
- Routing skeleton
- GitHub repo created (public)
- Netlify connected, auto-deploy from `main`
- Empty shell deployed and verified live at the `*.netlify.app` URL

### Phase 1 — Initiative Registry + Persistence
- TypeScript data model for Initiative, CARET, PRD, Accountability Compact
- Registry list view (the dashboard)
- Add / edit / delete initiative
- Filter by stage, owner, sponsor, health
- JSON export ("Download backup")
- JSON import (drag-drop or file picker)
- "Last backed up: X days ago" indicator + gentle nudges

### Phase 2 — CARET Scoring
- Scoring form with each factor (C, A, R, E, T) and explainer copy
- Live Priority Score calculation
- Stage tracker on each initiative
- New initiative intake wizard (the first "ceremony")

### Phase 3 — Roadmap / Gantt View
- Timeline visualization showing initiatives across time
- Cumulative cognitive load meter (Effort sum vs. ~10 ceiling)
- Drag-to-reschedule
- Pilot window markers

### Phase 4 — PRD Builder
- Guided form covering all 13 PRD sections per initiative
- Live preview pane
- Print-to-PDF via `window.print()` with PRD-specific stylesheet
- Section completion indicators tied to gate checklist

### Phase 5 — Accountability Compact
- Fillable conditional version (Stage 2→3)
- Fillable executed version (Stage 4→5)
- Printable signed-version output
- Compact ceremony wizards

### Phase 6 — GA Tracking
- 90-day phase indicators (Onboard / Reinforce / Embed)
- Decay signal monitoring on Level 1 metrics
- Decoder ring per metric
- Manager coaching cadence tracker

### Phase 7 — Polish + PWA
- Landing page at `/` with framework intro, "Launch the app" CTA, privacy section, link to framework doc
- PWA manifest + service worker
- First-visit onboarding
- Empty states throughout
- Privacy footer
- Responsive design pass

### Phase 8 — Launch
- CNAME `roadmap.salesexcellence.xyz` → Netlify
- Final QA pass
- Distribution: LinkedIn post, newsletter, share with network

---

## What Lives Where

| Artifact | Location |
|---|---|
| Framework markdown (source of truth for the methodology) | This folder (also part of the public GitHub repo) |
| Build plan (this file) | This folder (also part of the public GitHub repo) |
| App code | This folder, with `node_modules/` and `dist/` excluded from Drive sync |
| Deployed app | `*.netlify.app` initially; `roadmap.salesexcellence.xyz` after Phase 8 |
| User data | Each user's browser `localStorage` only — never on any server |

---

## Open Questions

- Confirm git repo layout: rooted at the AI Roadmap Management folder, including framework markdown + build plan in the public repo (recommended), or code-only in a subfolder
- Confirm GitHub creation method: `gh` CLI (if authenticated) or manual via github.com
