import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useRoadmapStore } from '../store';
import {
  PATH_LABELS,
  calculatePriorityScore,
  type Initiative,
  type MetricCadence,
  type MetricLevel,
  type PRDApprovalStatus,
  type RiskDispositionType,
  type UsageFrequency,
  type CompactConditionalStatus,
} from '../types';
import { FACTOR_ORDER, FACTORS } from '../constants/caret';
import { findMotion } from '../constants/motions';
import { buildPRDMarkdown } from '../lib/prdMarkdown';
import { formatDate } from '../lib/time';

const FREQUENCY_LABELS: Record<UsageFrequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
};

const CADENCE_LABELS: Record<MetricCadence, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
};

const DISPOSITION_LABELS: Record<Exclude<RiskDispositionType, null>, string> = {
  accept: 'Accept',
  mitigate: 'Mitigate',
  escalate: 'Escalate',
  not_applicable: 'Not applicable',
};

const DISPOSITION_STYLES: Record<Exclude<RiskDispositionType, null>, string> = {
  accept: 'bg-gray-100 text-gray-700',
  mitigate: 'bg-amber-100 text-amber-800',
  escalate: 'bg-red-100 text-red-800',
  not_applicable: 'bg-gray-100 text-gray-500',
};

const APPROVAL_LABELS: Record<PRDApprovalStatus, string> = {
  draft: 'Draft',
  approved: 'Approved',
  revised: 'Revised',
};

const COMPACT_STATUS_LABELS: Record<CompactConditionalStatus, string> = {
  pending: 'Not yet asked',
  yes: 'Yes — agreed',
  conditional_yes: 'Conditional yes (with modifications)',
  no: 'No — escalate',
};

const LEVEL_LABELS: Record<MetricLevel, string> = {
  1: 'Level 1 — Behavior',
  2: 'Level 2 — Indicators',
  3: 'Level 3 — Impact',
};

const RISK_ORDER: {
  key: keyof Initiative['prd']['risks'];
  label: string;
  buyOnly?: boolean;
}[] = [
  { key: 'newUI', label: 'New UI / Login Requirement' },
  { key: 'overlappingCapabilities', label: 'Overlapping Capabilities' },
  { key: 'dataQuality', label: 'Data Quality and Completeness' },
  { key: 'integrationFragility', label: 'Integration Fragility' },
  { key: 'vendorLockIn', label: 'Vendor Lock-In', buyOnly: true },
];

const SECTION_GROUPS: {
  part: number;
  title: string;
  sections: { number: number; label: string }[];
}[] = [
  {
    part: 1,
    title: 'What & Why',
    sections: [
      { number: 1, label: 'Initiative Summary' },
      { number: 2, label: 'Prioritization' },
      { number: 3, label: 'Audiences Served' },
      { number: 4, label: 'GTM Motions' },
      { number: 5, label: 'Usage Frequency' },
      { number: 6, label: 'Success Metrics' },
    ],
  },
  {
    part: 2,
    title: 'Deployment',
    sections: [
      { number: 7, label: 'Path: Build or Buy' },
      { number: 8, label: 'Systems & Integrations' },
      { number: 9, label: 'Data Architecture' },
      { number: 10, label: 'Risk Assessment' },
    ],
  },
  {
    part: 3,
    title: 'Implementation',
    sections: [
      { number: 11, label: 'Pilot Plan' },
      { number: 12, label: 'Workstreams' },
      { number: 13, label: 'Approval Mechanism' },
      { number: 14, label: 'Conditional Compact' },
    ],
  },
];

function fmtNum(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(2);
}

