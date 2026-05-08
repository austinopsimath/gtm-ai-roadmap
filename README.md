# GTM AI Roadmap Management

An interactive companion to the **GTM AI Roadmap Management** framework — a structured operating system for selecting, sequencing, building, piloting, and embedding GTM AI initiatives.

The framework itself lives at [GTM_AI_Roadmap_Framework.md](GTM_AI_Roadmap_Framework.md). This app operationalizes it.

## What it is

A free, browser-based tool for GTM leaders and operators to:

- Maintain an Initiative Registry across the full portfolio
- Score initiatives with the CARET methodology (Complexity, Alignment, Results, Effort, Timeline)
- Visualize the roadmap with cumulative cognitive load constraints
- Author the GTM AI Initiative PRD with all 13 sections
- Capture the Accountability Compact at both gate moments (conditional and executed)
- Track the 90-day GA reinforcement arc

## What it isn't

- Not a SaaS — there are no accounts, no logins, and no servers
- Not a database — your data lives in your browser's `localStorage`, never transmitted anywhere
- Not a tracker — no analytics, no telemetry, nothing sent off your device

## Privacy model

Everything you enter is stored locally in the browser you're using. We have no way of seeing it. The trade-off: if you clear your browser data or switch devices, the app won't have your data unless you've exported a backup. The app makes this easy with one-click JSON export and import.

## Self-hosting

Because the app is purely static, anyone can fork this repo and host their own copy on Netlify, Cloudflare Pages, Vercel, or any static host. No backend setup required.

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS v4
- Zustand (with `persist` middleware) for state
- React Router for navigation
- Hosted on Netlify, deployed automatically on every push to `main`

## Status

Early development. The framework is finalized; the app is being built phase by phase. See [BUILD_PLAN.md](BUILD_PLAN.md) for the roadmap.

## License

Free to use, fork, and adapt.
