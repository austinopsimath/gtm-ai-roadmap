import { useRoadmapStore } from '../store';

export default function Dashboard() {
  const initiatives = useRoadmapStore((state) => state.initiatives);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          GTM AI Roadmap Management
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          An interactive companion to the framework. Your data lives in your browser
          — nothing is sent to any server.
        </p>
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-8">
        <h2 className="text-lg font-medium text-gray-900">Initiative Registry</h2>
        <p className="mt-1 text-sm text-gray-600">
          {initiatives.length === 0
            ? 'No initiatives yet. The Registry will appear here.'
            : `${initiatives.length} initiative${initiatives.length === 1 ? '' : 's'} tracked.`}
        </p>
        <div className="mt-6 rounded-md border border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm text-gray-500">
            Phase 0 shell — the real Registry, scoring, roadmap, PRD, and Compact
            views ship in subsequent phases.
          </p>
        </div>
      </section>

      <footer className="mt-12 text-xs text-gray-400">
        Free and open-source.{' '}
        <a
          href="https://github.com/austinopsimath/gtm-ai-roadmap"
          className="underline hover:text-gray-600"
        >
          View source on GitHub
        </a>
        .
      </footer>
    </div>
  );
}