export default function PRDView() {
  const { id } = useParams<{ id: string }>();
  const initiative = useRoadmapStore((s) =>
    s.initiatives.find((i) => i.id === id),
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!initiative) return;
    const previousTitle = document.title;
    const date = new Date().toISOString().slice(0, 10);
    document.title = `${initiative.name} - PRD - ${date}`;
    return () => {
      document.title = previousTitle;
    };
  }, [initiative]);

  if (!initiative) return <Navigate to="/" replace />;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildPRDMarkdown(initiative));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-100 print:bg-white">
      <div className="no-print sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link
            to={`/initiatives/${initiative.id}/prd`}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to PRD
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              {copied ? 'Copied!' : 'Copy as Markdown'}
            </button>
            <button
              onClick={() => window.print()}
              className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto my-8 flex max-w-6xl gap-8 px-4 print:my-0 print:block print:max-w-none print:px-0">
        <aside className="no-print hidden w-56 shrink-0 lg:block">
          <TableOfContents />
        </aside>
        <article className="min-w-0 flex-1 bg-white px-10 py-12 shadow-sm print:px-0 print:py-0 print:shadow-none">
          <DocumentHeader initiative={initiative} />
          <GroupHeader part={1} title="What & Why" first />
          <Section1 initiative={initiative} />
          <Section2 initiative={initiative} />
          <Section3 initiative={initiative} />
          <Section4 initiative={initiative} />
          <Section5 initiative={initiative} />
          <Section6 initiative={initiative} />
          <GroupHeader part={2} title="Deployment" />
          <Section7 initiative={initiative} />
          <Section8 initiative={initiative} />
          <Section9 initiative={initiative} />
          <Section10 initiative={initiative} />
          <GroupHeader part={3} title="Implementation" />
          <Section11 initiative={initiative} />
          <Section12 initiative={initiative} />
          <Section13 initiative={initiative} />
          <Section14 initiative={initiative} />
        </article>
      </div>
    </div>
  );
}

