export type Stage =
  | 'prioritize'
  | 'roadmap'
  | 'prd'
  | 'deploy'
  | 'pilot'
  | 'ga'
  | 'killed'
  | 'wound_down';

export type Health = 'green' | 'yellow' | 'red';

export type Path = 'build' | 'buy';

export interface CARETScores {
  c: number;
  a: number;
  r: number;
  e: number;
  t: number;
}

export interface CARETNotes {
  c: string;
  a: string;
  r: string;
  e: string;
  t: string;
}

export type CARETFactor = 'c' | 'a' | 'r' | 'e' | 't';

export interface Panelist {
  id: string;
  name: string;
  role: string;
  scores: CARETScores;
}

// ===== PRD types =====

export type MetricLevel = 1 | 2 | 3;
export type MetricCadence = 'daily' | 'weekly' | 'monthly' | 'quarterly';

export interface MetricDef {
  id: string;
  level: MetricLevel;
  name: string;
  baseline: string;
  target: string;
  cadence: MetricCadence;
  trackingMechanism: string;
}

export type RiskDispositionType = 'accept' | 'mitigate' | 'escalate' | null;

export interface RiskDisposition {
  disposition: RiskDispositionType;
  notes: string;
}

export interface PRDRisks {
  newUI: RiskDisposition;
  overlappingCapabilities: RiskDisposition;
  dataQuality: RiskDisposition;
  integrationFragility: RiskDisposition;
  vendorLockIn: RiskDisposition;
}

export interface PilotPlan {
  cohortDescription: string;
  cohortRationale: string;
  timeline: string;
  interventionDesign: string;
  scaleDecision: string;
  fixDecision: string;
  killDecision: string;
}

export interface Workstream {
  id: string;
  name: string;
  description: string;
  owner: string;
  targetDate: string | null;
}

export type CompactConditionalStatus =
  | 'pending'
  | 'yes'
  | 'conditional_yes'
  | 'no';

export interface CompactState {
  coachingCadenceFrequency: number;
  coachingCadencePeriod: 'month' | 'quarter';
  reinforcementActivitiesCount: number;
  conditionalStatus: CompactConditionalStatus;
  conditionalNotes: string;
  conditionalCapturedAt: string | null;
}

export type PRDApprovalStatus = 'draft' | 'approved' | 'revised';

export interface PRD {
  metrics: MetricDef[];
  pathRationale: string;
  dataArchitecture: string;
  risks: PRDRisks;
  pilotPlan: PilotPlan;
  workstreams: Workstream[];
  approvalMechanism: string;
  approvalStatus: PRDApprovalStatus;
  approvedAt: string | null;
  compact: CompactState;
}

export const emptyRiskDisposition = (): RiskDisposition => ({
  disposition: null,
  notes: '',
});

export const emptyPRDRisks = (): PRDRisks => ({
  newUI: emptyRiskDisposition(),
  overlappingCapabilities: emptyRiskDisposition(),
  dataQuality: emptyRiskDisposition(),
  integrationFragility: emptyRiskDisposition(),
  vendorLockIn: emptyRiskDisposition(),
});

export const emptyPilotPlan = (): PilotPlan => ({
  cohortDescription: '',
  cohortRationale: '',
  timeline: '',
  interventionDesign: '',
  scaleDecision: '',
  fixDecision: '',
  killDecision: '',
});

export const emptyCompactState = (): CompactState => ({
  coachingCadenceFrequency: 0,
  coachingCadencePeriod: 'month',
  reinforcementActivitiesCount: 0,
  conditionalStatus: 'pending',
  conditionalNotes: '',
  conditionalCapturedAt: null,
});

export const emptyPRD = (): PRD => ({
  metrics: [],
  pathRationale: '',
  dataArchitecture: '',
  risks: emptyPRDRisks(),
  pilotPlan: emptyPilotPlan(),
  workstreams: [],
  approvalMechanism: '',
  approvalStatus: 'draft',
  approvedAt: null,
  compact: emptyCompactState(),
});

export const createMetric = (partial: Partial<MetricDef> = {}): MetricDef => ({
  id: partial.id ?? crypto.randomUUID(),
  level: partial.level ?? 1,
  name: partial.name ?? '',
  baseline: partial.baseline ?? '',
  target: partial.target ?? '',
  cadence: partial.cadence ?? 'weekly',
  trackingMechanism: partial.trackingMechanism ?? '',
});

export const createWorkstream = (
  partial: Partial<Workstream> = {},
): Workstream => ({
  id: partial.id ?? crypto.randomUUID(),
  name: partial.name ?? '',
  description: partial.description ?? '',
  owner: partial.owner ?? '',
  targetDate: partial.targetDate ?? null,
});

