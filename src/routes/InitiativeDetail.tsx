import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useRoadmapStore } from '../store';
import {
  HEALTH_LABELS,
  PATH_LABELS,
  STAGE_LABELS,
  calculatePriorityScore,
} from '../types';
import { formatRelativeTime } from '../lib/time';
import HealthBadge from '../components/HealthBadge';
import StageBadge from '../components/StageBadge';

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

  return (
    <div>
      <div className="mb-2">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← Registry
        </Link>
      </div>
      <header className="mb-8 flex items-start justify-between gap-4">
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
            label="Technologies / Vendors"
            values={initiative.technologies}
          />
          <ChipsDetail
            label="Systems touched"
            values={initiative.systemsTouched}
          />
          <Detail label="Level 3 metric" value={initiative.level3Metric} />
        </Card>

        <Card title="CARET scores">
          {isScored ? (
            <div className="grid grid-cols-5 gap-2 text-center">
              {(
                [
                  ['C', initiative.caret.c],
                  ['A', initiative.caret.a],
                  ['R', initiative.caret.r],
                  ['E', initiative.caret.e],
                  ['T', initiative.caret.t],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="rounded-md bg-gray-50 px-2 py-3">
                  <div className="text-xs text-gray-500">{label}</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Not yet scored. Phase 2 will add a guided scoring flow with the
              full CARET methodology, multi-scorer support, and divergence
              resolution.
            </p>
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

      <div className="mt-8 rounded-md border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">
        Phase 1 detail view. Subsequent phases will add: CARET scoring wizard,
        gate checklist sidebar, PRD builder, Accountability Compact, GA tracking,
        and roadmap positioning.
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </h2>
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
