export function formatRelativeTime(iso: string | null): string {
  if (!iso) return 'never';
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
  if (diffDay < 30) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  const diffMo = Math.round(diffDay / 30);
  return `${diffMo} month${diffMo === 1 ? '' : 's'} ago`;
}

/**
 * Formats a date for display. Date-only strings (YYYY-MM-DD) are parsed as
 * local time to avoid an off-by-one shift in negative-UTC-offset timezones;
 * full ISO timestamps are parsed as the instant they represent.
 */
export function formatDate(value: string | null): string {
  if (!value) return '';
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const d = dateOnly
    ? new Date(
        Number(dateOnly[1]),
        Number(dateOnly[2]) - 1,
        Number(dateOnly[3]),
      )
    : new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString();
}

export function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  return Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24));
}
