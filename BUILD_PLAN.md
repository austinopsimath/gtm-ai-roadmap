# GTM AI Roadmap Management — Build Plan

A static, free-to-use, browser-persisted PWA that operationalizes the framework defined in [GTM_AI_Roadmap_Framework.md](GTM_AI_Roadmap_Framework.md).

**Live:** https://gtm-ai-roadmap.jerry-0de.workers.dev/

---

## Locked Decisions

| Decision | Choice |
|---|---|
| **App name** | GTM AI Roadmap Management |
| **Repo** | https://github.com/austinopsimath/gtm-ai-roadmap (public) |
| **Code location** | `/Users/jerrypharr/.../AI Agents/AI Roadmap Management/` (Google Drive synced) |
| **Hosting** | Cloudflare Pages (Workers + Static Assets), free tier |
| **Domain plan** | Currently on `*.workers.dev` Cloudflare default. Pending: CNAME `roadmap.salesexcellence.xyz` → Cloudflare in Phase 8 |
| **Repo visibility** | Public on GitHub |
| **Build cadence** | Claude drives; checkpoint at each phase boundary and on non-trivial mid-phase design calls |
| **Visual style** | Clean and minimal — Inter / system font, neutral palette with one accent color, generous whitespace |

### Hosting history

We started on Netlify free tier (300 credits/month, 15 credits per production deploy = ~20 deploys/month). Hit the credit ceiling around Phase 3 polish. Migrated to Cloudflare Pages for its 500-builds/month free tier with no bandwidth caps and no commercial-use TOS restrictions. The Netlify deployment is now retired.

---

## Architecture

- **Stack:** Vite 6 + React 18 + TypeScript + Tailwind CSS v4
- **State:** Zustand with `persist` middleware → automatic `localStorage` sync
- **Persistence model:** Browser-only `localStorage`. No backend, no accounts, no analytics, no PII collection.
- **Backup pattern:** Auto-save on every change + JSON export/import + "last backed up" indicator + periodic backup nudges
- **Print/export:** `window.print()` with a print stylesheet on the read-only PRD view; "Copy as Markdown" for portable export (Phase 4b)
- **Routing:** React Router 6 with URL-driven state for `viewedStage` (`?stage=`) and Roadmap "from" tracking (`?from=`)
- **Hosting:** Cloudflare Pages, auto-deployed from GitHub `main` branch via Wrangler
- **No environment variables, no secrets, no server-side anything.** Truly zero ops.

---

## UX Pattern

**Detail page + ceremony wizards** — not a single end-to-end wizard.

- **Day-to-day editing** happens on a per-initiative detail page with a stage-aware lifecycle section (clickable progress bar, contextual checklist, inline editors per stage) plus a separate "Profile" section for static reference data
- **Ceremony wizards** trigger only at meaningful moments:
  - New initiative intake (name, description, business rationale, ownership)
  - CARET scoring (Roster + per-factor panel scoring with divergence detection)
  - Stage transition gate reviews
  - Pilot decision (Proceed to GA / Fix and Re-Pilot / Kill) — Phase 6
  - Accountability Compact execution (Stage 6, Commitment) — Phase 7
- **PRD form** is its own dedicated route at `/initiatives/:id/prd` — 14 collapsible sections with a sticky table-of-contents sidebar showing per-section completion

---

## Phasing

Each phase is independently shippable. Already shipped → ✅. Planned → ☐.

### Phase 0 — Foundations ✅
- Vite + React + TS + Tailwind scaffolded
- Zustand + persist set up
- Routing skeleton
- GitHub repo created (public)
- Initial deployment (started on Netlify, migrated to Cloudflare Pages mid-phase 3)

### Phase 1 — Initiative Registry + Persistence ✅
- TypeScript data model for Initiative, CARET, PRD, Accountability Compact
- Registry list view (Dashboard)
- Add / edit / delete initiative
- Filter by stage, owner, sponsor, health
- JSON export / import for backup
- "Last backed up" indicator with backup nudge banner

### Phase 2 — CARET Scoring ✅
- Multi-step ceremony wizard at `/initiatives/:id/score`
- Per-factor explainer content lifted directly from the framework
- Panel roster with multi-stakeholder scoring per factor
- Divergence detection (≥ 2 points) with required discussion notes
- Per-factor "N/A" sentinel for stakeholders outside their domain
- Live priority score reveal on the review step
- CARET breakdown with panelist breakdown surfaced on the Stage 1 lifecycle view

