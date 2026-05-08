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

export interface StageInfo {
  stage: Stage;
  ordinalIndex: number; // 0..4, or -1 if terminal
  isTerminal: boolean;
  isPast: boolean; // initiative has progressed past this stage
  isCurrent: boolean;
  isFuture: boolean;
  headline: string;
  body: string;
  tasks: LifecycleTask[];
  offlineNote?: string;
  // Primary entry-point action: "navigate" goes to a sub-route; "advance" moves
  // the initiative to the next stage. Components decide whether to render this.
  primaryAction?: {
    kind: 'navigate' | 'advance';
    label: string;
    target: string; // path for navigate, target Stage for advance
  };
  // Secondary actions like "Re-score" — always available regardless of which
  // stage is currently selected.
  secondaryAction?: {
    kind: 'navigate';
    label: string;
    target: string;
  };
}

const ownerNamed = (i: Initiative) => i.initiativeOwner.trim().length > 0;
const sponsorNamed = (i: Initiative) => i.executiveSponsor.trim().length > 0;
const pathChosen = (i: Initiative) => i.path !== null;
const isScored = (i: Initiative) =>
  calculatePriorityScore(i.caret) !== null;

export function getStageInfo(
  initiative: Initiative,
  stage: Stage,
): StageInfo {
  const currentIdx = PROGRESSION.indexOf(initiative.stage);
  const stageIdx = PROGRESSION.indexOf(stage);
  const isTerminal = stage === 'killed' || stage === 'wound_down';
  const isCurrent = stage === initiative.stage;
  const isPast = !isTerminal && stageIdx >= 0 && stageIdx < currentIdx;
  const isFuture = !isTerminal && stageIdx > currentIdx;

  if (isTerminal) {
    return {
      stage,
      ordinalIndex: -1,
      isTerminal: true,
      isPast: false,
      isCurrent,
      isFuture: false,
      headline:
        stage === 'killed'
          ? 'This initiative was killed'
          : 'This initiative was wound down',
      body:
        stage === 'killed'
          ? 'A Kill decision is the framework working correctly when an initiative did not produce expected value or the path to fixing it was unclear or disproportionately expensive.'
          : 'Wound down after running. Edit the initiative to move it back into an active stage if circumstances change.',
      tasks: [],
    };
  }

  switch (stage) {
    case 'prioritize': {
      const scored = isScored(initiative);
      const tasks: LifecycleTask[] = [
        { label: 'Initiative captured in the registry', isComplete: true },
        { label: 'CARET panel scored', isComplete: scored },
      ];
      const advanceAction = isCurrent && scored
        ? {
            kind: 'advance' as const,
            label: 'Advance to Stage 2 (Calendar) →',
            target: 'roadmap',
          }
        : undefined;
      const scoreNavigate = {
        kind: 'navigate' as const,
        label: scored ? 'Re-score with CARET' : 'Begin CARET scoring →',
        target: `/initiatives/${initiative.id}/score`,
      };
      return {
        stage,
        ordinalIndex: stageIdx,
        isTerminal: false,
        isPast,
        isCurrent,
        isFuture,
        headline: !scored
          ? 'Score this initiative with CARET'
          : isCurrent
            ? 'Stage 1 complete — advance to Calendar'
            : 'Stage 1: Prioritize',
        body: !scored
          ? "Capture each panelist's scores across the five factors. The wizard computes a Priority Score and flags divergence so the panel can resolve it before the score is finalized."
          : isCurrent
            ? 'The panel has scored this initiative. The Roadmap Owner now places it on the calendar, accounting for cumulative cognitive load against other in-flight initiatives.'
            : 'CARET scoring captured by the panel. Re-score whenever the panel reconvenes or scope changes.',
        tasks,
        offlineNote:
          isCurrent && scored
            ? 'The roadmap calendar and cognitive-load visualization are coming in a future phase. For now, advance the stage once your team has placed the initiative on a shared calendar.'
            : undefined,
        primaryAction: !scored
          ? scoreNavigate
          : (advanceAction ?? scoreNavigate),
        secondaryAction:
          scored && advanceAction ? scoreNavigate : undefined,
      };
    }

    case 'roadmap': {
      const timelineSet =
        !!initiative.deployStartDate &&
        !!initiative.pilotStartDate &&
        !!initiative.gaDate;
      const isBuyPath = initiative.path === 'buy';
      const vendorNamed = !!initiative.primaryVendor.trim();
      const tasks: LifecycleTask[] = [
        { label: 'CARET panel scored', isComplete: isScored(initiative) },
        { label: 'Initiative Owner named', isComplete: ownerNamed(initiative) },
        {
          label: 'Executive Sponsor named',
          isComplete: sponsorNamed(initiative),
        },
        {
          label: 'Path decided (Build vs. Buy)',
          isComplete: pathChosen(initiative),
        },
        ...(isBuyPath
          ? [
              {
                label: 'Primary vendor named',
                isComplete: vendorNamed,
              } as LifecycleTask,
            ]
          : []),
        {
          label: 'Placed on calendar (Deploy / Pilot / GA dates set)',
          isComplete: timelineSet,
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
        stage,
        ordinalIndex: stageIdx,
        isTerminal: false,
        isPast,
        isCurrent,
        isFuture,
        headline: 'Stage 2: Calendar',
        body: 'Place the initiative on a calendar with cognitive-load constraints, prepare the PRD, and get conditional executive sign-off on the Accountability Compact before advancing to Deploy.',
        tasks,
        offlineNote: isCurrent
          ? 'The roadmap calendar and PRD builder are coming in future phases. Use the framework markdown to guide offline work; advance the stage once the PRD is approved.'
          : undefined,
        primaryAction: isCurrent
          ? {
              kind: 'advance',
              label: 'Advance to Stage 3 (Deploy) →',
              target: 'deploy',
            }
          : undefined,
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
        {
          label: 'Rollback criteria defined',
          isComplete: false,
          hint: 'Tracked offline.',
        },
        {
          label: 'Enablement brief drafted',
          isComplete: false,
          hint: 'Tracked offline.',
        },
        {
          label: 'PRD revised to reflect what was actually built or procured',
          isComplete: false,
          comingSoon: true,
        },
      ];
      return {
        stage,
        ordinalIndex: stageIdx,
        isTerminal: false,
        isPast,
        isCurrent,
        isFuture,
        headline: 'Stage 3: Deploy',
        body: 'Execute the approved PRD — build the custom solution or procure and onboard the vendor — to a state ready for controlled pilot testing. Discoveries surface a PRD revision before the Stage 3 → 4 gate.',
        tasks,
        offlineNote: isCurrent
          ? 'The workstream tracker and PRD revision flow are coming. Use the framework markdown for now; advance once the gate criteria are met.'
          : undefined,
        primaryAction: isCurrent
          ? {
              kind: 'advance',
              label: 'Advance to Stage 4 (Pilot) →',
              target: 'pilot',
            }
          : undefined,
      };
    }

    case 'pilot': {
      const tasks: LifecycleTask[] = [
        {
          label: 'Pilot running with cohort',
          isComplete: false,
          hint: 'Tracked offline.',
        },
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
        stage,
        ordinalIndex: stageIdx,
        isTerminal: false,
        isPast,
        isCurrent,
        isFuture,
        headline: 'Stage 4: Pilot',
        body: 'Test with a controlled cohort. Use Level 1 (Behavior) metrics as your early-warning system; the Scale decision hinges on Level 3 (Impact). The pilot decision and the executed Compact are the gate to GA.',
        tasks,
        offlineNote: isCurrent
          ? 'The pilot tracker, decision recorder, and Compact execution flow are coming. Use the framework markdown for now; advance once Scale is decided and the Compact is signed.'
          : undefined,
        primaryAction: isCurrent
          ? {
              kind: 'advance',
              label: 'Advance to Stage 5 (GA) →',
              target: 'ga',
            }
          : undefined,
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
        stage,
        ordinalIndex: stageIdx,
        isTerminal: false,
        isPast,
        isCurrent,
        isFuture,
        headline: 'Stage 5: GA',
        body: 'The first 90 days are a managed reinforcement period — Onboard, Reinforce, Embed. After day 90, ongoing measurement and decay monitoring sustain adoption. Most GTM AI initiatives that fail, fail here through slow decay.',
        tasks,
        offlineNote: isCurrent
          ? 'The 90-day arc tracker, decoder ring, and decay monitoring are coming. Use the framework markdown for now.'
          : undefined,
      };
    }

    default:
      return {
        stage,
        ordinalIndex: -1,
        isTerminal: true,
        isPast: false,
        isCurrent: false,
        isFuture: false,
        headline: '',
        body: '',
        tasks: [],
      };
  }
}
