import { useNavigate } from 'react-router-dom';
import { useRoadmapStore } from '../store';
import type { Initiative } from '../types';

export default function TimelineEditor({
  initiative,
}: {
  initiative: Initiative;
}) {
  const navigate = useNavigate();
  const updateInitiative = useRoadmapStore((s) => s.updateInitiative);
  const effortScore = initiative.caret.e;

  const update = (field: keyof Initiative, value: string | null) => {
    updateInitiative(initiative.id, { [field]: value });
  };

  const allSet =
    !!initiative.deployStartDate &&
    !!initiative.pilotStartDate &&
    !!initiative.gaDate;

  const datesOutOfOrder =
    initiative.deployStartDate &&
    initiative.pilotStartDate &&
    new Date(initiative.deployStartDate) > new Date(initiative.pilotStartDate);

  const pilotBeforeGAOutOfOrder =
    initiative.pilotStartDate &&
    initiative.gaDate &&
    new Date(initiative.pilotStartDate) > new Date(initiative.gaDate);

  return (
    <>
      <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4">
        <div className="mb-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Implementation timeline
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Set the three phase boundaries. Saves automatically as you change
            any date.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <DateField
            label="Deploy start"
            hint="Build / buy begins"
            value={initiative.deployStartDate ?? ''}
            onChange={(v) => update('deployStartDate', v || null)}
          />
          <DateField
            label="Pilot start"
            hint="Cohort begins using"
            value={initiative.pilotStartDate ?? ''}
            onChange={(v) => update('pilotStartDate', v || null)}
          />
          <DateField
            label="GA start"
            hint="Full population launch"
            value={initiative.gaDate ?? ''}
            onChange={(v) => update('gaDate', v || null)}
          />
        </div>

        {(datesOutOfOrder || pilotBeforeGAOutOfOrder) && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
            <strong className="font-semibold">Dates out of order.</strong>{' '}
            Deploy should start before Pilot, and Pilot before GA.
          </div>
        )}

        <div className="mt-3 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600">
          <span>
            <strong className="font-semibold text-gray-900">
              Cognitive load contribution:
            </strong>{' '}
            {effortScore > 0 ? (
              <>
                this initiative contributes{' '}
                <span className="font-mono font-semibold">
                  E = {effortScore}
                </span>{' '}
                during Pilot and GA phases. Reps don&apos;t change behavior
                during Deploy, so it doesn&apos;t add load there.
              </>
            ) : (
              <>
                the Effort score isn&apos;t set yet. Score with CARET so the
                roadmap can compute cognitive load.
              </>
            )}
          </span>
        </div>
      </div>

      {allSet && (
        <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-md border-2 border-blue-200 bg-blue-50 p-5 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Check your work in context
            </div>
            <p className="mt-1 text-sm text-blue-900">
              Before advancing to Deploy, check the portfolio roadmap. Your
              timeline only makes sense in light of what else is in flight —
              cumulative cognitive load may already be near or over capacity in
              your chosen window.
            </p>
          </div>
          <button
            onClick={() => navigate(`/roadmap?from=${initiative.id}`)}
            className="shrink-0 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            View on portfolio roadmap →
          </button>
        </div>
      )}
    </>
  );
}

function DateField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700">
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
      />
      {hint && <p className="mt-1 text-[11px] text-gray-500">{hint}</p>}
    </div>
  );
}