### Phase 3 — Calendar + Portfolio Roadmap ✅
- **Phase 3a:** per-initiative timeline editor in Stage 3 (Calendar) lifecycle view with Deploy/Pilot/GA dates and date-order validation
- **Phase 3b:** portfolio Gantt at `/roadmap` with three colored bars per initiative, cumulative cognitive load lane (Effort summed for initiatives in Pilot or GA's first 90 days), today indicator, stage filter
- Lifecycle progress bar made clickable for cross-stage navigation
- URL-driven `viewedStage` so browser back works
- Inline path/vendor editor in Stage 2 PRD view (later moved when PRD became its own stage)

### Phase 4a — PRD Builder ✅
- 14-section PRD form at `/initiatives/:id/prd` with auto-save
- Sticky sidebar table of contents with per-section completion checks
- Sections collapsed by default; click headers (or sidebar) to open; Expand all / Collapse all
- Auto-derives completion for sections that map to existing initiative profile data
- New profile fields: Business Rationale, Primary / Secondary Audiences, Usage Frequency, GTM Motions
- AI GTM Motions Taxonomy: ~150 motions across 8 categories (Awareness, Education, Selection, Onboard, Impacting, Growth, Operational Foundations, Enablement Foundations) with custom MotionsPicker component (collapsible categories, search across all, chips for selected)
- Level 1 / Level 2 metric picklists (in addition to Level 3)
- Risk Assessment with four dispositions (accept / mitigate / escalate / not applicable)
- Pilot Plan decision criteria labeled **Proceed to GA** / Fix and Re-Pilot / Kill
- Workstream pre-population from framework's Build / Buy templates
- Conditional Accountability Compact (Section 14): four commitment cards with editable [X] placeholders, conditional sign-off status, escalation callout when status is "No"
- Lifecycle Stage 2 PRD checklist auto-checks all 14 sections via `isPRDSectionComplete()`

### Phase 4b — Printable PRD View ✅
- `/initiatives/:id/prd/view` standalone read-only PRD document, rendered outside the app chrome so it reads as a real document
- All 14 sections render, with muted "Not yet documented" placeholders for fields not yet filled in
- Print stylesheet for `window.print()` → PDF export; `document.title` set to `<name> - PRD - <date>` so the saved PDF and print header use a meaningful filename
- "Copy as Markdown" button exports the full PRD (`lib/prdMarkdown.ts`) for pasting into Notion / Docs / Slack
- Three-part information architecture (What & Why / Deployment / Implementation) shown as in-document Part dividers plus a sticky grouped table-of-contents sidebar; the same grouping is mirrored into the PRD edit page

> **Re-sequenced (2026-05-21).** The original plan jumped from the PRD straight
> to the Compact execution, skipping real Deploy and Pilot work. Phases 5–8 now
> follow the lifecycle in order, and the Accountability Compact execution has
> been promoted to its own seventh stage — **Commitment** — between Pilot and GA,
> to reinforce its importance (the same move that made PRD its own stage). The
> lifecycle is now: Prioritize → PRD → Calendar → Deploy → Pilot → Commitment → GA.

### Phase 5 — Deploy (Stage 4) ☐
- Workstream tracker: a per-workstream status (Not started / In progress / Blocked / Done) on the PRD §12 workstreams, edited inline in the Stage 4 lifecycle view, with an "X of N done" progress count; confirm any TBD owners/dates here
- Measurement-readiness check: each PRD §6 metric gets a "tracking mechanism confirmed operational" checkbox — readiness, not data collection
- PRD revision: a Stage 4 prompt to revise the PRD (especially Systems §8, Data Architecture §9, Risk §10) plus a "Mark PRD as revised" action that sets the approval status to `revised` and stamps a date — a lightweight flag, no version history

### Phase 6 — Pilot (Stage 5) ☐
- Per-metric pilot result entry: a free-text `result` value per PRD §6 metric, shown as baseline → target → result across all three layers
- Qualitative feedback capture: three buckets — What worked / What didn't / What's missing & should be added
- Proceed / Fix-and-Re-Pilot / Kill decision recorder: surfaces the PRD §11 pre-agreed criteria next to the metric results and feedback; records the outcome + rationale + date. The outcome drives the lifecycle — Proceed advances to Commitment, Kill moves the initiative to Killed, Fix keeps it in Pilot

### Phase 7 — Commitment (Stage 6 — NEW lifecycle stage) ☐
- A new seventh lifecycle stage between Pilot and GA — `STORE_VERSION` bump and a new `'commitment'` Stage value
- Compact execution ceremony at `/initiatives/:id/compact/execute`: converts the conditional Compact (PRD §14) into an executed/binding state
- Displays the four committed terms as binding agreement text, with the numbers filled in from §14
- Execution checklist: signed, managers briefed, coaching cadence calendared, exec communication scheduled, accountability check-in dates set — plus the GA-readiness items (enablement ready, dashboard built, ownership continuity)
- "Exec reluctant → escalate" path mirroring the §14 "No" callout

### Phase 8 — GA Tracking (Stage 7) ☐
- 90-day reinforcement arc tracker (Days 1–30 Onboard / 31–60 Reinforce / 61–90 Embed)
- Manager Decoder Ring per behavior metric
- Decay signal monitoring on Level 1 metrics
- Coaching cadence compliance dashboard

### Phase 9 — Polish + PWA ☐
- Landing page at `/` (separate from app dashboard)
- PWA manifest + service worker
- First-visit onboarding flow
- Empty states throughout
- Privacy footer
- Responsive design pass
- Code-split the GTM Motions taxonomy (lazy-load when entering PRD)

### Phase 10 — Launch ☐
- CNAME `roadmap.salesexcellence.xyz` → Cloudflare
- Final QA pass
- Distribution: LinkedIn post, newsletter, share with network

---

## What Lives Where

| Artifact | Location |
|---|---|
| Framework markdown (source of truth for the methodology) | This folder (also part of the public GitHub repo) |
| Build plan (this file) | This folder (also part of the public GitHub repo) |
| App code | This folder, with `node_modules/` and `dist/` excluded from Drive sync |
| Deployed app | `gtm-ai-roadmap.jerry-0de.workers.dev` (Cloudflare). Pending: `roadmap.salesexcellence.xyz` after Phase 8 |
| User data | Each user's browser `localStorage` only — never on any server |

### Drive Sync Caveat

The project lives inside a Google Drive synced folder. `node_modules/` and `dist/` exist locally but should be excluded from Drive sync (via the Drive for Desktop client's selective sync settings) to avoid quota burn and slow installs. They're already gitignored. If Drive sync becomes painful in practice, escape hatch: move the code outside Drive (e.g., `~/Desktop/gtm-ai-roadmap/`) and keep the framework markdown + build plan here.