function TableOfContents() {
  const scrollTo = (elementId: string) => {
    document
      .getElementById(elementId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <nav className="sticky top-20">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        Contents
      </div>
      <div className="space-y-4">
        {SECTION_GROUPS.map((group) => (
          <div key={group.part}>
            <button
              type="button"
              onClick={() => scrollTo(`prd-part-${group.part}`)}
              className="mb-1 block text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-900"
            >
              Part {group.part} · {group.title}
            </button>
            <ul className="space-y-0.5">
              {group.sections.map((s) => (
                <li key={s.number}>
                  <button
                    type="button"
                    onClick={() => scrollTo(`prd-section-${s.number}`)}
                    className="block w-full rounded px-2 py-1 text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <span className="text-gray-400">{s.number}.</span>{' '}
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

function GroupHeader({
  part,
  title,
  first,
}: {
  part: number;
  title: string;
  first?: boolean;
}) {
  return (
    <div
      id={`prd-part-${part}`}
      className={`scroll-mt-24 break-after-avoid border-t-2 border-gray-900 pt-3 ${
        first ? 'mt-8' : 'mt-14'
      }`}
    >
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
        Part {part}
      </div>
      <div className="mt-0.5 text-2xl font-semibold tracking-tight text-gray-900">
        {title}
      </div>
    </div>
  );
}

// ===== Shared building blocks =====

function DocumentHeader({ initiative }: { initiative: Initiative }) {
  const prd = initiative.prd;
  const meta: { label: string; value: string }[] = [
    { label: 'Initiative Owner', value: initiative.initiativeOwner.trim() || '—' },
    {
      label: 'Executive Sponsor',
      value: initiative.executiveSponsor.trim() || '—',
    },
    {
      label: 'Path',
      value: initiative.path ? PATH_LABELS[initiative.path] : 'Not yet decided',
    },
    { label: 'Approval Status', value: APPROVAL_LABELS[prd.approvalStatus] },
    { label: 'Generated', value: new Date().toLocaleDateString() },
  ];
  return (
    <header className="break-inside-avoid border-b border-gray-300 pb-6">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Stage 2 · Product Requirements Document
      </div>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
        {initiative.name}
      </h1>
      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
        {meta.map((m) => (
          <div key={m.label}>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {m.label}
            </dt>
            <dd className="text-sm text-gray-900">{m.value}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}

function Section({
  number,
  title,
  first,
  children,
}: {
  number: number;
  title: string;
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={`prd-section-${number}`}
      className={
        first
          ? 'mt-8 scroll-mt-24'
          : 'mt-8 scroll-mt-24 border-t border-gray-200 pt-6'
      }
    >
      <h2 className="break-after-avoid">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Section {number}
        </span>
        <span className="mt-0.5 block text-lg font-semibold text-gray-900">
          {title}
        </span>
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Placeholder() {
  return (
    <p className="text-sm italic text-gray-400">Not yet documented.</p>
  );
}

function Prose({ value }: { value: string }) {
  const t = value.trim();
  if (!t) return <Placeholder />;
  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
      {t}
    </p>
  );
}

function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  if (items.length === 0) return <Placeholder />;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

// ===== Sections =====

function Section1({ initiative }: { initiative: Initiative }) {
  return (
    <Section number={1} title="Initiative Summary" first>
      <FieldBlock label="Description">
        <Prose value={initiative.description} />
      </FieldBlock>
      <FieldBlock label="Business Rationale">
        <Prose value={initiative.businessRationale} />
      </FieldBlock>
    </Section>
  );
}

function Section2({ initiative }: { initiative: Initiative }) {
  const score = calculatePriorityScore(initiative.caret);
  return (
    <Section number={2} title="Prioritization">
      <div className="break-inside-avoid">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          CARET Priority Score
        </div>
        <div className="mt-0.5 font-mono text-2xl font-semibold text-gray-900">
          {score === null ? (
            <span className="text-gray-400">Not yet scored</span>
          ) : (
            score.toFixed(2)
          )}
        </div>
        <div className="mt-0.5 text-xs text-gray-500">(A × R) / (C × E) × T</div>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {FACTOR_ORDER.map((f) => (
            <div key={f} className="rounded-md bg-gray-50 px-2 py-2 text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {FACTORS[f].letter}
              </div>
              <div className="mt-0.5 text-[10px] text-gray-600">
                {FACTORS[f].name}
              </div>
              <div className="mt-1 font-mono text-base font-semibold text-gray-900">
                {initiative.caret[f] > 0
                  ? fmtNum(initiative.caret[f])
                  : '—'}
              </div>
            </div>
          ))}
        </div>
        {initiative.scoredBy.trim() && (
          <div className="mt-2 text-xs text-gray-500">
            Scored by: {initiative.scoredBy.trim()}
          </div>
        )}
      </div>
    </Section>
  );
}

function Section3({ initiative }: { initiative: Initiative }) {
  return (
    <Section number={3} title="Audiences Served">
      <FieldBlock label="Primary audiences">
        <TagList items={initiative.primaryAudiences} />
      </FieldBlock>
      <FieldBlock label="Secondary audiences">
        <TagList items={initiative.secondaryAudiences} />
      </FieldBlock>
    </Section>
  );
}

function Section4({ initiative }: { initiative: Initiative }) {
  const byCategory = new Map<string, string[]>();
  for (const motionId of initiative.gtmMotions) {
    const found = findMotion(motionId);
    const category = found?.category.label ?? 'Other';
    const label = found?.motion.label ?? motionId;
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category)!.push(label);
  }
  return (
    <Section number={4} title="GTM Motions">
      {byCategory.size === 0 ? (
        <Placeholder />
      ) : (
        <div className="space-y-3">
          {[...byCategory.entries()].map(([category, motions]) => (
            <div key={category}>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                {category}
              </div>
              <div className="mt-1">
                <TagList items={motions} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

function Section5({ initiative }: { initiative: Initiative }) {
  return (
    <Section number={5} title="Usage Frequency">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldBlock label="Primary audience usage">
          {initiative.usageFrequencyPrimary ? (
            <p className="text-sm text-gray-700">
              {FREQUENCY_LABELS[initiative.usageFrequencyPrimary]}
            </p>
          ) : (
            <Placeholder />
          )}
        </FieldBlock>
        <FieldBlock label="Secondary audience usage">
          {initiative.usageFrequencySecondary ? (
            <p className="text-sm text-gray-700">
              {FREQUENCY_LABELS[initiative.usageFrequencySecondary]}
            </p>
          ) : (
            <Placeholder />
          )}
        </FieldBlock>
      </div>
    </Section>
  );
}

function Section6({ initiative }: { initiative: Initiative }) {
  const metrics = initiative.prd.metrics;
  return (
    <Section number={6} title="Success Metrics">
      {([1, 2, 3] as MetricLevel[]).map((level) => {
        const levelMetrics = metrics.filter((m) => m.level === level);
        return (
          <div key={level}>
            <div className="text-sm font-semibold text-gray-900">
              {LEVEL_LABELS[level]}
            </div>
            <div className="mt-2 space-y-2">
              {levelMetrics.length === 0 ? (
                <p className="text-sm italic text-gray-400">
                  No Level {level} metrics defined.
                </p>
              ) : (
                levelMetrics.map((m) => (
                  <div
                    key={m.id}
                    className="break-inside-avoid rounded-md border border-gray-200 p-3"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {m.name.trim() || (
                        <span className="italic text-gray-400">
                          Unnamed metric
                        </span>
                      )}
                    </div>
                    <dl className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
                      <div>
                        <dt className="text-gray-400">Baseline</dt>
                        <dd className="text-gray-700">
                          {m.baseline.trim() || '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Target</dt>
                        <dd className="text-gray-700">
                          {m.target.trim() || '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Cadence</dt>
                        <dd className="text-gray-700">
                          {CADENCE_LABELS[m.cadence]}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Tracking</dt>
                        <dd className="text-gray-700">
                          {m.trackingMechanism.trim() || '—'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </Section>
  );
}

function Section7({ initiative }: { initiative: Initiative }) {
  return (
    <Section number={7} title="Path: Build or Buy" first>
      <FieldBlock label="Path">
        <p className="text-sm text-gray-700">
          {initiative.path
            ? PATH_LABELS[initiative.path]
            : 'Not yet decided'}
        </p>
      </FieldBlock>
      {initiative.path === 'buy' && (
        <FieldBlock label="Primary vendor">
          {initiative.primaryVendor.trim() ? (
            <p className="text-sm text-gray-700">
              {initiative.primaryVendor.trim()}
            </p>
          ) : (
            <Placeholder />
          )}
        </FieldBlock>
      )}
      <FieldBlock label="Rationale">
        <Prose value={initiative.prd.pathRationale} />
      </FieldBlock>
    </Section>
  );
}

function Section8({ initiative }: { initiative: Initiative }) {
  return (
    <Section number={8} title="Systems and Integrations">
      <FieldBlock label="Systems touched during operation">
        <TagList items={initiative.systemsTouched} />
      </FieldBlock>
    </Section>
  );
}

function Section9({ initiative }: { initiative: Initiative }) {
  return (
    <Section number={9} title="Data Architecture">
      <Prose value={initiative.prd.dataArchitecture} />
    </Section>
  );
}

function Section10({ initiative }: { initiative: Initiative }) {
  const isBuy = initiative.path === 'buy';
  const risks = initiative.prd.risks;
  return (
    <Section number={10} title="Risk Assessment">
      {RISK_ORDER.filter((r) => !r.buyOnly || isBuy).map((r) => {
        const risk = risks[r.key];
        return (
          <div
            key={r.key}
            className="break-inside-avoid rounded-md border border-gray-200 p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-gray-900">
                {r.label}
              </div>
              {risk.disposition ? (
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${DISPOSITION_STYLES[risk.disposition]}`}
                >
                  {DISPOSITION_LABELS[risk.disposition]}
                </span>
              ) : (
                <span className="shrink-0 text-xs italic text-gray-400">
                  No disposition set
                </span>
              )}
            </div>
            {risk.notes.trim() && (
              <p className="mt-1.5 whitespace-pre-wrap text-sm text-gray-700">
                {risk.notes.trim()}
              </p>
            )}
          </div>
        );
      })}
    </Section>
  );
}

function Section11({ initiative }: { initiative: Initiative }) {
  const pp = initiative.prd.pilotPlan;
  return (
    <Section number={11} title="Pilot Plan" first>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldBlock label="Cohort">
          <Prose value={pp.cohortDescription} />
        </FieldBlock>
        <FieldBlock label="Cohort selection rationale">
          <Prose value={pp.cohortRationale} />
        </FieldBlock>
      </div>
      <FieldBlock label="Timeline">
        {pp.timeline.trim() ? (
          <p className="text-sm text-gray-700">{pp.timeline.trim()}</p>
        ) : (
          <Placeholder />
        )}
      </FieldBlock>
      <FieldBlock label="Intervention design">
        <Prose value={pp.interventionDesign} />
      </FieldBlock>
      <div className="break-inside-avoid rounded-md border border-gray-200 bg-gray-50 p-3">
        <div className="text-sm font-semibold text-gray-900">
          Decision criteria
        </div>
        <div className="mt-3 space-y-3">
          <FieldBlock label="Proceed to GA">
            <Prose value={pp.scaleDecision} />
          </FieldBlock>
          <FieldBlock label="Fix and Re-Pilot">
            <Prose value={pp.fixDecision} />
          </FieldBlock>
          <FieldBlock label="Kill">
            <Prose value={pp.killDecision} />
          </FieldBlock>
        </div>
      </div>
    </Section>
  );
}

function Section12({ initiative }: { initiative: Initiative }) {
  const workstreams = initiative.prd.workstreams;
  return (
    <Section number={12} title="Workstream Assignments">
      {workstreams.length === 0 ? (
        <Placeholder />
      ) : (
        <div className="space-y-2">
          {workstreams.map((w) => (
            <div
              key={w.id}
              className="break-inside-avoid rounded-md border border-gray-200 p-3"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="text-sm font-medium text-gray-900">
                  {w.name.trim() || (
                    <span className="italic text-gray-400">
                      Unnamed workstream
                    </span>
                  )}
                </div>
                <div className="shrink-0 text-xs text-gray-500">
                  {w.targetDate ? formatDate(w.targetDate) : 'Target TBD'}
                </div>
              </div>
              <div className="mt-0.5 text-xs text-gray-500">
                Owner: {w.owner.trim() || 'TBD'}
              </div>
              {w.description.trim() && (
                <p className="mt-1.5 whitespace-pre-wrap text-sm text-gray-700">
                  {w.description.trim()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

function Section13({ initiative }: { initiative: Initiative }) {
  const prd = initiative.prd;
  return (
    <Section number={13} title="Approval Mechanism">
      <FieldBlock label="Approval process">
        <Prose value={prd.approvalMechanism} />
      </FieldBlock>
      <FieldBlock label="Approval status">
        <p className="text-sm text-gray-700">
          {APPROVAL_LABELS[prd.approvalStatus]}
          {prd.approvalStatus === 'approved' && prd.approvedAt && (
            <span className="text-gray-500">
              {' '}
              · approved {formatDate(prd.approvedAt)}
            </span>
          )}
        </p>
      </FieldBlock>
    </Section>
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
    <div className="break-inside-avoid rounded-md border border-gray-200 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        Commitment {number}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-gray-900">{title}</div>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-700">{children}</p>
    </div>
  );
}

function Section14({ initiative }: { initiative: Initiative }) {
  const compact = initiative.prd.compact;
  const cadenceFreq = compact.coachingCadenceFrequency
    ? String(compact.coachingCadenceFrequency)
    : '[X]';
  const reinforcementCount = compact.reinforcementActivitiesCount
    ? String(compact.reinforcementActivitiesCount)
    : '[X]';
  return (
    <Section number={14} title="Conditional Accountability Compact">
      <div className="space-y-3">
        <CommitmentCard
          number={1}
          title="Verbal expectation-setting before GA launch"
        >
          Before the initiative rolls out to the full population, the executive
          sponsor will verbally communicate to targeted reps and their frontline
          managers that adoption of the desired behaviors is a requirement — not
          a suggestion. This is not delegated to enablement. It comes from
          leadership.
        </CommitmentCard>
        <CommitmentCard number={2} title="Dedicated coaching cadence">
          Each frontline manager whose reps are in scope will conduct a minimum
          of {cadenceFreq} dedicated coaching conversations per{' '}
          {compact.coachingCadencePeriod}, focused specifically on the target
          behaviors. These are separate from deal reviews and pipeline calls.
        </CommitmentCard>
        <CommitmentCard
          number={3}
          title="Executive accountability for manager compliance"
        >
          The executive sponsor is responsible for monitoring whether frontline
          managers are conducting those coaching conversations and for holding
          managers accountable when they are not.
        </CommitmentCard>
        <CommitmentCard
          number={4}
          title="Active participation in the reinforcement arc"
        >
          During the first 90 days of GA, the executive sponsor participates in
          at least {reinforcementCount} visible reinforcement activities — team
          meetings, all-hands mentions, or recognition of high-adoption
          outcomes.
        </CommitmentCard>
      </div>
      <FieldBlock label="Conditional sign-off status">
        <p className="text-sm text-gray-700">
          {COMPACT_STATUS_LABELS[compact.conditionalStatus]}
        </p>
      </FieldBlock>
      {compact.conditionalStatus === 'no' && (
        <div className="break-inside-avoid rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          <strong className="font-semibold">
            Escalate before proceeding.
          </strong>{' '}
          An executive who will not conditionally agree to these terms is a
          material risk to GA success.
        </div>
      )}
      {compact.conditionalNotes.trim() && (
        <FieldBlock label="Discussion notes">
          <Prose value={compact.conditionalNotes} />
        </FieldBlock>
      )}
      {compact.conditionalCapturedAt && (
        <div className="text-xs text-gray-500">
          Conditional response captured{' '}
          {formatDate(compact.conditionalCapturedAt)}
        </div>
      )}
    </Section>
  );
}
