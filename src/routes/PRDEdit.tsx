import { useMemo } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useRoadmapStore } from '../store';
import {
  PATH_LABELS,
  calculatePriorityScore,
  createMetric,
  createWorkstream,
  type CompactConditionalStatus,
  type Initiative,
  type MetricCadence,
  type MetricDef,
  type MetricLevel,
  type PRD,
  type Path,
  type RiskDispositionType,
  type Workstream,
} from '../types';
import {
  DEFAULT_AUDIENCES,
  DEFAULT_LEVEL1_METRICS,
  DEFAULT_LEVEL2_METRICS,
  DEFAULT_LEVEL3_METRICS,
  DEFAULT_SYSTEMS,
  DEFAULT_TECHNOLOGIES,
} from '../constants/picklists';
import { frameworkWorkstreamsFor } from '../constants/workstreams';
import { FACTOR_ORDER, FACTORS } from '../constants/caret';
import Combobox from '../components/Combobox';
import { isPRDSectionComplete } from '../lib/prdProgress';

const CADENCE_LABELS: Record<MetricCadence, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
};

const dedupe = (arr: string[]) => Array.from(new Set(arr));

const SECTIONS = [
  { id: '1', title: 'Initiative Summary' },
  { id: '2', title: 'Target Users' },
  { id: '3', title: 'Business Need + CARET' },
  { id: '4', title: 'Success Metrics' },
  { id: '5', title: 'Path: Build or Buy' },
  { id: '6', title: 'Systems and Integrations' },
  { id: '7', title: 'Data Architecture' },
  { id: '8', title: 'Risk Assessment' },
  { id: '9', title: 'Pilot Plan' },
  { id: '10', title: 'Workstreams' },
  { id: '11', title: 'Measurement Cadence' },
  { id: '12', title: 'Approval Mechanism' },
  { id: '13', title: 'Conditional Compact' },
];

export default function PRDEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const initiative = useRoadmapStore((s) =>
    s.initiatives.find((i) => i.id === id),
  );
  const updateInitiative = useRoadmapStore((s) => s.updateInitiative);
  const customAudiences = useRoadmapStore((s) => s.customAudiences);
  const customTechnologies = useRoadmapStore((s) => s.customTechnologies);
  const customSystems = useRoadmapStore((s) => s.customSystems);
  const customLevel1Metrics = useRoadmapStore((s) => s.customLevel1Metrics);
  const customLevel2Metrics = useRoadmapStore((s) => s.customLevel2Metrics);
  const customLevel3Metrics = useRoadmapStore((s) => s.customLevel3Metrics);
  const addCustomOption = useRoadmapStore((s) => s.addCustomOption);

  if (!initiative) return <Navigate to="/" replace />;

  const updateField = <K extends keyof Initiative>(
    key: K,
    value: Initiative[K],
  ) => updateInitiative(initiative.id, { [key]: value });

  const updatePrd = (patch: Partial<PRD>) =>
    updateInitiative(initiative.id, {
      prd: { ...initiative.prd, ...patch },
    });

  return (
    <div>
      <div className="mb-2">
        <Link
          to={`/initiatives/${initiative.id}?stage=prd`}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to initiative
        </Link>
      </div>

      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Stage 2 · PRD
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
            Product Requirements Document
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">
            {initiative.name}. Saves automatically as you fill in each section.
          </p>
        </div>
        <button
          onClick={() => navigate(`/initiatives/${initiative.id}/prd/view`)}
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          View / Print →
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <SectionNav initiative={initiative} />
          </div>
        </aside>

        <main className="space-y-10">
          <Section1
            initiative={initiative}
            updateField={updateField}
          />
          <Section2
            initiative={initiative}
            updateField={updateField}
            customAudiences={customAudiences}
            addCustomOption={addCustomOption}
          />
          <Section3 initiative={initiative} updateField={updateField} />
          <Section4
            initiative={initiative}
            updatePrd={updatePrd}
            customLevel1Metrics={customLevel1Metrics}
            customLevel2Metrics={customLevel2Metrics}
            customLevel3Metrics={customLevel3Metrics}
            addCustomOption={addCustomOption}
          />
          <Section5
            initiative={initiative}
            updateField={updateField}
            customTechnologies={customTechnologies}
            addCustomOption={addCustomOption}
          />
          <Section6
            initiative={initiative}
            updateField={updateField}
            customSystems={customSystems}
            addCustomOption={addCustomOption}
          />
          <Section7 initiative={initiative} updatePrd={updatePrd} />
          <Section8 initiative={initiative} updatePrd={updatePrd} />
          <Section9 initiative={initiative} updatePrd={updatePrd} />
          <Section10 initiative={initiative} updatePrd={updatePrd} />
          <Section11 initiative={initiative} />
          <Section12 initiative={initiative} updatePrd={updatePrd} />
          <Section13 initiative={initiative} updatePrd={updatePrd} />
        </main>
      </div>
    </div>
  );
}

