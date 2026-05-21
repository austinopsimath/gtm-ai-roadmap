# Session Handoff — GTM AI Roadmap Management

This doc orients a fresh Claude Code session picking up this project. Read it
first, then the three canonical docs it points to.

---

## 1. What this project is

A free, browser-based web app that operationalizes the **GTM AI Roadmap
Management** framework — a structured operating system for selecting,
sequencing, building, piloting, and embedding GTM AI initiatives.

- Static React single-page app. **No backend.** All user data lives in the
  browser's `localStorage`. No accounts, no servers, no analytics.
- Given away free to GTM leaders/practitioners as a thought-leadership artifact.
- Open-source and forkable so security-conscious orgs can self-host.

**Live app:** https://gtm-ai-roadmap.jerry-0de.workers.dev/
**Repo:** https://github.com/austinopsimath/gtm-ai-roadmap (public)

---

## 2. Canonical docs (read these next)

| Doc | What it is |
|---|---|
| [GTM_AI_Roadmap_Framework.md](GTM_AI_Roadmap_Framework.md) | The methodology. The single source of truth for *what the framework is*. The app implements this. |
| [BUILD_PLAN.md](BUILD_PLAN.md) | Phasing, architecture decisions, what's shipped vs planned. |
| [README.md](README.md) | Public-facing project overview. |

The framework markdown and the app can drift. They have been kept in sync
**manually** — when the app's structure changes, update the markdown
deliberately.

---

## 3. Environment & how to work

- **Project folder** (note the spaces — always quote paths):
  `/Users/jerrypharr/Library/CloudStorage/GoogleDrive-jerry.pharr@gmail.com/My Drive/Career Work/Thought leadership/From Me/AI Agents/AI Roadmap Management`
- The folder is **Google Drive synced**. `node_modules/` and `dist/` are
  gitignored and should be excluded from Drive sync (Drive-for-Desktop
  selective sync) to avoid quota burn / slow installs.
- **Git:** `gh` CLI is authenticated as GitHub user `austinopsimath`. The repo
  root is the project folder; framework markdown and these docs are committed
  alongside the app code.
- **Commands:**
  - `npm install` — dependencies
  - `npm run dev` — local dev server (localhost) for iteration
  - `npm run build` — `tsc -b && vite build`; this is the verification gate
  - There is **no automated test suite**. Verify with `npm run build` (catches
    type errors) then manual testing on the live URL after deploy.

---

## 4. Code structure

```
src/
  App.tsx              — route definitions
  main.tsx             — entry point
  index.css            — Tailwind v4 import + theme
  types/index.ts       — ALL data types, factories (createInitiative etc.),
                         helpers (calculatePriorityScore, isPRDSectionComplete deps)
  store/index.ts       — Zustand store + persist middleware + version migration
  routes/              — Dashboard, NewInitiative, EditInitiative,
                         InitiativeDetail, ScoreInitiative, Roadmap, PRDEdit,
                         PRDView (standalone read-only PRD; routed OUTSIDE
                         AppLayout so it has no app chrome)
  components/          — AppLayout, InitiativeForm, Combobox, MotionsPicker,
                         LifecycleSection, TimelineEditor, PathVendorEditor,
                         PRDLauncher, StageBadge, HealthBadge
  constants/           — caret.ts (factor copy), picklists.ts (audiences/
                         tech/systems/metrics), motions.ts (GTM taxonomy),
                         workstreams.ts (Build/Buy templates)
  lib/                 — lifecycle.ts (stage logic), prdProgress.ts (PRD
                         section completion), roadmap.ts (Gantt math),
                         backup.ts (JSON export/import), time.ts
                         (incl. formatDate — date-only-safe),
                         prdMarkdown.ts (Copy-as-Markdown for the PRD view)
wrangler.jsonc         — Cloudflare deploy config (SPA routing)
```

- **State:** Zustand store, persisted to `localStorage` under key
  `gtm-ai-roadmap-storage`. The `Initiative` type is the core entity; it
  carries a nested `prd: PRD` object.
- **Picklists:** the reusable `Combobox` component handles single/multi-select
  with a "+ Create" affordance. Custom additions persist in the store.
- **GTM Motions:** `MotionsPicker` is a bespoke component for the ~150-item
  taxonomy (collapsible categories, search, chips).

---

