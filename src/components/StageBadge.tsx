import { STAGE_LABELS, type Stage } from '../types';

const STYLES: Record<Stage, string> = {
  prioritize: 'bg-gray-100 text-gray-700',
  prd: 'bg-cyan-50 text-cyan-700',
  roadmap: 'bg-blue-50 text-blue-700',
  deploy: 'bg-indigo-50 text-indigo-700',
  pilot: 'bg-purple-50 text-purple-700',
  ga: 'bg-emerald-50 text-emerald-700',
  killed: 'bg-gray-100 text-gray-500 line-through',
  wound_down: 'bg-gray-100 text-gray-500',
};

export default function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${STYLES[stage]}`}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}
