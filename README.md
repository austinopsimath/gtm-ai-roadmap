# GTM AI Roadmap Management

**Live app:** https://gtm-ai-roadmap.jerry-0de.workers.dev/

An interactive companion to the **GTM AI Roadmap Management** framework — a structured operating system for selecting, sequencing, building, piloting, and embedding GTM AI initiatives.

The framework itself lives at [GTM_AI_Roadmap_Framework.md](GTM_AI_Roadmap_Framework.md). This app operationalizes it.

## What it is

A free, browser-based tool for GTM leaders and operators to:

- Maintain an **Initiative Registry** across the full portfolio
- Score initiatives with the **CARET methodology** (Complexity, Alignment, Results, Effort, Timeline) — multi-stakeholder panel scoring with divergence detection
- Author the **14-section PRD** as the framework's gate artifact, including the conditional Accountability Compact (Section 14)
- Tag initiatives against the **AI GTM Motions Taxonomy** to surface portfolio overlaps and cognitive-load risks
- Visualize the **portfolio Roadmap (Gantt)** with cumulative cognitive load constraints
- Walk through the **CARET scoring ceremony**, **Compact execution**, and **90-day GA reinforcement arc** as ceremonies — not free-form notes

## What it isn't

- Not a SaaS — there are no accounts, no logins, and no servers
- Not a database — your data lives in your browser's `localStorage`, never transmitted anywhere
- Not a tracker — no analytics, no telemetry, nothing sent off your device

## Privacy model

Everything you enter is stored locally in the browser you're using. We have no way of seeing it. The trade-off: if you clear your browser data or switch devices, the app won't have your data unless you've exported a backup. The app makes this easy with one-click JSON export and import.

## Self-hosting

Because the app is purely static, anyone can fork this repo and host their own copy on Cloudflare Pages, Netlify, Vercel, or any static host. No backend setup required.

## Tech stack

- Vite 6 + React 18 + TypeScript
- Tailwind CSS v4
- Zustand (with `persist` middleware) for state
- React Router 6 for navigation
- Hosted on Cloudflare Pages (Workers + Static Assets), deployed automatically on every push to `main`

## Status

Phases 0–4a shipped. PRD Builder (14-section auto-saving form with the AI GTM Motions Taxonomy and Conditional Accountability Compact) is fully usable. See [BUILD_PLAN.md](BUILD_PLAN.md) for what's built and what's planned.

Currently up next: Phase 4b printable PRD view, then Phase 5 (Compact execution ceremony), Phase 6 (GA tracking), Phase 7 (PWA polish), Phase 8 (custom-domain launch).

## License

Free to use, fork, and adapt.
