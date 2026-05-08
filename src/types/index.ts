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

export interface Initiative {
  id: string;
  name: string;
  description: string;
  stage: Stage;
  health: Health;
  initiativeOwner: string;
  executiveSponsor: string;
  path: Path | null;
  audiencesServed: string;
  technologies: string;
  systemsTouched: string;
  caret: CARETScores;
  level3Metric: string;
  intakeDate: string | null;
  pilotStartDate: string | null;
  gaDate: string | null;
  lastReviewedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export const calculatePriorityScore = (caret: CARETScores): number => {
  const { c, a, r, e, t } = caret;
  if (c === 0 || e === 0) return 0;
  return ((a * r) / (c * e)) * t;
};