## 5. Deploy workflow

- Cloudflare Pages auto-deploys on every push to `main`. Push → Cloudflare
  runs `npm run build` → `wrangler deploy` → live in ~30–60s.
- SPA routing is configured in `wrangler.jsonc`:
  `assets.not_found_handling: "single-page-application"` +
  `assets.directory: "./dist"`. Do **not** add a Netlify-style
  `public/_redirects` file — Cloudflare's validator rejects it.
- Currently on the Cloudflare default `*.workers.dev` URL. Phase 8 will
  CNAME `roadmap.salesexcellence.xyz` to Cloudflare.
- Batch commits before pushing where reasonable. (Originally a Netlify
  free-credit constraint; less critical on Cloudflare's 500-builds/month
  free tier, but still good hygiene.)

---

## 6. Data model & store versioning — IMPORTANT

`STORE_VERSION` in `src/store/index.ts` is currently **8**.

**Any time you add a field to `Initiative` (or `PRD`), you MUST:**
1. Add the field to the `Initiative` / `PRD` type in `types/index.ts`
2. Add it to the `createInitiative` (or relevant) factory with a default
3. Add it to the `LegacyInitiativeV1` type as optional
4. Backfill it in `migrateLegacyInitiative` with a default
5. Bump `STORE_VERSION`

Skip any of these and existing users' persisted data breaks on load. The
migration also already handles a historical rename (`audiencesServed` →
`primaryAudiences`) — follow that pattern for future renames.

JSON export/import (`lib/backup.ts`) is the user's portability mechanism;
the backup file format is `{ version, exportedAt, initiatives }`.

---

## 7. What's been accomplished (Phases 0–4b, all shipped)

- **Phase 0** — Scaffold, deploy pipeline.
- **Phase 1** — Initiative Registry: add/edit/delete, filters, JSON backup
  export/import, backup nudges.
- **Phase 2** — CARET scoring ceremony wizard: panel roster, per-factor
  multi-stakeholder scoring, divergence detection (≥2 points), N/A handling,
  priority score reveal.
- **Phase 3** — Calendar stage timeline editor + portfolio Gantt at `/roadmap`
  with a cumulative cognitive-load lane.
- **Phase 4a** — The 14-section PRD builder at `/initiatives/:id/prd`:
  auto-saving, collapsible sections, sticky TOC sidebar, GTM Motions taxonomy
  picker, Conditional Accountability Compact (Section 14).
- **Phase 4b** — Printable PRD view at `/initiatives/:id/prd/view`: a
  standalone read-only document (routed outside AppLayout), all 14 sections
  with placeholders, `window.print()` → PDF, "Copy as Markdown", and a
  three-part grouping (What & Why / Deployment / Implementation) shown as
  Part dividers + a grouped TOC sidebar — mirrored into the PRD edit page.

Structural decisions made along the way:
- **Lifecycle stages:** the shipped code has six — Prioritize → PRD → Calendar
  → Deploy → Pilot → GA. PRD is its own stage (Stage 2), *before* Calendar —
  you plan before you schedule. A seventh stage, **Commitments** (the
  Accountability Compact execution), is planned between Pilot and GA in
  Phase 7 — see Section 9. The framework markdown already reflects all seven.
- **Naming quirk:** the Calendar stage's internal key is still `'roadmap'`
  (label-only rename, to avoid a data migration). `stage: 'roadmap'` in data
  means "Calendar" in the UI. The portfolio `/roadmap` route is a separate
  thing — deliberately distinct names.
- The detail page = a stage-aware lifecycle section (clickable progress bar +
  per-stage checklist + inline editors) plus a static "Profile" section.
- Migrated hosting Netlify → Cloudflare Pages mid-Phase-3 (Netlify free
  credits ran out).

---

## 8. Lessons learned / gotchas

1. **Cloudflare Pages requires Vite 6+.** Wrangler's auto-config rejects Vite
   5. We're on Vite 6.4.2.
2. **SPA routing:** use `wrangler.jsonc` (`not_found_handling:
   "single-page-application"`), NOT a Netlify `_redirects` file — Cloudflare
   flags `/* /index.html 200` as an infinite loop.
3. **`wrangler.jsonc` at repo root needs `assets.directory: "./dist"`** or
   the deploy fails validation.
