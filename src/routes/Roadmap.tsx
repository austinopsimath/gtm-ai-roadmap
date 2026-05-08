import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useRoadmapStore } from '../store';
import { STAGE_LABELS, STAGE_ORDER, type Stage } from '../types';
import {
  buildMonthTicks,
  buildWeeklyLoad,
  COGNITIVE_LOAD_CEILING,
  computeTimeRange,
  dateToPercent,
  filterByStage,
  isFullyScheduled,
  toScheduled,
  todayPercent,
  type LoadTick,
  type ScheduledInitiative,
  type TimeRange,
} from '../lib/roadmap';

type StageFilter = 'all' | 'in-flight' | Stage;

export default function Roadmap() {
  const initiatives = useRoadmapStore((s) => s.initiatives);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromId = searchParams.get('from');
  const fromInitiative = fromId
    ? initiatives.find((i) => i.id === fromId)
    : null;
  const [stageFilter, setStageFilter] = useState<StageFilter>('in-flight');

  const filtered = useMemo(
    () => filterByStage(initiatives, stageFilter),
    [initiatives, stageFilter],
  );

  const scheduled = useMemo(
    () => filtered.map(toScheduled).filter((s): s is ScheduledInitiative => !!s),
    [filtered],
  );

  useEffect(() => {
    if (!fromId) return;
    const el = document.getElementById(`gantt-row-${fromId}`);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }, [fromId, scheduled.length]);

  const range = useMemo(() => computeTimeRange(scheduled), [scheduled]);
  const months = useMemo(() => buildMonthTicks(range), [range]);
  const loadTicks = useMemo(
    () => buildWeeklyLoad(scheduled, range),
    [scheduled, range],
  );
  const peakLoad = Math.max(
    COGNITIVE_LOAD_CEILING,
    ...loadTicks.map((t) => t.load),
    1,
  );
  const todayPct = useMemo(() => todayPercent(range), [range]);

  const unscheduledCount = filtered.filter((i) => !isFullyScheduled(i)).length;

  return (
    <div>
      <div className="mb-2 flex items-center gap-3">
        {fromInitiative ? (
          <button
            onClick={() =>
              navigate(`/initiatives/${fromInitiative.id}?stage=roadmap`)
            }
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to {fromInitiative.name}
          </button>
        ) : (
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Registry
          </Link>
        )}
      </div>
      <header className="mb-6 flex items-baseline justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Portfolio Roadmap
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Initiatives placed on a calendar with cumulative cognitive load.
            Higher Priority Score should sequence first; cumulative Effort (E)
            across active initiatives should not exceed{' '}
            <span className="font-semibold">~{COGNITIVE_LOAD_CEILING}</span> at
            any time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">Filter</label>
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as StageFilter)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500"
          >
            <option value="in-flight">In-flight (excludes killed)</option>
            <option value="all">All initiatives</option>
            {STAGE_ORDER.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABELS[s]} only
              </option>
            ))}
          </select>
        </div>
      </header>

      {scheduled.length === 0 ? (
        <EmptyState filteredCount={filtered.length} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <div style={{ minWidth: '900px' }}>
              <TimelineHeader months={months} />
              {scheduled.map((s) => (
                <GanttRow
                  key={s.initiative.id}
                  scheduled={s}
                  range={range}
                  highlighted={s.initiative.id === fromId}
                />
              ))}
              <CognitiveLoadLane
                loadTicks={loadTicks}
                range={range}
                peakLoad={peakLoad}
                todayPct={todayPct}
              />
            </div>
          </div>

          {unscheduledCount > 0 && (
            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <strong className="font-semibold">
                {unscheduledCount} initiative
                {unscheduledCount === 1 ? '' : 's'}
              </strong>{' '}
              {unscheduledCount === 1 ? 'is' : 'are'} not on the roadmap yet —
              missing one or more of Deploy / Pilot / GA dates. Open the
              initiative and use the timeline editor in the Stage 2 view to
              place {unscheduledCount === 1 ? 'it' : 'them'}.
            </div>
          )}

          <Legend />
        </>
      )}
    </div>
  );
}

