export type Stage =
  | 'prioritize'
  | 'roadmap'
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

export interface Initiative {
  id: string;
  name: string;
  description: string;
  stage: Stage;
  health: Health;
  initiativeOwner: string;
  executiveSponsor: string;
  path: Path | null;
  audiencesServed: string[];
  technologies: string[];
  systemsTouched: string[];
  caret: CARETScores;
  caretNotes: CARETNotes;
  scoredAt: string | null;
  scoredBy: string;
  level3Metric: string;
  intakeDate: string | null;
  pilotStartDate: string | null;
  gaDate: string | null;
  lastReviewedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export const STAGE_LABELS: Record<Stage, string> = {
  prioritize: 'Prioritize',
  roadmap: 'Roadmap',
  deploy: 'Deploy',
  pilot: 'Pilot',
  ga: 'GA',
  killed: 'Killed',
  wound_down: 'Wound Down',
};

export const STAGE_ORDER: Stage[] = [
  'prioritize',
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
    audiencesServed: partial.audiencesServed ?? [],
    technologies: partial.technologies ?? [],
    systemsTouched: partial.systemsTouched ?? [],
    caret: partial.caret ?? { c: 0, a: 0, r: 0, e: 0, t: 0 },
    caretNotes: partial.caretNotes ?? { c: '', a: '', r: '', e: '', t: '' },
    scoredAt: partial.scoredAt ?? null,
    scoredBy: partial.scoredBy ?? '',
    level3Metric: partial.level3Metric ?? '',
    intakeDate: partial.intakeDate ?? todayISO(),
    pilotStartDate: partial.pilotStartDate ?? null,
    gaDate: partial.gaDate ?? null,
    lastReviewedDate: partial.lastReviewedDate ?? null,
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
