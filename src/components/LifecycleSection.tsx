import { useNavigate } from 'react-router-dom';
import { useRoadmapStore } from '../store';
import {
  factorDivergence,
  isNA,
  STAGE_LABELS,
  type Initiative,
  type Stage,
} from '../types';
import {
  getStageInfo,
  PROGRESSION,
  type LifecycleTask,
  type StageInfo,
} from '../lib/lifecycle';
import { FACTOR_ORDER, FACTORS } from '../constants/caret';
import { formatRelativeTime } from '../lib/time';

interface Props {
  initiative: Initiative;
  viewedStage: Stage;
  onSelectStage: (stage: Stage) => void;
}

export default function LifecycleSection({
  initiative,
  viewedStage,
  onSelectStage,
}: Props) {
  const isTerminal =
    initiative.stage === 'killed' || initiative.stage === 'wound_down';

  if (isTerminal) {
    return (
      <section className="rounded-lg border border-gray-300 bg-gray-50 p-5 text-sm text-gray-700">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Lifecycle
        </div>
        <p className="mt-1">
          This initiative was{' '}
          <strong className="font-semibold text-gray-900">
            {STAGE_LABELS[initiative.stage].toLowerCase()}
          </strong>
          . The Roadmap Owner can move it back into an earlier stage by
          editing the initiative if circumstances change.
        </p>
      </section>
    );
  }

  const info = getStageInfo(initiative, viewedStage);

  return (
    <section className="space-y-4">
      <ProgressBar
        currentStage={initiative.stage}
        viewedStage={viewedStage}
        onSelect={onSelectStage}
      />
      <StagePanel
        initiative={initiative}
        info={info}
        currentStage={initiative.stage}
        onJumpToCurrent={() => onSelectStage(initiative.stage)}
      />
    </section>
  );
}