export interface Initiative {
  id: string;
  name: string;
  description: string;
  stage: Stage;
  health: Health;
  initiativeOwner: string;
  executiveSponsor: string;
  path: Path | null;
  primaryVendor: string;
  audiencesServed: string[];
  technologies: string[];
  systemsTouched: string[];
  caret: CARETScores;
  caretNotes: CARETNotes;
  panelists: Panelist[];
  scoredAt: string | null;
  scoredBy: string;
  level3Metric: string;
  intakeDate: string | null;
  deployStartDate: string | null;
  pilotStartDate: string | null;
  gaDate: string | null;
  lastReviewedDate: string | null;
  prd: PRD;
  createdAt: string;
  updatedAt: string;
}

export const FACTOR_KEYS: CARETFactor[] = ['c', 'a', 'r', 'e', 't'];

// Sentinel for explicitly-marked-N/A scores. 0 still means "not yet scored".
// Both are excluded from averages via the > 0 filter, so the math is unchanged;
// the sentinel just lets the UI render "N/A" instead of an empty cell.
export const NA_SCORE = -1;

export const isNA = (score: number): boolean => score === NA_SCORE;

export const emptyScores = (): CARETScores => ({
  c: 0,
  a: 0,
  r: 0,
  e: 0,
  t: 0,
});

export const createPanelist = (
  partial: Partial<Panelist> = {},
): Panelist => ({
  id: partial.id ?? crypto.randomUUID(),
  name: partial.name ?? '',
  role: partial.role ?? '',
  scores: partial.scores ?? emptyScores(),
});

export const computeFactorAverage = (
  panelists: Panelist[],
  factor: CARETFactor,
): number => {
  const values = panelists
    .map((p) => p.scores[factor])
    .filter((v) => v > 0);
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
};

export const computeConsensusScores = (panelists: Panelist[]): CARETScores => ({
  c: computeFactorAverage(panelists, 'c'),
  a: computeFactorAverage(panelists, 'a'),
  r: computeFactorAverage(panelists, 'r'),
  e: computeFactorAverage(panelists, 'e'),
  t: computeFactorAverage(panelists, 't'),
});

export const factorDivergence = (
  panelists: Panelist[],
  factor: CARETFactor,
): number => {
  const values = panelists
    .map((p) => p.scores[factor])
    .filter((v) => v > 0);
  if (values.length < 2) return 0;
  return Math.max(...values) - Math.min(...values);
};

export const STAGE_LABELS: Record<Stage, string> = {
  prioritize: 'Prioritize',
  roadmap: 'Calendar',
  prd: 'PRD',
  deploy: 'Deploy',
  pilot: 'Pilot',
  ga: 'GA',
  killed: 'Killed',
  wound_down: 'Wound Down',
};

export const STAGE_ORDER: Stage[] = [
  'prioritize',
  'prd',
  'roadmap',
  'deploy',
  'pilot',
  'ga',
  'killed',
  'wound_down',
];

export const HEALTH_LABELS: Record<Health, string> = {
  green: 'Green',
  yellow: 'Yellow',
  red: 'Red',
};

export const PATH_LABELS: Record<Path, string> = {
  build: 'Build',
  buy: 'Buy',
};

export const calculatePriorityScore = (caret: CARETScores): number | null => {
  const { c, a, r, e, t } = caret;
  if (!c || !a || !r || !e || !t) return null;
  return ((a * r) / (c * e)) * t;
};

export const todayISO = (): string => new Date().toISOString().slice(0, 10);

export const createInitiative = (
  partial: Partial<Initiative> & { name: string },
): Initiative => {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: partial.name,
    description: partial.description ?? '',
    stage: partial.stage ?? 'prioritize',
    health: partial.health ?? 'green',
    initiativeOwner: partial.initiativeOwner ?? '',
    executiveSponsor: partial.executiveSponsor ?? '',
    path: partial.path ?? null,
    primaryVendor: partial.primaryVendor ?? '',
    audiencesServed: partial.audiencesServed ?? [],
    technologies: partial.technologies ?? [],
    systemsTouched: partial.systemsTouched ?? [],
    caret: partial.caret ?? emptyScores(),
    caretNotes: partial.caretNotes ?? { c: '', a: '', r: '', e: '', t: '' },
    panelists: partial.panelists ?? [],
    scoredAt: partial.scoredAt ?? null,
    scoredBy: partial.scoredBy ?? '',
    level3Metric: partial.level3Metric ?? '',
    intakeDate: partial.intakeDate ?? todayISO(),
    deployStartDate: partial.deployStartDate ?? null,
    pilotStartDate: partial.pilotStartDate ?? null,
    gaDate: partial.gaDate ?? null,
    lastReviewedDate: partial.lastReviewedDate ?? null,
    prd: partial.prd ?? emptyPRD(),
    createdAt: partial.createdAt ?? now,
    updatedAt: now,
  };
};

export interface BackupFile {
  version: 1;
  exportedAt: string;
  initiatives: Initiative[];
}

export const isBackupFile = (data: unknown): data is BackupFile => {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    d.version === 1 &&
    typeof d.exportedAt === 'string' &&
    Array.isArray(d.initiatives)
  );
};
