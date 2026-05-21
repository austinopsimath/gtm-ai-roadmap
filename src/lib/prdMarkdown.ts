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
import { formatDate } from './time';

const PLACEHOLDER = '_Not yet documented._';

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

const LEVEL_LABELS: Record<MetricLevel, string> = {
  1: 'Level 1 — Behavior',
  2: 'Level 2 — Indicators',
  3: 'Level 3 — Impact',
};

function fmtNum(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(2);
}

function text(v: string): string {
  const t = v.trim();
  return t ? t : PLACEHOLDER;
}

function bulletList(items: string[]): string {
  return items.length ? items.map((i) => `- ${i}`).join('\n') : PLACEHOLDER;
}

function motionsMarkdown(ids: string[]): string {
  if (!ids.length) return PLACEHOLDER;
  const byCategory = new Map<string, string[]>();
  for (const id of ids) {
    const found = findMotion(id);
    const category = found?.category.label ?? 'Other';
    const label = found?.motion.label ?? id;
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category)!.push(label);
  }
  return [...byCategory.entries()]
    .map(
      ([category, motions]) =>
        `**${category}**\n${motions.map((m) => `- ${m}`).join('\n')}`,
    )
    .join('\n\n');
}

/**
 * Renders the full PRD as a Markdown document — the "Copy as Markdown" payload
 * for pasting into Notion, Google Docs, Slack, or email.
 */
