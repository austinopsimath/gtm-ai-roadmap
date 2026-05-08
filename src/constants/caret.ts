import type { CARETFactor } from '../types';

export interface FactorCopy {
  factor: CARETFactor;
  letter: string;
  name: string;
  subtitle: string;
  question: string;
  definition: string;
  role: string;
  formulaPosition: string;
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
    subtitle: 'Difficulty or cost of the build',
    question: 'How technically difficult is it to build / buy and integrate?',
    definition:
      'About the inherent difficulty of the work — potential for roadblocks, integration surprises, bugs, and scope creep.',
    role: 'Higher complexity → lower priority score',
    formulaPosition: 'Denominator (divisor)',
    scaleNotes: 'Score 1 (simple) → 5 (extremely complex).',
    scaleLabels: [
      { value: 1, short: '1', long: 'Simple — straightforward integration or trivial build' },
      { value: 2, short: '2', long: 'Modest — a few moving pieces, well-understood patterns' },
      { value: 3, short: '3', long: 'Moderate — meaningful integration work across multiple systems' },
      { value: 4, short: '4', long: 'Hard — novel architecture or significant data work' },
      { value: 5, short: '5', long: 'Extremely complex — research-grade or unproven territory' },
    ],
    guidance:
      "Best scored by your technical / data / IT lead. Without one, score conservatively — complexity is consistently underestimated by non-builders.",
  },
  a: {
    factor: 'a',
    letter: 'A',
    name: 'Alignment',
    subtitle: 'Strategic fit with executive priorities',
    question:
      'How directly does this support the long-term strategy or current OKRs?',
    definition:
      "About whether this work maps to the priorities executives are actually accountable for — the language they use in board prep, earnings calls, and CEO all-hands.",
    role: 'Higher alignment → higher priority score',
    formulaPosition: 'Numerator (multiplier)',
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
      "Score against executive-level language, not VP or RevOps operational language. An initiative that 'improves pipeline visibility' scores lower than one that 'helps us grow revenue without growing headcount,' even when they're the same initiative.",
  },
  r: {
    factor: 'r',
    letter: 'R',
    name: 'Results',
    subtitle: 'Expected business impact / value',
    question: 'What is the expected, quantifiable business impact?',
    definition:
      'About the magnitude of value gained when this works — anchored to a Level 3 (Impact) metric your executives track: win rates, ARR, NRR, CAC, attainment.',
    role: 'Higher results → higher priority score',
    formulaPosition: 'Numerator (multiplier)',
    scaleNotes:
      'Score 1 (negligible) → 5 (massive, measurable impact).',
    scaleLabels: [
      { value: 1, short: '1', long: 'Negligible — small or hard-to-measure improvement' },
      { value: 2, short: '2', long: 'Modest — measurable but limited impact on a Level 3 metric' },
      { value: 3, short: '3', long: 'Meaningful — clear lift on a Level 3 metric the exec team tracks' },
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
    subtitle: 'Level of change management required',
    question:
      'How much effort or cognitive load is required for users to master the new behavior?',
    definition:
      'A proxy for the length of the enablement initiative needed. The Effort scale tracks calendar time of behavior change, not just technical build time.',
    role: 'Higher effort → lower priority score',
    formulaPosition: 'Denominator (divisor)',
    scaleNotes: 'Each step roughly 5–10× the prior in calendar time.',
    scaleLabels: [
      { value: 1, short: '1', long: '1 day — minimal behavior change; reps absorb it instantly' },
      { value: 2, short: '2', long: '1 week — light enablement, easy habit shift' },
      { value: 3, short: '3', long: '1 month — meaningful workflow change requiring sustained reinforcement' },
      { value: 4, short: '4', long: '1 quarter — substantial change touching multiple workflows' },
      { value: 5, short: '5', long: '2 quarters — deep transformation in how the team operates' },
    ],
    guidance:
      "Best scored by RevOps / Enablement plus a frontline manager. Senior leaders systematically underestimate Effort because they don't absorb the cognitive load themselves.",
  },
  t: {
    factor: 't',
    letter: 'T',
    name: 'Timeline',
    subtitle: 'Urgency factor',
    question:
      'How urgent is this? Is there an external deadline, market window, or business exigency?',
    definition:
      'Applied after the initial calculation as a multiplier to represent time sensitivity. Use sparingly — every initiative feels urgent to its sponsor.',
    role: 'Higher urgency → higher priority score',
    formulaPosition: 'Multiplier (applied last)',
    scaleNotes: 'Range 1.0 (no urgency) → 1.5 (must ship in 2 weeks).',
    scaleLabels: [
      { value: 1.0, short: '1.0', long: 'No urgency — can wait its turn in the queue' },
      { value: 1.1, short: '1.1', long: 'Mild — some pressure but no fixed deadline' },
      { value: 1.2, short: '1.2', long: 'Notable — this quarter is the right window' },
      { value: 1.3, short: '1.3', long: 'Significant — must move in weeks, not months' },
      { value: 1.4, short: '1.4', long: 'Strong — committed externally or board-promised' },
      { value: 1.5, short: '1.5', long: 'Critical — must ship in the next 2 weeks' },
    ],
  },
};
