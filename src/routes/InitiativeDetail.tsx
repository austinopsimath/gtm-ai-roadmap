import {
  Link,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useRoadmapStore } from '../store';
import {
  HEALTH_LABELS,
  PATH_LABELS,
  STAGE_LABELS,
  STAGE_ORDER,
  calculatePriorityScore,
  type Initiative,
  type Stage,
} from '../types';
import { findMotion } from '../constants/motions';
import { formatRelativeTime } from '../lib/time';
import HealthBadge from '../components/HealthBadge';
import StageBadge from '../components/StageBadge';
import LifecycleSection from '../components/LifecycleSection';

export default function InitiativeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initiative = useRoadmapStore((s) =>
    s.initiatives.find((i) => i.id === id),
  );
  const deleteInitiative = useRoadmapStore((s) => s.deleteInitiative);

  if (!initiative) return <Navigate to="/" replace />;

  const stageParam = searchParams.get('stage') as Stage | null;
  const isValidStage =
    stageParam && STAGE_ORDER.includes(stageParam) && stageParam !== 'killed' && stageParam !== 'wound_down';
  const effectiveViewedStage: Stage = isValidStage
    ? stageParam
    : initiative.stage;

  const setViewedStage = (stage: Stage) => {
    if (stage === initiative.stage) {
      // Default state — drop the query param to keep the URL clean
      setSearchParams({});
    } else {
      setSearchParams({ stage });
    }
  };
  const priorityScore = calculatePriorityScore(initiative.caret);
  const isScored = priorityScore !== null;

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete "${initiative.name}"? This cannot be undone.`,
    );
    if (confirmed) {
      deleteInitiative(initiative.id);
      navigate('/');
    }
  };

  return (
    <div>
      <div className="mb-2">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← Registry
        </Link>
      </div>

      {/* Header: identity + key signal */}
      <header className="mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <StageBadge stage={initiative.stage} />
            <HealthBadge health={initiative.health} />
            {isScored && (
              <span className="inline-flex items-baseline rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                Priority{' '}
                <span className="ml-1 font-mono font-semibold text-gray-900">
                  {priorityScore!.toFixed(2)}
                </span>
              </span>
            )}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {initiative.name}
          </h1>
          {initiative.description && (
            <p className="mt-1 max-w-2xl text-sm text-gray-600">
              {initiative.description}
            </p>
          )}
          {initiative.businessRationale && (
            <div className="mt-3 max-w-2xl rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
              <span className="font-medium text-gray-900">
                Why this matters:
              </span>{' '}
              {initiative.businessRationale}
            </div>
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

      {/* Lifecycle: the workspace */}
      <LifecycleSection
        initiative={initiative}
        viewedStage={effectiveViewedStage}
        onSelectStage={setViewedStage}
      />

      {/* Profile: reference info, demoted */}
      <ProfileSection initiative={initiative} />
    </div>
  );
}

function ProfileSection({ initiative }: { initiative: Initiative }) {
  return (
    <section className="mt-10">
      <header className="mb-4 border-t border-gray-200 pt-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Profile
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Reference data about this initiative. Use the Edit button at the
          top to change anything below.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          {initiative.path === 'buy' && (
            <Detail
              label="Primary vendor"
              value={initiative.primaryVendor || null}
            />
          )}
        </Card>

        <Card title="Scope">
          <ChipsDetail
            label="Primary audiences"
            values={initiative.primaryAudiences}
          />
          {initiative.usageFrequencyPrimary && (
            <Detail
              label="Primary audience usage"
              value={capitalize(initiative.usageFrequencyPrimary)}
            />
          )}
          <ChipsDetail
            label="Secondary audiences"
            values={initiative.secondaryAudiences}
          />
          {initiative.usageFrequencySecondary && (
            <Detail
              label="Secondary audience usage"
              value={capitalize(initiative.usageFrequencySecondary)}
            />
          )}
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

        <Card title="GTM Motions">
          <GtmMotionsList ids={initiative.gtmMotions} />
        </Card>

        <Card title="Key dates">
          <Detail label="Intake" value={initiative.intakeDate} />
          <Detail label="Deploy start" value={initiative.deployStartDate} />
          <Detail label="Pilot start" value={initiative.pilotStartDate} />
          <Detail label="GA" value={initiative.gaDate} />
          <Detail label="Last reviewed" value={initiative.lastReviewedDate} />
        </Card>

        <Card title="Status">
          <Detail label="Stage" value={STAGE_LABELS[initiative.stage]} />
          <Detail label="Health" value={HEALTH_LABELS[initiative.health]} />
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
    </section>
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
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm text-gray-900">
        {value ? value : <span className="text-gray-400">—</span>}
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

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function GtmMotionsList({ ids }: { ids: string[] }) {
  if (ids.length === 0) {
    return <div className="text-sm text-gray-400">No motions selected.</div>;
  }
  // Group by category for display.
  const groups = new Map<string, string[]>();
  for (const id of ids) {
    const found = findMotion(id);
    if (!found) continue;
    const key = found.category.label;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(found.motion.label);
  }
  return (
    <div className="space-y-2">
      {Array.from(groups.entries()).map(([cat, motions]) => (
        <div key={cat}>
          <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
            {cat}
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {motions.map((m) => (
              <span
                key={m}
                className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-800"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