export function buildPRDMarkdown(initiative: Initiative): string {
  const prd = initiative.prd;
  const isBuy = initiative.path === 'buy';
  const out: string[] = [];

  // Title block
  out.push('# Product Requirements Document');
  out.push(`## ${initiative.name}`);
  out.push(
    [
      `**Initiative Owner:** ${text(initiative.initiativeOwner)}`,
      `**Executive Sponsor:** ${text(initiative.executiveSponsor)}`,
      `**Path:** ${initiative.path ? PATH_LABELS[initiative.path] : 'Not yet decided'}`,
      `**Approval Status:** ${APPROVAL_LABELS[prd.approvalStatus]}`,
      `**Generated:** ${new Date().toLocaleDateString()}`,
    ].join('  \n'),
  );
  out.push('---');

  // 1. Initiative Summary
  out.push('## 1. Initiative Summary');
  out.push(`**Description**\n\n${text(initiative.description)}`);
  out.push(`**Business Rationale**\n\n${text(initiative.businessRationale)}`);

  // 2. Prioritization
  out.push('## 2. Prioritization');
  const score = calculatePriorityScore(initiative.caret);
  out.push(
    `**CARET Priority Score:** ${
      score === null ? 'Not yet scored' : score.toFixed(2)
    }  \n_Formula: (A × R) / (C × E) × T_`,
  );
  const caretRows = ['| Factor | Score |', '|---|---|'];
  for (const f of FACTOR_ORDER) {
    const v = initiative.caret[f];
    caretRows.push(
      `| ${FACTORS[f].letter} — ${FACTORS[f].name} | ${
        v > 0 ? fmtNum(v) : '—'
      } |`,
    );
  }
  out.push(caretRows.join('\n'));
  if (initiative.scoredBy.trim()) {
    out.push(`_Scored by: ${initiative.scoredBy.trim()}_`);
  }

  // 3. Audiences Served
  out.push('## 3. Audiences Served');
  out.push(`**Primary audiences**\n\n${bulletList(initiative.primaryAudiences)}`);
  out.push(
    `**Secondary audiences**\n\n${bulletList(initiative.secondaryAudiences)}`,
  );

  // 4. GTM Motions
  out.push('## 4. GTM Motions');
  out.push(motionsMarkdown(initiative.gtmMotions));

  // 5. Usage Frequency
  out.push('## 5. Usage Frequency');
  out.push(
    `**Primary audience usage:** ${
      initiative.usageFrequencyPrimary
        ? FREQUENCY_LABELS[initiative.usageFrequencyPrimary]
        : PLACEHOLDER
    }`,
  );
  out.push(
    `**Secondary audience usage:** ${
      initiative.usageFrequencySecondary
        ? FREQUENCY_LABELS[initiative.usageFrequencySecondary]
        : PLACEHOLDER
    }`,
  );

  // 6. Success Metrics
  out.push('## 6. Success Metrics');
  for (const level of [1, 2, 3] as MetricLevel[]) {
    out.push(`### ${LEVEL_LABELS[level]}`);
    const levelMetrics = prd.metrics.filter((m) => m.level === level);
    if (levelMetrics.length === 0) {
      out.push(`_No Level ${level} metrics defined._`);
      continue;
    }
    for (const m of levelMetrics) {
      out.push(
        [
          `- **${m.name.trim() || 'Unnamed metric'}**`,
          `  - Baseline: ${m.baseline.trim() || '—'}`,
          `  - Target: ${m.target.trim() || '—'}`,
          `  - Cadence: ${CADENCE_LABELS[m.cadence]}`,
          `  - Tracking: ${m.trackingMechanism.trim() || '—'}`,
        ].join('\n'),
      );
    }
  }

  // 7. Path: Build or Buy
  out.push('## 7. Path: Build or Buy');
  out.push(
    `**Path:** ${initiative.path ? PATH_LABELS[initiative.path] : 'Not yet decided'}`,
  );
  if (isBuy) {
    out.push(`**Primary vendor:** ${text(initiative.primaryVendor)}`);
  }
  out.push(`**Rationale**\n\n${text(prd.pathRationale)}`);

  // 8. Systems and Integrations
  out.push('## 8. Systems and Integrations');
  out.push(bulletList(initiative.systemsTouched));

  // 9. Data Architecture
  out.push('## 9. Data Architecture');
  out.push(text(prd.dataArchitecture));

  // 10. Risk Assessment
  out.push('## 10. Risk Assessment');
  for (const r of RISK_ORDER) {
    if (r.buyOnly && !isBuy) continue;
    const risk = prd.risks[r.key];
    const disposition = risk.disposition
      ? DISPOSITION_LABELS[risk.disposition]
      : 'No disposition set';
    out.push(`**${r.label}** — ${disposition}`);
    if (risk.notes.trim()) out.push(risk.notes.trim());
  }

  // 11. Pilot Plan
  out.push('## 11. Pilot Plan');
  const pp = prd.pilotPlan;
  out.push(`**Cohort**\n\n${text(pp.cohortDescription)}`);
  out.push(`**Cohort selection rationale**\n\n${text(pp.cohortRationale)}`);
  out.push(`**Timeline:** ${text(pp.timeline)}`);
  out.push(`**Intervention design**\n\n${text(pp.interventionDesign)}`);
  out.push(`**Decision criteria — Proceed to GA**\n\n${text(pp.scaleDecision)}`);
  out.push(`**Decision criteria — Fix and Re-Pilot**\n\n${text(pp.fixDecision)}`);
  out.push(`**Decision criteria — Kill**\n\n${text(pp.killDecision)}`);

  // 12. Workstream Assignments
  out.push('## 12. Workstream Assignments');
  if (prd.workstreams.length === 0) {
    out.push(PLACEHOLDER);
  } else {
    for (const w of prd.workstreams) {
      const meta = [
        `Owner: ${w.owner.trim() || 'TBD'}`,
        `Target: ${w.targetDate ? formatDate(w.targetDate) : 'TBD'}`,
      ].join(' · ');
      out.push(`- **${w.name.trim() || 'Unnamed workstream'}** — ${meta}`);
      if (w.description.trim()) out.push(`  ${w.description.trim()}`);
    }
  }

  // 13. Approval Mechanism
  out.push('## 13. Approval Mechanism');
  out.push(`**Process**\n\n${text(prd.approvalMechanism)}`);
  out.push(`**Status:** ${APPROVAL_LABELS[prd.approvalStatus]}`);
  if (prd.approvalStatus === 'approved' && prd.approvedAt) {
    out.push(`_Approved ${formatDate(prd.approvedAt)}_`);
  }

  // 14. Conditional Accountability Compact
  out.push('## 14. Conditional Accountability Compact');
  const compact = prd.compact;
  const cadenceFreq = compact.coachingCadenceFrequency
    ? String(compact.coachingCadenceFrequency)
    : '[X]';
  const reinforcementCount = compact.reinforcementActivitiesCount
    ? String(compact.reinforcementActivitiesCount)
    : '[X]';
  out.push(
    '**Commitment 1 — Verbal expectation-setting before GA launch**\n\n' +
      'Before the initiative rolls out to the full population, the executive ' +
      'sponsor will verbally communicate to targeted reps and their frontline ' +
      'managers that adoption of the desired behaviors is a requirement — not a ' +
      'suggestion. This is not delegated to enablement. It comes from leadership.',
  );
  out.push(
    '**Commitment 2 — Dedicated coaching cadence**\n\n' +
      `Each frontline manager whose reps are in scope will conduct a minimum of ${cadenceFreq} ` +
      `dedicated coaching conversations per ${compact.coachingCadencePeriod}, focused ` +
      'specifically on the target behaviors. These are separate from deal reviews ' +
      'and pipeline calls.',
  );
  out.push(
    '**Commitment 3 — Executive accountability for manager compliance**\n\n' +
      'The executive sponsor is responsible for monitoring whether frontline ' +
      'managers are conducting those coaching conversations and for holding ' +
      'managers accountable when they are not.',
  );
  out.push(
    '**Commitment 4 — Active participation in the reinforcement arc**\n\n' +
      `During the first 90 days of GA, the executive sponsor participates in at ` +
      `least ${reinforcementCount} visible reinforcement activities — team meetings, ` +
      'all-hands mentions, or recognition of high-adoption outcomes.',
  );
  out.push(
    `**Conditional sign-off status:** ${COMPACT_STATUS_LABELS[compact.conditionalStatus]}`,
  );
  if (compact.conditionalNotes.trim()) {
    out.push(`**Discussion notes**\n\n${compact.conditionalNotes.trim()}`);
  }
  if (compact.conditionalCapturedAt) {
    out.push(`_Conditional response captured ${formatDate(compact.conditionalCapturedAt)}_`);
  }

  return out.join('\n\n') + '\n';
}