4. **Store migrations are mandatory** for new fields — see Section 6. This is
   the single easiest way to break the app.
5. **TypeScript strict mode is on** (`noUnusedLocals`/`noUnusedParameters`).
   Unused imports/vars fail `npm run build`. Clean them before pushing.
6. **Verify `npm run build` before every push.** No test suite to catch
   regressions otherwise.
7. **Framework markdown ↔ app sync is manual.** If you change the app's
   structure, update `GTM_AI_Roadmap_Framework.md` deliberately in the same
   batch of work.
8. **Drive sync + `node_modules`** can be slow. Expect it; it's not a bug.
9. **The user works in checkpoints** — see Section 10.
10. **Standalone full-page routes** (e.g. `PRDView`) belong OUTSIDE the
    `<Route element={<AppLayout />}>` block in `App.tsx`, so they render with
    no app header/footer. React Router ranks by specificity, so route order
    within `<Routes>` does not matter.
11. **Hard-refresh after deploy when reviewing.** This is a static SPA — a
    browser tab opened before a deploy keeps running the old JS bundle until
    a full reload. A new route can appear "broken" (it falls through to the
    catch-all → `/`) purely because the open tab predates the deploy. Tell
    the user to hard-refresh the live URL before testing new routes.

---

## 9. What's left — recommended order

From [BUILD_PLAN.md](BUILD_PLAN.md). The plan was **re-sequenced 2026-05-21**
to walk the lifecycle in order — it previously jumped from PRD straight to the
Compact execution, skipping real Deploy and Pilot work. Recommended sequence:

1. **Phase 5 — Deploy (Stage 4)** *(do next)*. Workstream tracker on the PRD
   §12 workstreams (per-workstream status), a measurement-readiness check over
   the §6 metrics, and a lightweight "Mark PRD as revised" flag.
2. **Phase 6 — Pilot (Stage 5).** Per-metric result entry (baseline → target →
   result), qualitative feedback (What worked / didn't / missing), and the
   Proceed / Fix-and-Re-Pilot / Kill decision recorder.
3. **Phase 7 — Commitments (Stage 6 — NEW stage).** A new seventh lifecycle
   stage between Pilot and GA, in two sections: the Executive Sponsor's
   Commitments (the Accountability Compact execution ceremony) and the
   Initiative Owner's Commitments (GA-readiness). Promoted from a checklist
   item to its own stage to reinforce its importance (same move as making
   PRD its own stage). Requires a `STORE_VERSION` bump and a new
   `'commitments'` Stage value.
4. **Phase 8 — GA Tracking (Stage 7).** The 90-day reinforcement arc
   (Onboard / Reinforce / Embed), Manager Decoder Ring, decay-signal
   monitoring.
5. **Phase 9 — Polish + PWA.** Landing page at `/`, installable PWA,
   first-visit onboarding, empty states, responsive pass, code-split the GTM
   Motions taxonomy.
6. **Phase 10 — Launch.** CNAME `roadmap.salesexcellence.xyz` → Cloudflare,
   final QA, distribution.

The lifecycle is now seven stages: Prioritize → PRD → Calendar → Deploy →
Pilot → Commitments → GA. The framework markdown reflects all seven; the app
code stays at six until Phase 7 ships the `'commitments'` stage.

---

## 10. Working style / cadence

- **Claude drives the build; checkpoint at each phase boundary** and on any
  non-trivial mid-phase design call. Don't run multiple phases without a
  check-in.
- Surface design decisions as explicit questions before building, not after.
- Keep commits focused; write descriptive commit messages.
- The user reviews on the live Cloudflare URL after each push.

---

## 11. Deferred decisions (discussed, intentionally punted)

- **Panel-capture mode richness** — CARET scoring captures panelist scores;
  deeper features (weighting, score history) were deferred.
- **PRD revision history / version tracking** — the framework mentions
  revising the PRD at the Stage 4 gate; the app currently keeps a single
  current state, no version log.
- **Drag-to-reschedule on the Gantt** — timeline editing is manual date entry.
- **Code-splitting the GTM Motions taxonomy** — it's ~150 items inline;
  candidate for lazy-loading in Phase 7.
- **Real-time collaboration / multi-user** — out of scope by design; JSON
  export/import is the only sharing mechanism.
- **Custom domain** — still on `*.workers.dev`; swap is Phase 8.
