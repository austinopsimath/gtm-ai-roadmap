import { HEALTH_LABELS, type Health } from '../types';

const STYLES: Record<Health, string> = {
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800',
};

const DOT: Record<Health, string> = {
  green: 'bg-green-500',
  yellow: 'bg-amber-500',
  red: 'bg-red-500',
};

export default function HealthBadge({ health }: { health: Health }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[health]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[health]}`} />
      {HEALTH_LABELS[health]}
    </span>
  );
}
