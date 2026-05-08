import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRoadmapStore } from '../store';
import {
  STAGE_LABELS,
  STAGE_ORDER,
  calculatePriorityScore,
  type Health,
  type Stage,
} from '../types';
import HealthBadge from '../components/HealthBadge';
import StageBadge from '../components/StageBadge';

type StageFilter = Stage | 'all';
type HealthFilter = Health | 'all';

export default function Dashboard() {
  const initiatives = useRoadmapStore((s) => s.initiatives);
  const navigate = useNavigate();
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');
  const [healthFilter, setHealthFilter] = useState<HealthFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return initiatives
      .filter((i) => stageFilter === 'all' || i.stage === stageFilter)
      .filter((i) => healthFilter === 'all' || i.health === healthFilter)
      .filter(
        (i) =>
          term === '' ||
          i.name.toLowerCase().includes(term) ||
          i.initiativeOwner.toLowerCase().includes(term) ||
          i.executiveSponsor.toLowerCase().includes(term),
      )
      .map((i) => ({ ...i, score: calculatePriorityScore(i.caret) }))
      .sort((a, b) => {
        const sa = a.score ?? -1;
        const sb = b.score ?? -1;
        return sb - sa;
      });
  }, [initiatives, stageFilter, healthFilter, search]);

  if (initiatives.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      <header className="mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Initiative Registry
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {initiatives.length} initiative
            {initiatives.length === 1 ? '' : 's'} in your portfolio
            {filtered.length !== initiatives.length &&
              ` · ${filtered.length} matching filters`}
          </p>
        </div>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md border border-gray-200 bg-white p-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, owner, or sponsor"
          className="flex-1 min-w-[200px] rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value as StageFilter)}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500"
        >
          <option value="all">All stages</option>
          {STAGE_ORDER.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABELS[s]}
            </option>
          ))}
        </select>
        <select
          value={healthFilter}
          onChange={(e) => setHealthFilter(e.target.value as HealthFilter)}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500"
        >
          <option value="all">All health</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
          <option value="red">Red</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-300 bg-white p-12 text-center text-sm text-gray-500">
          No initiatives match the current filters.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Stage</th>
                <th className="px-4 py-3 font-medium">Health</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Sponsor</th>
                <th className="px-4 py-3 text-right font-medium">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr
                  key={i.id}
                  onClick={() => navigate(`/initiatives/${i.id}`)}
                  className="cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{i.name}</div>
                    {i.description && (
                      <div className="mt-0.5 line-clamp-1 text-xs text-gray-500">
                        {i.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StageBadge stage={i.stage} />
                  </td>
                  <td className="px-4 py-3">
                    <HealthBadge health={i.health} />
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {i.initiativeOwner || (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {i.executiveSponsor || (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-gray-900">
                    {i.score === null ? (
                      <span className="text-gray-400">—</span>
                    ) : (
                      i.score.toFixed(2)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
        Welcome to GTM AI Roadmap Management
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600">
        An interactive companion to the framework. Start by adding the GTM AI
        initiatives your organization is running, has run, or is considering.
        Your data lives in your browser only — never sent to any server.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          to="/initiatives/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Add your first initiative
        </Link>
        <a
          href="https://github.com/austinopsimath/gtm-ai-roadmap/blob/main/GTM_AI_Roadmap_Framework.md"
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Read the framework
        </a>
      </div>
    </div>
  );
}
