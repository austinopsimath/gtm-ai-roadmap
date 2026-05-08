import type { Initiative, Stage } from '../types';

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface MonthTick {
  date: Date;
  label: string;
  shortLabel: string;
}

export interface ScheduledInitiative {
  initiative: Initiative;
  deployStart: Date;
  pilotStart: Date;
  gaStart: Date;
  gaEnd: Date; // gaStart + 90 days
}

export const GA_WINDOW_DAYS = 90;
export const COGNITIVE_LOAD_CEILING = 10;

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function isFullyScheduled(i: Initiative): boolean {
  return !!i.deployStartDate && !!i.pilotStartDate && !!i.gaDate;
}

export function toScheduled(i: Initiative): ScheduledInitiative | null {
  if (!isFullyScheduled(i)) return null;
  const deployStart = new Date(i.deployStartDate!);
  const pilotStart = new Date(i.pilotStartDate!);
  const gaStart = new Date(i.gaDate!);
  const gaEnd = new Date(gaStart);
  gaEnd.setDate(gaEnd.getDate() + GA_WINDOW_DAYS);
  return { initiative: i, deployStart, pilotStart, gaStart, gaEnd };
}

export function computeTimeRange(
  scheduled: ScheduledInitiative[],
): TimeRange {
  if (scheduled.length === 0) {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 6, 1);
    return { start, end };
  }
  const allDates = scheduled.flatMap((s) => [
    s.deployStart,
    s.pilotStart,
    s.gaStart,
    s.gaEnd,
  ]);
  const earliest = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const latest = new Date(Math.max(...allDates.map((d) => d.getTime())));
  // Snap to month boundaries with a touch of padding either side
  const start = new Date(earliest.getFullYear(), earliest.getMonth() - 1, 1);
  const end = new Date(latest.getFullYear(), latest.getMonth() + 2, 1);
  return { start, end };
}

export function buildMonthTicks(range: TimeRange): MonthTick[] {
  const ticks: MonthTick[] = [];
  const cur = new Date(range.start);
  while (cur < range.end) {
    ticks.push({
      date: new Date(cur),
      label: `${MONTHS_SHORT[cur.getMonth()]} ${cur.getFullYear()}`,
      shortLabel: MONTHS_SHORT[cur.getMonth()],
    });
    cur.setMonth(cur.getMonth() + 1);
  }
  return ticks;
}

export function dateToPercent(date: Date, range: TimeRange): number {
  const total = range.end.getTime() - range.start.getTime();
  const offset = date.getTime() - range.start.getTime();
  return (offset / total) * 100;
}

export function isContributingAt(
  s: ScheduledInitiative,
  at: Date,
): boolean {
  // Pilot or first 90 days of GA
  return at >= s.pilotStart && at <= s.gaEnd;
}

export interface LoadTick {
  date: Date;
  load: number;
  contributors: ScheduledInitiative[];
}

export function buildWeeklyLoad(
  scheduled: ScheduledInitiative[],
  range: TimeRange,
): LoadTick[] {
  const ticks: LoadTick[] = [];
  const cur = new Date(range.start);
  while (cur < range.end) {
    const contributors = scheduled.filter((s) => isContributingAt(s, cur));
    const load = contributors.reduce(
      (sum, c) => sum + c.initiative.caret.e,
      0,
    );
    ticks.push({ date: new Date(cur), load, contributors });
    cur.setDate(cur.getDate() + 7);
  }
  return ticks;
}

export function todayPercent(range: TimeRange): number | null {
  const today = new Date();
  if (today < range.start || today > range.end) return null;
  return dateToPercent(today, range);
}

export function filterByStage(
  initiatives: Initiative[],
  filter: 'all' | 'in-flight' | Stage,
): Initiative[] {
  if (filter === 'all') return initiatives;
  if (filter === 'in-flight') {
    return initiatives.filter(
      (i) =>
        i.stage !== 'killed' &&
        i.stage !== 'wound_down',
    );
  }
  return initiatives.filter((i) => i.stage === filter);
}
