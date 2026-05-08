import { useNavigate } from 'react-router-dom';
import { useRoadmapStore } from '../store';
import { STAGE_LABELS, type Initiative, type Stage } from '../types';
import {
  getLifecycleStatus,
  PROGRESSION,
  type LifecycleTask,
} from '../lib/lifecycle';

export default function LifecycleSection({
  initiative,
}: {
  initiative: Initiative;
}) {
  const status = getLifecycleStatus(initiative);

  if (status.isTerminal) {
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
          . The Roadmap Owner can move it back into an earlier stage by editing
          the initiative if circumstances change.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <ProgressBar currentStage={initiative.stage} />
      <NextStepsCard initiative={initiative} status={status} />
    </section>
  );
}

function ProgressBar({ currentStage }: { currentStage: Stage }) {
  const currentIdx = PROGRESSION.indexOf(currentStage);
  return (
    <div>
      <div className="flex items-center gap-1">
        {PROGRESSION.map((s, idx) => {
          const completed = idx < currentIdx;
          const current = idx === currentIdx;
          return (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${
                completed
                  ? 'bg-emerald-500'
                  : current
                    ? 'bg-gray-900'
                    : 'bg-gray-200'
              }`}
            />
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-1">
        {PROGRESSION.map((s, idx) => {
          const completed = idx < currentIdx;
          const current = idx === currentIdx;
          return (
            <div
              key={s}
              className={`flex-1 text-center text-xs ${
                current
                  ? 'font-semibold text-gray-900'
                  : completed
                    ? 'text-emerald-700'
                    : 'text-gray-400'
              }`}
            >
              {completed && <span className="mr-0.5">✓</span>}
              {STAGE_LABELS[s]}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NextStepsCard({
  initiative,
  status,
}: {
  initiative: Initiative;
  status: ReturnType<typeof getLifecycleStatus>;
}) {
  const navigate = useNavigate();
  const updateInitiative = useRoadmapStore((s) => s.updateInitiative);
  const { tasks, nextStep } = status;

  const handlePrimary = () => {
    if (!nextStep?.primary) return;
    if (nextStep.primary.kind === 'navigate') {
      navigate(nextStep.primary.target);
    } else if (nextStep.primary.kind === 'advance') {
      updateInitiative(initiative.id, {
        stage: nextStep.primary.target as Stage,
      });
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <header className="flex items-baseline justify-between gap-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Where you are
          </div>
          <h2 className="mt-0.5 text-lg font-semibold text-gray-900">
            {nextStep?.headline ?? 'Continue working through the framework'}
          </h2>
        </div>
      </header>

      {nextStep?.body && (
        <p className="mt-2 text-sm text-gray-600">{nextStep.body}</p>
      )}

      {tasks.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Stage checklist
          </div>
          <ul className="space-y-1.5">
            {tasks.map((t, idx) => (
              <TaskRow key={idx} task={t} />
            ))}
          </ul>
        </div>
      )}

      {nextStep?.offlineNote && (
        <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          <strong className="font-semibold">Heads up:</strong>{' '}
          {nextStep.offlineNote}
        </div>
      )}

      {nextStep?.primary && (
        <div className="mt-5">
          <button
            onClick={handlePrimary}
            className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            {nextStep.primary.label}
          </button>
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
            : task.comingSoon
              ? 'border border-dashed border-gray-300 bg-white text-gray-400'
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