function TimelineHeader({
  months,
}: {
  months: ReturnType<typeof buildMonthTicks>;
}) {
  return (
    <div className="grid grid-cols-[240px_1fr] border-b border-gray-200 bg-gray-50">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Initiative
      </div>
      <div className="relative h-9 border-l border-gray-200">
        {months.map((m, idx) => {
          const widthPct = 100 / months.length;
          return (
            <div
              key={idx}
              className="absolute top-0 flex h-full items-center border-r border-gray-200 px-2 text-xs text-gray-500"
              style={{
                left: `${idx * widthPct}%`,
                width: `${widthPct}%`,
              }}
            >
              {m.shortLabel}
              {(idx === 0 || m.date.getMonth() === 0) && (
                <span className="ml-1 text-gray-400">
                  {m.date.getFullYear()}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GanttRow({
  scheduled,
  range,
  highlighted,
}: {
  scheduled: ScheduledInitiative;
  range: TimeRange;
  highlighted: boolean;
}) {
  const navigate = useNavigate();
  const i = scheduled.initiative;
  const deployLeft = dateToPercent(scheduled.deployStart, range);
  const pilotLeft = dateToPercent(scheduled.pilotStart, range);
  const gaStartLeft = dateToPercent(scheduled.gaStart, range);
  const gaEndLeft = dateToPercent(scheduled.gaEnd, range);
  const todayPct = todayPercent(range);

  return (
    <div
      id={`gantt-row-${i.id}`}
      className={`grid cursor-pointer grid-cols-[240px_1fr] border-b border-gray-100 last:border-b-0 ${
        highlighted
          ? 'bg-blue-50 ring-2 ring-blue-300 ring-inset'
          : 'hover:bg-gray-50'
      }`}
      onClick={() => navigate(`/initiatives/${i.id}?stage=roadmap`)}
    >
      <div className="px-3 py-3">
        <div className="line-clamp-1 text-sm font-medium text-gray-900">
          {i.name}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-500">
          <span className="rounded bg-gray-100 px-1.5 py-0.5 font-medium text-gray-700">
            {STAGE_LABELS[i.stage]}
          </span>
          <span>E={i.caret.e || '—'}</span>
        </div>
      </div>
      <div className="relative h-14 border-l border-gray-200">
        {/* Today line */}
        {todayPct !== null && (
          <div
            className="absolute top-0 z-10 h-full w-px bg-red-400"
            style={{ left: `${todayPct}%` }}
          />
        )}
        {/* Deploy bar */}
        <PhaseBar
          left={deployLeft}
          right={pilotLeft}
          label="Deploy"
          colorClass="bg-indigo-100 text-indigo-900 border-indigo-300"
        />
        {/* Pilot bar */}
        <PhaseBar
          left={pilotLeft}
          right={gaStartLeft}
          label="Pilot"
          colorClass="bg-amber-100 text-amber-900 border-amber-300"
        />
        {/* GA bar */}
        <PhaseBar
          left={gaStartLeft}
          right={gaEndLeft}
          label="GA"
          colorClass="bg-emerald-100 text-emerald-900 border-emerald-300"
        />
      </div>
    </div>
  );
}

function PhaseBar({
  left,
  right,
  label,
  colorClass,
}: {
  left: number;
  right: number;
  label: string;
  colorClass: string;
}) {
  const width = Math.max(0, right - left);
  if (width <= 0) return null;
  return (
    <div
      className={`absolute top-1/2 flex h-7 -translate-y-1/2 items-center overflow-hidden rounded border px-2 text-[11px] font-medium ${colorClass}`}
      style={{ left: `${left}%`, width: `${width}%` }}
      title={label}
    >
      <span className="truncate">{label}</span>
    </div>
  );
}

function CognitiveLoadLane({
  loadTicks,
  peakLoad,
  todayPct,
}: {
  loadTicks: LoadTick[];
  range: TimeRange;
  peakLoad: number;
  todayPct: number | null;
}) {
  const ceilingPercent = (COGNITIVE_LOAD_CEILING / peakLoad) * 100;
  return (
    <div className="grid grid-cols-[240px_1fr] border-t-2 border-gray-200 bg-gray-50">
      <div className="px-3 py-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Cognitive load
        </div>
        <div className="mt-0.5 text-[11px] text-gray-500">
          Cumulative E during Pilot + GA. Ceiling ~{COGNITIVE_LOAD_CEILING}.
        </div>
      </div>
      <div className="relative h-20 border-l border-gray-200">
        {/* Today line */}
        {todayPct !== null && (
          <div
            className="absolute top-0 z-10 h-full w-px bg-red-400"
            style={{ left: `${todayPct}%` }}
          />
        )}
        {/* Ceiling line */}
        <div
          className="absolute right-0 left-0 border-t border-dashed border-red-300"
          style={{ bottom: `${ceilingPercent}%` }}
        />
        <div
          className="absolute right-1 text-[10px] font-medium text-red-500"
          style={{ bottom: `${ceilingPercent}%`, transform: 'translateY(-50%)' }}
        >
          {COGNITIVE_LOAD_CEILING}
        </div>
        {/* Bars */}
        {loadTicks.map((t, idx) => {
          const widthPct = 100 / loadTicks.length;
          const heightPct = (t.load / peakLoad) * 100;
          const overCeiling = t.load > COGNITIVE_LOAD_CEILING;
          return (
            <div
              key={idx}
              className={`absolute bottom-0 ${
                overCeiling ? 'bg-red-400' : 'bg-gray-700'
              }`}
              style={{
                left: `${idx * widthPct}%`,
                width: `${widthPct - 0.2}%`,
                height: `${heightPct}%`,
                opacity: t.load === 0 ? 0.05 : 0.85,
              }}
              title={`${t.date.toISOString().slice(0, 10)} — load ${t.load}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function EmptyState({ filteredCount }: { filteredCount: number }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
      <h2 className="text-lg font-semibold text-gray-900">
        No initiatives placed on the roadmap yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
        {filteredCount === 0
          ? 'No initiatives match the current filter. Try changing the filter or adding a new initiative.'
          : `${filteredCount} initiative${
              filteredCount === 1 ? '' : 's'
            } in your registry, but none have all three timeline dates set yet. Open an initiative and use the timeline editor in the Stage 2 view to place it on the roadmap.`}
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          ← Back to registry
        </Link>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-600">
      <span className="font-semibold uppercase tracking-wider text-gray-500">
        Legend
      </span>
      <LegendSwatch
        colorClass="bg-indigo-100 border-indigo-300"
        label="Deploy"
      />
      <LegendSwatch
        colorClass="bg-amber-100 border-amber-300"
        label="Pilot"
      />
      <LegendSwatch
        colorClass="bg-emerald-100 border-emerald-300"
        label="GA (90d window)"
      />
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-px bg-red-400" />
        Today
      </span>
    </div>
  );
}

function LegendSwatch({
  colorClass,
  label,
}: {
  colorClass: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-3 w-5 rounded border ${colorClass}`} />
      {label}
    </span>
  );
}