function ProgressBar({
  currentStage,
  viewedStage,
  onSelect,
}: {
  currentStage: Stage;
  viewedStage: Stage;
  onSelect: (stage: Stage) => void;
}) {
  const currentIdx = PROGRESSION.indexOf(currentStage);
  const viewedIdx = PROGRESSION.indexOf(viewedStage);

  return (
    <div>
      <div className="flex items-center gap-1">
        {PROGRESSION.map((s, idx) => {
          const completed = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isViewed = idx === viewedIdx;
          const fill = completed
            ? 'bg-emerald-500'
            : isCurrent
              ? 'bg-gray-900'
              : 'bg-gray-200';
          return (
            <button
              key={s}
              type="button"
              onClick={() => onSelect(s)}
              className={`group relative h-1.5 flex-1 rounded-full transition ${fill} hover:opacity-90`}
              title={`View Stage ${idx + 1}: ${STAGE_LABELS[s]}`}
            >
              {isViewed && (
                <span className="absolute -inset-y-1 inset-x-0 rounded-full ring-2 ring-gray-900 ring-offset-2 ring-offset-gray-50" />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-1">
        {PROGRESSION.map((s, idx) => {
          const completed = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isViewed = idx === viewedIdx;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onSelect(s)}
              className={`group flex-1 text-center text-xs ${
                isViewed
                  ? 'font-semibold text-gray-900'
                  : completed
                    ? 'text-emerald-700 hover:text-emerald-900'
                    : isCurrent
                      ? 'text-gray-700 hover:text-gray-900'
                      : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {completed && <span className="mr-0.5">✓</span>}
              {STAGE_LABELS[s]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StagePanel({
  initiative,
  info,
  currentStage,
  onJumpToCurrent,
}: {
  initiative: Initiative;
  info: StageInfo;
  currentStage: Stage;
  onJumpToCurrent: () => void;
}) {
  const navigate = useNavigate();
  const updateInitiative = useRoadmapStore((s) => s.updateInitiative);
  const isViewingCurrent = info.isCurrent;

  const handleAction = (
    action:
      | { kind: 'navigate'; label: string; target: string }
      | { kind: 'advance'; label: string; target: string },
  ) => {
    if (action.kind === 'navigate') {
      navigate(action.target);
    } else {
      updateInitiative(initiative.id, { stage: action.target as Stage });
    }
  };

  // Hide advance actions when viewing a non-current stage. Navigate actions
  // (like Re-score) stay available regardless.
  const primary =
    info.primaryAction &&
    (info.primaryAction.kind === 'navigate' || isViewingCurrent)
      ? info.primaryAction
      : undefined;
  const secondary = info.secondaryAction;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {info.isPast
              ? 'Past stage'
              : info.isFuture
                ? 'Upcoming stage'
                : 'Where you are'}
          </div>
          <h2 className="mt-0.5 text-lg font-semibold text-gray-900">
            {info.headline}
          </h2>
        </div>
        {!isViewingCurrent && (
          <button
            onClick={onJumpToCurrent}
            className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
          >
            Back to current ({STAGE_LABELS[currentStage]})
          </button>
        )}
      </header>

      {info.body && <p className="mt-2 text-sm text-gray-600">{info.body}</p>}

      {info.tasks.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Stage checklist
          </div>
          <ul className="space-y-1.5">
            {info.tasks.map((t, idx) => (
              <TaskRow key={idx} task={t} />
            ))}
          </ul>
        </div>
      )}

      {info.stage === 'prioritize' && <CaretBreakdown initiative={initiative} />}

      {info.offlineNote && isViewingCurrent && (
        <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          <strong className="font-semibold">Heads up:</strong>{' '}
          {info.offlineNote}
        </div>
      )}

      {(primary || secondary) && (
        <div className="mt-5 flex flex-wrap gap-2">
          {primary && (
            <button
              onClick={() => handleAction(primary)}
              className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
            >
              {primary.label}
            </button>
          )}
          {secondary && (
            <button
              onClick={() => handleAction(secondary)}
              className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {secondary.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TaskRow({ task }: { task: LifecycleTask }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded ${
          task.isComplete
            ? 'bg-emerald-500 text-white'
            : 'border border-gray-300 bg-white text-gray-400'
        }`}
      >
        {task.isComplete && (
          <svg
            className="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
      <div className="flex-1">
        <span
          className={
            task.isComplete
              ? 'text-gray-700 line-through decoration-gray-300'
              : 'text-gray-700'
          }
        >
          {task.label}
        </span>
        {task.comingSoon && (
          <span className="ml-2 inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-600">
            Coming soon
          </span>
        )}
        {task.hint && !task.comingSoon && (
          <span className="ml-2 text-xs text-gray-500">{task.hint}</span>
        )}
      </div>
    </li>
  );
}

function CaretBreakdown({ initiative }: { initiative: Initiative }) {
  const isScored = FACTOR_ORDER.every((f) => initiative.caret[f] > 0);
  if (!isScored) return null;

  return (
    <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        CARET scores
      </div>
      <div className="grid grid-cols-5 gap-2 text-center">
        {FACTOR_ORDER.map((f) => {
          const value = initiative.caret[f];
          const divergence = factorDivergence(initiative.panelists, f);
          const flagged = divergence >= 2;
          return (
            <div
              key={f}
              className={`rounded-md px-2 py-3 ${
                flagged ? 'bg-amber-100' : 'bg-white'
              }`}
            >
              <div className="text-xs text-gray-500">{FACTORS[f].letter}</div>
              <div className="font-mono text-lg font-semibold text-gray-900">
                {formatNumber(value)}
              </div>
            </div>
          );
        })}
      </div>
      {initiative.panelists.length > 0 && (
        <div className="mt-4">
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            Panel ({initiative.panelists.length})
          </div>
          <div className="space-y-1 text-xs">
            {initiative.panelists.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-baseline justify-between gap-x-2 rounded-md bg-white px-2 py-1.5"
              >
                <div>
                  <span className="font-medium text-gray-900">{p.name}</span>
                  {p.role && (
                    <span className="ml-2 text-gray-500">{p.role}</span>
                  )}
                </div>
                <div className="font-mono text-gray-600">
                  {FACTOR_ORDER.map((f) => (
                    <span key={f} className="ml-1.5">
                      {FACTORS[f].letter}:{' '}
                      {isNA(p.scores[f])
                        ? 'N/A'
                        : p.scores[f] > 0
                          ? formatNumber(p.scores[f])
                          : '—'}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {initiative.scoredBy && (
        <div className="mt-3">
          <div className="text-xs text-gray-500">Panel description</div>
          <div className="text-sm text-gray-900">{initiative.scoredBy}</div>
        </div>
      )}
      {initiative.scoredAt && (
        <div className="mt-2 text-xs text-gray-500">
          Scored {formatRelativeTime(initiative.scoredAt)}
        </div>
      )}
      {FACTOR_ORDER.some((f) => initiative.caretNotes[f].trim()) && (
        <div className="mt-4 space-y-2">
          <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Discussion notes
          </div>
          {FACTOR_ORDER.map((f) =>
            initiative.caretNotes[f].trim() ? (
              <div
                key={f}
                className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
              >
                <span className="font-medium text-gray-900">
                  {FACTORS[f].letter}:
                </span>{' '}
                <span className="text-gray-700">
                  {initiative.caretNotes[f]}
                </span>
              </div>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}

function formatNumber(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2);
}