function SectionNav({ initiative }: { initiative: Initiative }) {
  return (
    <nav>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        PRD sections
      </div>
      <ul className="space-y-1 text-sm">
        {SECTIONS.map((s) => {
          const complete = isPRDSectionComplete(initiative, s.id);
          return (
            <li key={s.id}>
              <a
                href={`#section-${s.id}`}
                className="flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-100"
              >
                <span
                  className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded ${
                    complete
                      ? 'bg-emerald-500 text-white'
                      : 'border border-gray-300 bg-white'
                  }`}
                >
                  {complete && (
                    <svg
                      className="h-2.5 w-2.5"
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
                <span className="text-gray-500">{s.id}.</span>
                <span className="text-gray-900">{s.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ===== Section components =====

function SectionWrapper({
  id,
  title,
  subtitle,
  children,
  fromProfile,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  fromProfile?: boolean;
}) {
  return (
    <section id={`section-${id}`} className="scroll-mt-6">
      <header className="mb-4 border-b border-gray-200 pb-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Section {id}
        </div>
        <h2 className="mt-0.5 text-lg font-semibold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
        )}
        {fromProfile && (
          <p className="mt-2 text-xs text-gray-500">
            <span className="font-medium">Note:</span> changes here update the
            initiative profile (visible elsewhere in the app too).
          </p>
        )}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {children}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

const inputClass =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500';

// Section 1: Initiative Summary (from profile)
function Section1({
  initiative,
  updateField,
}: {
  initiative: Initiative;
  updateField: <K extends keyof Initiative>(
    key: K,
    value: Initiative[K],
  ) => void;
}) {
  return (
    <SectionWrapper
      id="1"
      title="Initiative Summary"
      subtitle="What is this initiative, and what problem does it solve? Captures name, description, and ownership from the initiative profile."
      fromProfile
    >
      <Field label="Name">
        <input
          type="text"
          value={initiative.name}
          onChange={(e) => updateField('name', e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Description">
        <textarea
          value={initiative.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={3}
          placeholder="One-sentence plain-language summary of what it does."
          className={inputClass}
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Initiative Owner">
          <input
            type="text"
            value={initiative.initiativeOwner}
            onChange={(e) => updateField('initiativeOwner', e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Executive Sponsor">
          <input
            type="text"
            value={initiative.executiveSponsor}
            onChange={(e) => updateField('executiveSponsor', e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
    </SectionWrapper>
  );
}

// Section 2: Target Users (from profile)
function Section2({
  initiative,
  updateField,
  customAudiences,
  addCustomOption,
}: {
  initiative: Initiative;
  updateField: <K extends keyof Initiative>(
    key: K,
    value: Initiative[K],
  ) => void;
  customAudiences: string[];
  addCustomOption: (kind: 'audiences', value: string) => void;
}) {
  const audienceOptions = dedupe([...DEFAULT_AUDIENCES, ...customAudiences]);
  return (
    <SectionWrapper
      id="2"
      title="Target Users"
      subtitle='Who will use this solution, and in what context? Be specific — "the sales team" is not a target user definition.'
      fromProfile
    >
      <Combobox
        mode="multi"
        label="Audiences served"
        options={audienceOptions}
        selected={initiative.audiencesServed}
        onChange={(v) => updateField('audiencesServed', v)}
        onCreateOption={(v) => addCustomOption('audiences', v)}
        placeholder="Select audiences..."
        help="Specific roles and segments. Include the segment (Enterprise / Mid-Market / SMB) where it matters."
      />
    </SectionWrapper>
  );
}

// Section 3: Business Need + CARET Context (from profile + scoring)
function Section3({
  initiative,
  updateField,
}: {
  initiative: Initiative;
  updateField: <K extends keyof Initiative>(
    key: K,
    value: Initiative[K],
  ) => void;
}) {
  const score = calculatePriorityScore(initiative.caret);
  return (
    <SectionWrapper
      id="3"
      title="Business Need + CARET Context"
      subtitle="What business need is this addressing? Reference the Level 3 metric this initiative is expected to move, and capture the CARET Priority Score for traceability."
      fromProfile
    >
      <Field label="Business need (description)">
        <textarea
          value={initiative.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={3}
          className={inputClass}
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="text-sm font-medium text-gray-700">
            Level 3 metric targeted
          </div>
          <div className="mt-1 text-sm text-gray-900">
            {initiative.level3Metric || (
              <span className="text-gray-400">Not yet set on profile</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700">
            CARET Priority Score
          </div>
          <div className="mt-1 font-mono text-sm text-gray-900">
            {score === null ? (
              <span className="text-gray-400">Not yet scored</span>
            ) : (
              score.toFixed(2)
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="mb-1 text-sm font-medium text-gray-700">
          CARET breakdown
        </div>
        <div className="grid grid-cols-5 gap-2 text-center">
          {FACTOR_ORDER.map((f) => (
            <div key={f} className="rounded-md bg-gray-50 px-2 py-2">
              <div className="text-xs text-gray-500">{FACTORS[f].letter}</div>
              <div className="font-mono text-sm font-semibold text-gray-900">
                {initiative.caret[f] > 0
                  ? formatNumber(initiative.caret[f])
                  : '—'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

// Section 4: Success Metrics (PRD-specific) — also serves Section 11
function Section4({
  initiative,
  updatePrd,
  customLevel1Metrics,
  customLevel2Metrics,
  customLevel3Metrics,
  addCustomOption,
}: {
  initiative: Initiative;
  updatePrd: (patch: Partial<PRD>) => void;
  customLevel1Metrics: string[];
  customLevel2Metrics: string[];
  customLevel3Metrics: string[];
  addCustomOption: (
    kind: 'level1Metrics' | 'level2Metrics' | 'level3Metrics',
    value: string,
  ) => void;
}) {
  const metrics = initiative.prd.metrics;

  const updateMetric = (id: string, patch: Partial<MetricDef>) =>
    updatePrd({
      metrics: metrics.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    });
  const removeMetric = (id: string) =>
    updatePrd({ metrics: metrics.filter((m) => m.id !== id) });
  const addMetric = (level: MetricLevel) =>
    updatePrd({ metrics: [...metrics, createMetric({ level })] });

  return (
    <SectionWrapper
      id="4"
      title="Success Metrics — All Three Layers"
      subtitle="The specific metrics tracked during the pilot and GA. Capture the baseline, target, cadence, and tracking mechanism for each metric. The cadence column also serves Section 11 (Measurement Cadence)."
    >
      {([1, 2, 3] as MetricLevel[]).map((level) => {
        const levelMetrics = metrics.filter((m) => m.level === level);
        const options =
          level === 1
            ? dedupe([...DEFAULT_LEVEL1_METRICS, ...customLevel1Metrics])
            : level === 2
              ? dedupe([...DEFAULT_LEVEL2_METRICS, ...customLevel2Metrics])
              : dedupe([...DEFAULT_LEVEL3_METRICS, ...customLevel3Metrics]);
        const kind: 'level1Metrics' | 'level2Metrics' | 'level3Metrics' =
          level === 1
            ? 'level1Metrics'
            : level === 2
              ? 'level2Metrics'
              : 'level3Metrics';
        const levelLabel =
          level === 1
            ? 'Level 1 — Behavior'
            : level === 2
              ? 'Level 2 — Indicators'
              : 'Level 3 — Impact';
        const cadenceHint =
          level === 1
            ? 'typically weekly'
            : level === 2
              ? 'typically monthly'
              : 'typically quarterly';

        return (
          <div key={level} className="space-y-3">
            <div className="flex items-baseline justify-between border-b border-gray-100 pb-1">
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {levelLabel}
                </div>
                <div className="text-xs text-gray-500">
                  Cadence {cadenceHint}.
                </div>
              </div>
              <button
                type="button"
                onClick={() => addMetric(level)}
                className="text-xs font-medium text-gray-700 underline hover:text-gray-900"
              >
                + Add metric
              </button>
            </div>
            {levelMetrics.length === 0 ? (
              <div className="rounded-md border border-dashed border-gray-300 px-3 py-3 text-sm text-gray-500">
                No metrics added yet. Click "+ Add metric" to define one.
              </div>
            ) : (
              levelMetrics.map((m) => (
                <div
                  key={m.id}
                  className="rounded-md border border-gray-200 bg-white p-3"
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Combobox
                      mode="single"
                      label="Metric"
                      options={options}
                      selected={m.name}
                      onChange={(v) => updateMetric(m.id, { name: v })}
                      onCreateOption={(v) => addCustomOption(kind, v)}
                      placeholder="Select or add a metric..."
                    />
                    <Field label="Cadence">
                      <select
                        value={m.cadence}
                        onChange={(e) =>
                          updateMetric(m.id, {
                            cadence: e.target.value as MetricCadence,
                          })
                        }
                        className={inputClass}
                      >
                        {(
                          [
                            'daily',
                            'weekly',
                            'monthly',
                            'quarterly',
                          ] as MetricCadence[]
                        ).map((c) => (
                          <option key={c} value={c}>
                            {CADENCE_LABELS[c]}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Baseline">
                      <input
                        type="text"
                        value={m.baseline}
                        onChange={(e) =>
                          updateMetric(m.id, { baseline: e.target.value })
                        }
                        placeholder="e.g., 23% win rate, 4.2 meetings per opp"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Target">
                      <input
                        type="text"
                        value={m.target}
                        onChange={(e) =>
                          updateMetric(m.id, { target: e.target.value })
                        }
                        placeholder="e.g., 28% win rate, 5.5 meetings per opp"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Tracking mechanism">
                      <input
                        type="text"
                        value={m.trackingMechanism}
                        onChange={(e) =>
                          updateMetric(m.id, {
                            trackingMechanism: e.target.value,
                          })
                        }
                        placeholder="How will this metric be captured? e.g., Salesforce report, Gong analytics, custom dashboard"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                  <div className="mt-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeMetric(m.id)}
                      className="text-xs text-gray-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      })}
    </SectionWrapper>
  );
}

// Section 5: Path: Build or Buy (from profile)
function Section5({
  initiative,
  updateField,
  customTechnologies,
  addCustomOption,
}: {
  initiative: Initiative;
  updateField: <K extends keyof Initiative>(
    key: K,
    value: Initiative[K],
  ) => void;
  customTechnologies: string[];
  addCustomOption: (kind: 'technologies', value: string) => void;
}) {
  const vendorOptions = dedupe([
    ...DEFAULT_TECHNOLOGIES,
    ...customTechnologies,
  ]);

  const setPath = (path: Path | null) => {
    updateField('path', path);
    if (path !== 'buy') updateField('primaryVendor', '');
  };

  return (
    <SectionWrapper
      id="5"
      title="Path: Build or Buy"
      subtitle="Confirm the path. For Buy: name the primary vendor. Document the rationale below."
      fromProfile
    >
      <Field label="Path">
        <div className="flex flex-wrap gap-2">
          {(['build', 'buy'] as Path[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPath(p)}
              className={`rounded-md border px-4 py-1.5 text-sm transition ${
                initiative.path === p
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {PATH_LABELS[p]}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPath(null)}
            className={`rounded-md border px-4 py-1.5 text-sm transition ${
              initiative.path === null
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Not yet decided
          </button>
        </div>
      </Field>
      {initiative.path === 'buy' && (
        <Combobox
          mode="single"
          label="Primary vendor"
          options={vendorOptions}
          selected={initiative.primaryVendor}
          onChange={(v) => updateField('primaryVendor', v)}
          onCreateOption={(v) => addCustomOption('technologies', v)}
          placeholder="Select or add a vendor..."
          help="The single primary vendor this initiative depends on. Capture the broader evaluation list and rationale in the rationale field below."
        />
      )}
      <Field
        label="Rationale"
        hint="Why this path? For Buy: vendor evaluation criteria. For Build: core technical components and architecture approach."
      >
        <textarea
          value={initiative.prd.pathRationale}
          onChange={(e) =>
            useRoadmapStore.getState().updateInitiative(initiative.id, {
              prd: { ...initiative.prd, pathRationale: e.target.value },
            })
          }
          rows={3}
          className={inputClass}
        />
      </Field>
    </SectionWrapper>
  );
}

// Section 6: Systems and Integrations (from profile)
function Section6({
  initiative,
  updateField,
  customSystems,
  addCustomOption,
}: {
  initiative: Initiative;
  updateField: <K extends keyof Initiative>(
    key: K,
    value: Initiative[K],
  ) => void;
  customSystems: string[];
  addCustomOption: (kind: 'systems', value: string) => void;
}) {
  const systemOptions = dedupe([...DEFAULT_SYSTEMS, ...customSystems]);
  return (
    <SectionWrapper
      id="6"
      title="Systems and Integrations"
      subtitle="Every system this initiative will touch in ongoing operations."
      fromProfile
    >
      <Combobox
        mode="multi"
        label="Systems Touched During Operation"
        options={systemOptions}
        selected={initiative.systemsTouched}
        onChange={(v) => updateField('systemsTouched', v)}
        onCreateOption={(v) => addCustomOption('systems', v)}
        placeholder="Select systems..."
        help="The CRM, SEP, conversation intelligence, communication, and data systems reps use day-to-day."
      />
    </SectionWrapper>
  );
}

// Section 7: Data Architecture
function Section7({
  initiative,
  updatePrd,
}: {
  initiative: Initiative;
  updatePrd: (patch: Partial<PRD>) => void;
}) {
  return (
    <SectionWrapper
      id="7"
      title="Data Architecture"
      subtitle="For each data type the solution handles — inputs, outputs, intermediate states — document storage location, owner, and what happens to that data if the solution is wound down. For Buy: vendor data retention policies and what data leaves your environment."
    >
      <Field>
        <textarea
          value={initiative.prd.dataArchitecture}
          onChange={(e) => updatePrd({ dataArchitecture: e.target.value })}
          rows={6}
          placeholder="Data types, storage, ownership, exit terms..."
          className={inputClass}
        />
      </Field>
    </SectionWrapper>
  );
}

// Section 8: Risk Assessment
const RISK_DEFINITIONS: {
  key: keyof PRD['risks'];
  label: string;
  description: string;
  buyOnly?: boolean;
}[] = [
  {
    key: 'newUI',
    label: 'New UI / Login Requirement',
    description:
      "Will reps need to navigate to a new interface or log into a new tool to use this? If so, that's a significant adoption risk — push output into systems they already live in wherever possible.",
  },
  {
    key: 'overlappingCapabilities',
    label: 'Overlapping Capabilities',
    description:
      'Are there other tools, modules, or features in your stack that already do some of what this proposes? Audit before building or buying.',
  },
  {
    key: 'dataQuality',
    label: 'Data Quality and Completeness',
    description:
      "AI is only as good as the data. If this depends on CRM fields that aren't consistently populated or signals that aren't being captured, document the gap now.",
  },
  {
    key: 'integrationFragility',
    label: 'Integration Fragility',
    description:
      'Integrations on undocumented APIs or webhook dependencies are brittle. Document which integrations are stable vs. fragile, and the fallback plan for the latter.',
  },
  {
    key: 'vendorLockIn',
    label: 'Vendor Lock-In',
    description:
      'For Buy paths only. Evaluate data portability, contract exit terms, and whether capabilities could be replicated elsewhere if needed.',
    buyOnly: true,
  },
];

function Section8({
  initiative,
  updatePrd,
}: {
  initiative: Initiative;
  updatePrd: (patch: Partial<PRD>) => void;
}) {
  const isBuy = initiative.path === 'buy';
  const updateRisk = (
    key: keyof PRD['risks'],
    patch: Partial<PRD['risks'][typeof key]>,
  ) => {
    updatePrd({
      risks: {
        ...initiative.prd.risks,
        [key]: { ...initiative.prd.risks[key], ...patch },
      },
    });
  };

  return (
    <SectionWrapper
      id="8"
      title="Risk Assessment"
      subtitle="Assess each risk category and pick a disposition: accept (live with it), mitigate (plan to address), or escalate (revisit the priority score)."
    >
      {RISK_DEFINITIONS.filter((r) => !r.buyOnly || isBuy).map((r) => {
        const risk = initiative.prd.risks[r.key];
        return (
          <div
            key={r.key}
            className="rounded-md border border-gray-200 bg-white p-4"
          >
            <div className="text-sm font-semibold text-gray-900">
              {r.label}
              {r.buyOnly && (
                <span className="ml-2 text-xs font-normal text-gray-500">
                  (Buy path only)
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-600">{r.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(['accept', 'mitigate', 'escalate'] as RiskDispositionType[])
                .filter((d): d is Exclude<RiskDispositionType, null> => !!d)
                .map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() =>
                      updateRisk(r.key, {
                        disposition: risk.disposition === d ? null : d,
                      })
                    }
                    className={`rounded-md border px-3 py-1 text-xs font-medium capitalize transition ${
                      risk.disposition === d
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
            </div>
            <div className="mt-3">
              <textarea
                value={risk.notes}
                onChange={(e) =>
                  updateRisk(r.key, { notes: e.target.value })
                }
                rows={2}
                placeholder="Notes on the disposition or what's being mitigated..."
                className={inputClass}
              />
            </div>
          </div>
        );
      })}
    </SectionWrapper>
  );
}

// Section 9: Pilot Plan
function Section9({
  initiative,
  updatePrd,
}: {
  initiative: Initiative;
  updatePrd: (patch: Partial<PRD>) => void;
}) {
  const pp = initiative.prd.pilotPlan;
  const update = (patch: Partial<typeof pp>) =>
    updatePrd({ pilotPlan: { ...pp, ...patch } });

  return (
    <SectionWrapper
      id="9"
      title="Pilot Plan"
      subtitle="Define cohort, timeline, intervention design, and the criteria for each Stage 5 gate decision."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field
          label="Cohort"
          hint="Which team / which segment? Be specific."
        >
          <textarea
            value={pp.cohortDescription}
            onChange={(e) => update({ cohortDescription: e.target.value })}
            rows={2}
            className={inputClass}
          />
        </Field>
        <Field
          label="Cohort selection rationale"
          hint="Based on behavior gap, not convenience."
        >
          <textarea
            value={pp.cohortRationale}
            onChange={(e) => update({ cohortRationale: e.target.value })}
            rows={2}
            className={inputClass}
          />
        </Field>
      </div>
      <Field
        label="Timeline"
        hint="Long enough to measure the metric that matters."
      >
        <input
          type="text"
          value={pp.timeline}
          onChange={(e) => update({ timeline: e.target.value })}
          placeholder='e.g., "8 weeks: July 8 – September 1"'
          className={inputClass}
        />
      </Field>
      <Field
        label="Intervention design"
        hint="Start low, escalate deliberately. Email → docs → meeting discussion → self-paced training → live training → in-person training."
      >
        <textarea
          value={pp.interventionDesign}
          onChange={(e) => update({ interventionDesign: e.target.value })}
          rows={3}
          className={inputClass}
        />
      </Field>
      <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
        <div className="text-sm font-semibold text-gray-900">
          Decision criteria
        </div>
        <p className="mt-1 text-xs text-gray-600">
          Define in advance what each outcome looks like, so the panel decision
          isn't ambiguous.
        </p>
        <div className="mt-3 space-y-3">
          <Field label="Scale">
            <textarea
              value={pp.scaleDecision}
              onChange={(e) => update({ scaleDecision: e.target.value })}
              rows={2}
              placeholder="What does hitting (or materially exceeding) the success metric look like?"
              className={inputClass}
            />
          </Field>
          <Field label="Fix and Re-Pilot">
            <textarea
              value={pp.fixDecision}
              onChange={(e) => update({ fixDecision: e.target.value })}
              rows={2}
              placeholder="What's the specific correctable problem that would warrant a re-pilot?"
              className={inputClass}
            />
          </Field>
          <Field label="Kill">
            <textarea
              value={pp.killDecision}
              onChange={(e) => update({ killDecision: e.target.value })}
              rows={2}
              placeholder="What signal would tell you to stop and return to the queue?"
              className={inputClass}
            />
          </Field>
        </div>
      </div>
    </SectionWrapper>
  );
}

// Section 10: Workstreams
function Section10({
  initiative,
  updatePrd,
}: {
  initiative: Initiative;
  updatePrd: (patch: Partial<PRD>) => void;
}) {
  const workstreams = initiative.prd.workstreams;
  const path = initiative.path;

  const updateWorkstream = (id: string, patch: Partial<Workstream>) =>
    updatePrd({
      workstreams: workstreams.map((w) =>
        w.id === id ? { ...w, ...patch } : w,
      ),
    });
  const removeWorkstream = (id: string) =>
    updatePrd({ workstreams: workstreams.filter((w) => w.id !== id) });
  const addWorkstream = () =>
    updatePrd({ workstreams: [...workstreams, createWorkstream()] });
  const prePopulate = () => {
    if (!path) return;
    updatePrd({ workstreams: frameworkWorkstreamsFor(path) });
  };

  return (
    <SectionWrapper
      id="10"
      title="Workstream Assignments"
      subtitle="Named owners and target dates. Every workstream needs one accountable person — not a team, a person."
    >
      {workstreams.length === 0 && (
        <div className="rounded-md border border-dashed border-gray-300 p-4">
          {path ? (
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                No workstreams yet. Pre-populate the framework's standard{' '}
                {PATH_LABELS[path]} workstreams as a starting point — you can
                edit, add, or remove rows after.
              </p>
              <button
                onClick={prePopulate}
                className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                Pre-populate from framework ({PATH_LABELS[path]} path)
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Set the path (Build or Buy) in Section 5 to enable workstream
              pre-population.
            </p>
          )}
        </div>
      )}
      {workstreams.map((w) => (
        <div
          key={w.id}
          className="rounded-md border border-gray-200 bg-white p-3"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Workstream name">
              <input
                type="text"
                value={w.name}
                onChange={(e) =>
                  updateWorkstream(w.id, { name: e.target.value })
                }
                className={inputClass}
              />
            </Field>
            <Field label="Owner">
              <input
                type="text"
                value={w.owner}
                onChange={(e) =>
                  updateWorkstream(w.id, { owner: e.target.value })
                }
                placeholder="Named person"
                className={inputClass}
              />
            </Field>
            <Field label="Description">
              <textarea
                value={w.description}
                onChange={(e) =>
                  updateWorkstream(w.id, { description: e.target.value })
                }
                rows={2}
                className={inputClass}
              />
            </Field>
            <Field label="Target date">
              <input
                type="date"
                value={w.targetDate ?? ''}
                onChange={(e) =>
                  updateWorkstream(w.id, {
                    targetDate: e.target.value || null,
                  })
                }
                className={inputClass}
              />
            </Field>
          </div>
          <div className="mt-2 text-right">
            <button
              type="button"
              onClick={() => removeWorkstream(w.id)}
              className="text-xs text-gray-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      {workstreams.length > 0 && (
        <button
          type="button"
          onClick={addWorkstream}
          className="rounded-md border border-dashed border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          + Add workstream
        </button>
      )}
    </SectionWrapper>
  );
}

// Section 11: Measurement Cadence (display-only, references Section 4 metrics)
function Section11({ initiative }: { initiative: Initiative }) {
  const metrics = initiative.prd.metrics;
  const grouped = useMemo(() => {
    return ([1, 2, 3] as MetricLevel[]).map((level) => ({
      level,
      metrics: metrics.filter((m) => m.level === level),
    }));
  }, [metrics]);
  return (
    <SectionWrapper
      id="11"
      title="Measurement Cadence"
      subtitle="Per-metric tracking cadence. This summarizes the cadence column from Section 4 — change cadence values there."
    >
      {metrics.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-300 p-4 text-sm text-gray-500">
          No metrics defined yet. Go to Section 4 to add Level 1, Level 2, and
          Level 3 metrics — their cadence will appear here automatically.
        </div>
      ) : (
        grouped.map(({ level, metrics: lm }) => (
          <div key={level} className="space-y-2">
            <div className="text-sm font-semibold text-gray-900">
              {level === 1
                ? 'Level 1 — Behavior'
                : level === 2
                  ? 'Level 2 — Indicators'
                  : 'Level 3 — Impact'}
            </div>
            {lm.length === 0 ? (
              <div className="text-sm text-gray-500">No metrics at this level.</div>
            ) : (
              <ul className="space-y-1 text-sm">
                {lm.map((m) => (
                  <li
                    key={m.id}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-md bg-gray-50 px-3 py-2"
                  >
                    <span className="font-medium text-gray-900">
                      {m.name || (
                        <span className="italic text-gray-500">Unnamed metric</span>
                      )}
                    </span>
                    <span className="text-xs text-gray-700">
                      Cadence:{' '}
                      <span className="font-medium">
                        {CADENCE_LABELS[m.cadence]}
                      </span>
                      {m.trackingMechanism && (
                        <>
                          {' · via '}
                          <span className="font-medium">
                            {m.trackingMechanism}
                          </span>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </SectionWrapper>
  );
}

// Section 12: Approval Mechanism
function Section12({
  initiative,
  updatePrd,
}: {
  initiative: Initiative;
  updatePrd: (patch: Partial<PRD>) => void;
}) {
  const prd = initiative.prd;
  return (
    <SectionWrapper
      id="12"
      title="Approval Mechanism"
      subtitle="How will this PRD be approved? Specify the process and who is required to approve before circulating the PRD."
    >
      <Field
        label="Approval process"
        hint="Formal committee meeting, Slack channel vote, email sign-off, etc. Name who is required."
      >
        <textarea
          value={prd.approvalMechanism}
          onChange={(e) =>
            updatePrd({ approvalMechanism: e.target.value })
          }
          rows={3}
          className={inputClass}
        />
      </Field>
      <Field label="Approval status">
        <div className="flex gap-2">
          {(['draft', 'approved', 'revised'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                if (s === 'approved' && prd.approvalStatus !== 'approved') {
                  updatePrd({
                    approvalStatus: 'approved',
                    approvedAt: new Date().toISOString(),
                  });
                } else {
                  updatePrd({ approvalStatus: s });
                }
              }}
              className={`rounded-md border px-4 py-1.5 text-sm capitalize transition ${
                prd.approvalStatus === s
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Field>
    </SectionWrapper>
  );
}

// Section 13: Conditional Accountability Compact
const COMPACT_STATUS_LABELS: Record<CompactConditionalStatus, string> = {
  pending: 'Not yet asked',
  yes: 'Yes — agreed',
  conditional_yes: 'Conditional yes (with modifications)',
  no: 'No — escalate',
};

function Section13({
  initiative,
  updatePrd,
}: {
  initiative: Initiative;
  updatePrd: (patch: Partial<PRD>) => void;
}) {
  const compact = initiative.prd.compact;
  const updateCompact = (patch: Partial<typeof compact>) => {
    const next = { ...compact, ...patch };
    if (
      patch.conditionalStatus &&
      patch.conditionalStatus !== 'pending' &&
      compact.conditionalStatus === 'pending'
    ) {
      next.conditionalCapturedAt = new Date().toISOString();
    }
    updatePrd({ compact: next });
  };

  return (
    <SectionWrapper
      id="13"
      title="Conditional Accountability Compact"
      subtitle="A written agreement specifying what will be expected of the executive sponsor if the pilot succeeds. Walk through the four commitments below in conversation, capture the exec's response, and document what they agreed to. The Compact is conditionally signed here; binding execution happens at the Stage 5→6 gate."
    >
      <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <strong className="font-semibold">Why this matters:</strong> the most
        common reason GTM AI initiatives decay after GA is the absence of
        sustained leadership accountability. If an executive will not
        conditionally agree to these terms, that's a strong predictor of GA
        failure — escalate to the scoring panel before proceeding.
      </div>

      <div className="space-y-3">
        <CommitmentCard number={1} title="Verbal expectation-setting before GA launch">
          Before the initiative rolls out to the full population, the executive
          sponsor will verbally communicate to targeted reps and their frontline
          managers that adoption of the desired behaviors is a requirement —
          not a suggestion. This is not delegated to enablement. It comes from
          leadership.
        </CommitmentCard>

        <CommitmentCard number={2} title="Dedicated coaching cadence">
          <span>
            Each frontline manager whose reps are in scope will conduct a
            minimum of{' '}
            <input
              type="number"
              min={0}
              value={compact.coachingCadenceFrequency || ''}
              onChange={(e) =>
                updateCompact({
                  coachingCadenceFrequency:
                    parseInt(e.target.value, 10) || 0,
                })
              }
              placeholder="X"
              className="mx-1 inline-block w-16 rounded border border-gray-300 px-2 py-0.5 text-sm"
            />
            dedicated coaching conversations per{' '}
            <select
              value={compact.coachingCadencePeriod}
              onChange={(e) =>
                updateCompact({
                  coachingCadencePeriod: e.target.value as 'month' | 'quarter',
                })
              }
              className="mx-1 inline-block rounded border border-gray-300 px-2 py-0.5 text-sm"
            >
              <option value="month">month</option>
              <option value="quarter">quarter</option>
            </select>
            , focused specifically on the target behaviors. These are separate
            from deal reviews and pipeline calls.
          </span>
        </CommitmentCard>

        <CommitmentCard number={3} title="Executive accountability for manager compliance">
          The executive sponsor is responsible for monitoring whether frontline
          managers are conducting those coaching conversations and for holding
          managers accountable when they are not.
        </CommitmentCard>

        <CommitmentCard number={4} title="Active participation in the reinforcement arc">
          <span>
            During the first 90 days of GA, the executive sponsor participates
            in at least{' '}
            <input
              type="number"
              min={0}
              value={compact.reinforcementActivitiesCount || ''}
              onChange={(e) =>
                updateCompact({
                  reinforcementActivitiesCount:
                    parseInt(e.target.value, 10) || 0,
                })
              }
              placeholder="X"
              className="mx-1 inline-block w-16 rounded border border-gray-300 px-2 py-0.5 text-sm"
            />
            visible reinforcement activities — team meetings, all-hands
            mentions, or recognition of high-adoption outcomes.
          </span>
        </CommitmentCard>
      </div>

      <Field label="Conditional sign-off status">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {(
            [
              'pending',
              'yes',
              'conditional_yes',
              'no',
            ] as CompactConditionalStatus[]
          ).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => updateCompact({ conditionalStatus: s })}
              className={`rounded-md border px-4 py-2 text-left text-sm transition ${
                compact.conditionalStatus === s
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {COMPACT_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </Field>

      {compact.conditionalStatus === 'no' && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <strong className="font-semibold">Escalate before proceeding.</strong>{' '}
          An executive who will not conditionally agree to these terms is a
          material risk to GA success. Surface this to the scoring panel as
          required by the framework.
        </div>
      )}

      <Field
        label="Discussion notes"
        hint="What did the exec say? Any negotiated modifications? Capture context for future reference."
      >
        <textarea
          value={compact.conditionalNotes}
          onChange={(e) =>
            updateCompact({ conditionalNotes: e.target.value })
          }
          rows={4}
          className={inputClass}
        />
      </Field>

      {compact.conditionalCapturedAt && (
        <div className="text-xs text-gray-500">
          Conditional response captured{' '}
          {new Date(compact.conditionalCapturedAt).toLocaleString()}
        </div>
      )}
    </SectionWrapper>
  );
}

function CommitmentCard({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Commitment {number}
      </div>
      <div className="mt-1 text-sm font-semibold text-gray-900">{title}</div>
      <div className="mt-2 text-sm text-gray-700">{children}</div>
    </div>
  );
}

function formatNumber(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2);
}
