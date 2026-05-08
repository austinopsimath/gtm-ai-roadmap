import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useRoadmapStore } from '../store';
import {
  HEALTH_LABELS,
  PATH_LABELS,
  STAGE_LABELS,
  calculatePriorityScore,
  factorDivergence,
  isNA,
} from '../types';
import { FACTOR_ORDER, FACTORS } from '../constants/caret';
import { formatRelativeTime } from '../lib/time';
import HealthBadge from '../components/HealthBadge';
import StageBadge from '../components/StageBadge';
import LifecycleSection from '../components/LifecycleSection';

export default function InitiativeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const initiative = useRoadmapStore((s) =>
    s.initiatives.find((i) => i.id === id),
  );
  const deleteInitiative = useRoadmapStore((s) => s.deleteInitiative);

  if (!initiative) return <Navigate to="/" replace />;

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete "${initiative.name}"? This cannot be undone.`,
    );
    if (confirmed) {
      deleteInitiative(initiative.id);
      navigate('/');
    }
  };

  const priorityScore = calculatePriorityScore(initiative.caret);
  const isScored = priorityScore !== null;
  const hasPanelists = initiative.panelists.length > 0;

  return (
    <div>
      <div className="mb-2">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← Registry
        </Link>
      </div>
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <StageBadge stage={initiative.stage} />
            <HealthBadge health={initiative.health} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {initiative.name}
          </h1>
          {initiative.description && (
            <p className="mt-1 max-w-2xl text-sm text-gray-600">
              {initiative.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
          <button
            onClick={() => navigate(`/initiatives/${initiative.id}/edit`)}
            className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Edit
          </button>
        </div>
      </header>

      <div className="mb-6">
        <LifecycleSection initiative={initiative} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card title="Ownership">
          <Detail label="Initiative Owner" value={initiative.initiativeOwner} />
          <Detail
            label="Executive Sponsor"
            value={initiative.executiveSponsor}
          />
          <Detail
            label="Path"
            value={initiative.path ? PATH_LABELS[initiative.path] : null}
          />
        </Card>

        <Card title="Status">
          <Detail label="Stage" value={STAGE_LABELS[initiative.stage]} />
          <Detail label="Health" value={HEALTH_LABELS[initiative.health]} />
          <Detail
            label="Priority Score"
            value={isScored ? priorityScore!.toFixed(2) : null}
            placeholder="Not yet scored"
          />
        </Card>

        <Card title="Scope">
          <ChipsDetail
            label="Audiences served"
            values={initiative.audiencesServed}
          />
          <ChipsDetail
            label="Technologies / Vendors for Build"
            values={initiative.technologies}
          />
          <ChipsDetail
            label="Systems Touched During Operation"
            values={initiative.systemsTouched}
          />
          <Detail label="Level 3 metric" value={initiative.level3Metric} />
        </Card>

        <Card
          title="CARET scores"
          action={
            isScored && (
              <button
                onClick={() => navigate(`/initiatives/${initiative.id}/score`)}
                className="text-xs font-medium text-gray-700 underline hover:text-gray-900"
              >
                Re-score
              </button>
            )
          }
        >
          {isScored ? (
            <>
              <div className="grid grid-cols-5 gap-2 text-center">
                {FACTOR_ORDER.map((f) => {
                  const value = initiative.caret[f];
                  const divergence = factorDivergence(
                    initiative.panelists,
                    f,
                  );
                  const flagged = divergence >= 2;
                  return (
                    <div
                      key={f}
                      className={`rounded-md px-2 py-3 ${
                        flagged ? 'bg-amber-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="text-xs text-gray-500">
                        {FACTORS[f].letter}
                      </div>
                      <div className="font-mono text-lg font-semibold text-gray-900">
                        {value > 0 ? formatNumber(value) : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
              {hasPanelists && (
                <div className="mt-4">
                  <div className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Panel ({initiative.panelists.length})
                  </div>
                  <div className="space-y-1 text-xs">
                    {initiative.panelists.map((p) => (
                      <div
                        key={p.id}
                        className="flex flex-wrap items-baseline justify-between gap-x-2 rounded-md bg-gray-50 px-2 py-1.5"
                      >
                        <div>
                          <span className="font-medium text-gray-900">
                            {p.name}
                          </span>
                          {p.role && (
                            <span className="ml-2 text-gray-500">
                              {p.role}
                            </span>
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
                  <div className="text-xs text-gray-500">
                    Panel description
                  </div>
                  <div className="text-sm text-gray-900">
                    {initiative.scoredBy}
                  </div>
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
                        className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
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
            </>
          ) : (
            <div className="text-sm text-gray-500">
              Use the lifecycle checklist above to begin scoring.
            </div>
          )}
        </Card>

        <Card title="Key dates">
          <Detail label="Intake" value={initiative.intakeDate} />
          <Detail label="Pilot start" value={initiative.pilotStartDate} />
          <Detail label="GA" value={initiative.gaDate} />
          <Detail label="Last reviewed" value={initiative.lastReviewedDate} />
        </Card>

        <Card title="Record">
          <Detail
            label="Created"
            value={formatRelativeTime(initiative.createdAt)}
          />
          <Detail
            label="Updated"
            value={formatRelativeTime(initiative.updatedAt)}
          />
        </Card>
      </div>

    </div>
  );
}

function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {title}
        </h2>
        {action}
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Detail({
  label,
  value,
  placeholder,
}: {
  label: string;
  value: string | null | undefined;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm text-gray-900">
        {value ? (
          value
        ) : (
          <span className="text-gray-400">{placeholder ?? '—'}</span>
        )}
      </div>
    </div>
  );
}

function ChipsDetail({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      {values.length === 0 ? (
        <div className="text-sm text-gray-400">—</div>
      ) : (
        <div className="mt-1 flex flex-wrap gap-1">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-800"
            >
              {v}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function formatNumber(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2);
}
