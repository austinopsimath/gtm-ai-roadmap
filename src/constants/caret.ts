import type { CARETFactor } from '../types';

export interface FactorCopy {
  factor: CARETFactor;
  letter: string;
  name: string;
  question: string;
  role: string;
  scaleNotes: string;
  scaleLabels: { value: number; short: string; long: string }[];
  guidance?: string;
}

export const FACTOR_ORDER: CARETFactor[] = ['c', 'a', 'r', 'e', 't'];

export const FACTORS: Record<CARETFactor, FactorCopy> = {
  c: {
    factor: 'c',
    letter: 'C',
    name: 'Complexity',
    question: 'How technically difficult is it to build or integrate?',
    role: 'Denominator (higher complexity → lower priority score)',
    scaleNotes: 'Score 1 (simple) → 5 (extremely complex).',
    scaleLabels: [
      { value: 1, short: '1', long: 'Simple — straightforward integration or trivial build' },
      { value: 2, short: '2', long: 'Modest — a few moving pieces but well-understood patterns' },
      { value: 3, short: '3', long: 'Moderate — meaningful integration work, multiple systems' },
      { value: 4, short: '4', long: 'Hard — novel architecture, significant data work' },
      { value: 5, short: '5', long: 'Extremely complex — research-grade or unproven territory' },
    ],
    guidance:
      'Best scored by your technical / data / IT lead. If you don\'t have one, score conservatively — complexity tends to be underestimated by non-builders.',
  },
  a: {
    factor: 'a',
    letter: 'A',
    name: 'Alignment',
    question: 'How directly does this support current exec priorities or OKRs?',
    role: 'Numerator (higher alignment → higher priority score)',
    scaleNotes:
      'Score 1 (no alignment) → 5 (explicitly named in priorities).',
    scaleLabels: [
      { value: 1, short: '1', long: 'No alignment — interesting idea, not connected to stated priorities' },
      { value: 2, short: '2', long: 'Weak — adjacent to priorities but no clear linkage' },
      { value: 3, short: '3', long: 'Moderate — supports a stated priority indirectly' },
      { value: 4, short: '4', long: 'Strong — directly supports a stated priority' },
      { value: 5, short: '5', long: 'Explicit — named in board prep, earnings calls, or CEO all-hands' },
    ],
    guidance:
      'Score against executive-level language — board presentations, earnings calls, CEO all-hands priorities — not VP or RevOps operational language. An initiative that "improves pipeline visibility" scores lower than one that "helps us grow revenue without growing headcount," even if they\'re the same initiative described differently.',
  },
  r: {
    factor: 'r',
    letter: 'R',
    name: 'Results',
    question: 'What is the expected, quantifiable business impact?',
    role: 'Numerator (higher expected results → higher priority score)',
    scaleNotes:
      'Anchor to Level 3 (Impact) metrics — win rates, ARR growth, NRR, CAC.',
    scaleLabels: [
      { value: 1, short: '1', long: 'Negligible — small or hard-to-measure improvement' },
      { value: 2, short: '2', long: 'Modest — measurable but limited impact on a Level 3 metric' },
      { value: 3, short: '3', long: 'Meaningful — clear lift on a Level 3 metric the exec team cares about' },
      { value: 4, short: '4', long: 'Strong — material improvement to win rate, NRR, attainment, or similar' },
      { value: 5, short: '5', long: 'Massive — outsized, durable impact on a board-level metric' },
    ],
    guidance:
      'Best scored jointly by sales leadership and RevOps — sales leadership knows the deal-level dynamics; RevOps knows what shows up in reporting.',
  },
  e: {
    factor: 'e',
    letter: 'E',
    name: 'Effort',
    question: 'How much change management and enablement is required?',
    role: 'Denominator (higher effort → lower priority score)',
    scaleNotes:
      'The Effort scale is unique — it tracks calendar time of behavior change required.',
    scaleLabels: [
      { value: 1, short: '1', long: '1 day — minimal behavior change; reps absorb it instantly' },
      { value: 2, short: '2', long: '1 week — light enablement, easy habit shift' },
      { value: 3, short: '3', long: '1 month — meaningful workflow change requiring sustained reinforcement' },
      { value: 4, short: '4', long: '1 quarter — substantial change touching multiple workflows' },
      { value: 5, short: '5', long: '2 quarters — deep transformation in how the team operates' },
    ],
    guidance:
      'Best scored by RevOps / Enablement plus a frontline manager. Senior leaders systematically underestimate Effort because they don\'t absorb the cognitive load themselves.',
  },
  t: {
    factor: 't',
    letter: 'T',
    name: 'Timeline',
    question: 'How urgent is this?',
    role: 'Multiplier applied after the initial calculation',
    scaleNotes:
      'Range 1.0 (no urgency) → 1.5 (must ship in 2 weeks).',
    scaleLabels: [
      { value: 1.0, short: '1.0', long: 'No urgency — can wait its turn in the queue' },
      { value: 1.1, short: '1.1', long: 'Mild — some pressure but no fixed deadline' },
      { value: 1.2, short: '1.2', long: 'Notable — this quarter is the right window' },
      { value: 1.3, short: '1.3', long: 'Significant — must move in weeks, not months' },
      { value: 1.4, short: '1.4', long: 'Strong — committed externally or board-promised' },
      { value: 1.5, short: '1.5', long: 'Critical — must ship in 2 weeks' },
    ],
  },
};
