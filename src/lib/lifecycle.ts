import { calculatePriorityScore, type Initiative, type Stage } from '../types';

export const PROGRESSION: Stage[] = [
  'prioritize',
  'roadmap',
  'deploy',
  'pilot',
  'ga',
];

export interface LifecycleTask {
  label: string;
  isComplete: boolean;
  comingSoon?: boolean;
  hint?: string;
}

export interface LifecycleNextStep {
  headline: string;
  body: string;
  primary?: {
    kind: 'navigate' | 'advance';
    label: string;
    target: string; // path for navigate, next stage for advance
  };
  offlineNote?: string;
}

export interface LifecycleStatus {
  currentStage: Stage;
  isTerminal: boolean; // killed / wound_down
  ordinalIndex: number; // 0..4, or -1 if terminal
  tasks: LifecycleTask[];
  nextStep: LifecycleNextStep | null;
  nextStage: Stage | null;
}

const ownerNamed = (i: Initiative) => i.initiativeOwner.trim().length > 0;
const sponsorNamed = (i: Initiative) => i.executiveSponsor.trim().length > 0;
const pathChosen = (i: Initiative) => i.path !== null;
const isScored = (i: Initiative) =>
  calculatePriorityScore(i.caret) !== null;

export function getLifecycleStatus(initiative: Initiative): LifecycleStatus {
  if (initiative.stage === 'killed' || initiative.stage === 'wound_down') {
    return {
      currentStage: initiative.stage,
      isTerminal: true,
      ordinalIndex: -1,
      tasks: [],
      nextStep: null,
      nextStage: null,
    };
  }

  const ordinalIndex = PROGRESSION.indexOf(initiative.stage);
  const nextStage = PROGRESSION[ordinalIndex + 1] ?? null;

  switch (initiative.stage) {
    case 'prioritize': {
      const scored = isScored(initiative);
      const tasks: LifecycleTask[] = [
        { label: 'Initiative captured in the registry', isComplete: true },
        { label: 'CARET panel scored', isComplete: scored },
      ];
      const nextStep: LifecycleNextStep = !scored
        ? {
            headline: 'Score this initiative with CARET',
            body: 'Capture each panelist\'s scores across the five factors. The wizard computes a Priority Score and flags divergence so the panel can resolve it before the score is finalized.',
            primary: {
              kind: 'navigate',
              label: 'Begin CARET scoring →',
              target: `/initiatives/${initiative.id}/score`,
            },
          }
        : {
            headline: 'Stage 1 complete — advance to Roadmap',
            body: 'The panel has scored this initiative. The Roadmap Owner now places it on the calendar, accounting for cumulative cognitive load against other in-flight initiatives.',
            primary: {
              kind: 'advance',
              label: 'Advance to Stage 2 (Roadmap) →',
              target: 'roadmap',
            },
            offlineNote:
              'The roadmap calendar and cognitive-load visualization are coming in a future phase. For now, advance the stage once your team has placed the initiative on a shared calendar.',
          };
      return {
        currentStage: initiative.stage,
        isTerminal: false,
        ordinalIndex,
        tasks,
        nextStep,
        nextStage,
      };
    }

    case 'roadmap': {
      const tasks: LifecycleTask[] = [
        { label: 'CARET panel scored', isComplete: isScored(initiative) },
        { label: 'Initiative Owner named', isComplete: ownerNamed(initiative) },
        {
          label: 'Executive Sponsor named',
          isComplete: sponsorNamed(initiative),
        },
        { label: 'Path decided (Build vs. Buy)', isComplete: pathChosen(initiative) },
        {
          label: 'Placed on roadmap calendar',
          isComplete: false,
          comingSoon: true,
        },
        {
          label: 'PRD approved with conditional Accountability Compact',
          isComplete: false,
          comingSoon: true,
        },
        {
          label: 'Resources allocated (build capacity, enablement, budget)',
          isComplete: false,
          hint: 'Tracked offline for now.',
        },
      ];
      return {
        currentStage: initiative.stage,
        isTerminal: false,
        ordinalIndex,
        tasks,
        nextStep: {
          headline: 'In Stage 2: Roadmap',
          body: 'Sequence the initiative on a calendar with cognitive-load constraints, prepare the PRD, and get conditional executive sign-off on the Accountability Compact before advancing to Deploy.',
          primary: {
            kind: 'advance',
            label: 'Advance to Stage 3 (Deploy) →',
            target: 'deploy',
          },
          offlineNote:
            'The roadmap calendar and PRD builder are coming in future phases. Use the framework markdown to guide offline work; advance the stage once the PRD is approved.',
        },
        nextStage,
      };
    }

    case 'deploy': {
      const tasks: LifecycleTask[] = [
        {
          label: 'Build or Buy workstreams executed to pilot-ready state',
          isComplete: false,
          comingSoon: true,
        },
        {
          label: 'Solution functional and internally tested',
          isComplete: false,
          hint: 'Tracked offline until the workstreams view ships.',
        },
        {
          label: 'Measurement cadence operational at all three metric layers',
          isComplete: false,
          comingSoon: true,
        },
        {
          label: 'Test cohort identified and prepared',
          isComplete: false,
          hint: 'Tracked offline.',
        },
        { label: 'Rollback criteria defined', isComplete: false, hint: 'Tracked offline.' },
        { label: 'Enablement brief drafted', isComplete: false, hint: 'Tracked offline.' },
        {
          label: 'PRD revised to reflect what was actually built or procured',
          isComplete: false,
          comingSoon: true,
        },
      ];
      return {
        currentStage: initiative.stage,
        isTerminal: false,
        ordinalIndex,
        tasks,
        nextStep: {
          headline: 'In Stage 3: Deploy',
          body: 'Execute the approved PRD — build the custom solution or procure and onboard the vendor — to a state ready for controlled pilot testing. Discoveries surface a PRD revision before the Stage 3 → 4 gate.',
          primary: {
            kind: 'advance',
            label: 'Advance to Stage 4 (Pilot) →',
            target: 'pilot',
          },
          offlineNote:
            'The workstream tracker and PRD revision flow are coming. Use the framework markdown for now; advance once the gate criteria are met.',
        },
        nextStage,
      };
    }

    case 'pilot': {
      const tasks: LifecycleTask[] = [
        { label: 'Pilot running with cohort', isComplete: false, hint: 'Tracked offline.' },
        {
          label: 'Metrics tracked at all three layers throughout the pilot',
          isComplete: false,
          comingSoon: true,
        },
        {
          label: 'Structured feedback collected at midpoint and end',
          isComplete: false,
          hint: 'Tracked offline.',
        },
        {
          label: 'Scale / Fix-and-Re-Pilot / Kill decision made',
          isComplete: false,
          comingSoon: true,
        },
        {
          label: 'Accountability Compact executed (if Scale)',
          isComplete: false,
          comingSoon: true,
        },
      ];
      return {
        currentStage: initiative.stage,
        isTerminal: false,
        ordinalIndex,
        tasks,
        nextStep: {
          headline: 'In Stage 4: Pilot',
          body: 'Test with a controlled cohort. Use Level 1 (Behavior) metrics as your early-warning system; the Scale decision hinges on Level 3 (Impact). The pilot decision and the executed Compact are the gate to GA.',
          primary: {
            kind: 'advance',
            label: 'Advance to Stage 5 (GA) →',
            target: 'ga',
          },
          offlineNote:
            'The pilot tracker, decision recorder, and Compact execution flow are coming. Use the framework markdown for now; advance once Scale is decided and the Compact is signed.',
        },
        nextStage,
      };
    }

    case 'ga': {
      const tasks: LifecycleTask[] = [
        {
          label: 'Days 1–30: Onboarding and exec expectation-setting',
          isComplete: false,
          comingSoon: true,
        },
        {
          label: 'Days 31–60: First behavior data reviewed in coaching',
          isComplete: false,
          comingSoon: true,
        },
        {
          label: 'Days 61–90: Embedded into operating rhythms',
          isComplete: false,
          comingSoon: true,
        },
        {
          label: 'Decoder ring distributed to managers',
          isComplete: false,
          comingSoon: true,
        },
        {
          label: 'Decay signal monitoring active',
          isComplete: false,
          comingSoon: true,
        },
      ];
      return {
        currentStage: initiative.stage,
        isTerminal: false,
        ordinalIndex,
        tasks,
        nextStep: {
          headline: 'In Stage 5: GA',
          body: 'The first 90 days are a managed reinforcement period — Onboard, Reinforce, Embed. After day 90, ongoing measurement and decay monitoring sustain adoption. Most GTM AI initiatives that fail, fail here through slow decay.',
          offlineNote:
            'The 90-day arc tracker, decoder ring, and decay monitoring are coming. Use the framework markdown for now.',
        },
        nextStage: null,
      };
    }
  }
}
