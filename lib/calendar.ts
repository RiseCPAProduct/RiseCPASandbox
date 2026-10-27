import type { CalendarEvent } from "./mock-events";

export type GridDay = {
  // YYYY-MM-DD, zero-padded
  date: string;
  day: number;
  // false for the leading and trailing days from neighbouring months
  inMonth: boolean;
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// Normalizes YYYY-M-D to YYYY-MM-DD so non-padded dates still compare.
export function normalizeDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return `${year}-${pad(month)}-${pad(day)}`;
}

function fromUtc(ms: number): GridDay & { month: number } {
  const d = new Date(ms);
  return {
    date: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`,
    day: d.getUTCDate(),
    month: d.getUTCMonth() + 1,
    inMonth: false,
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;

// Weeks (Sunday to Saturday) covering a month, month 1-12. Uses UTC so the
// server and every browser build the same grid.
export function buildMonthGrid(year: number, month: number): GridDay[][] {
  const first = Date.UTC(year, month - 1, 1);
  const start = first - new Date(first).getUTCDay() * DAY_MS;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const leading = (first - start) / DAY_MS;
  const weekCount = Math.ceil((leading + daysInMonth) / 7);

  const weeks: GridDay[][] = [];
  for (let w = 0; w < weekCount; w++) {
    const week: GridDay[] = [];
    for (let d = 0; d < 7; d++) {
      const { date, day, month: m } = fromUtc(start + (w * 7 + d) * DAY_MS);
      week.push({ date, day, inMonth: m === month });
    }
    weeks.push(week);
  }
  return weeks;
}

export function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const index = year * 12 + (month - 1) + delta;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

// Whole days from one YYYY-MM-DD date to another.
export function daysBetween(from: string, to: string): number {
  const toUtc = (date: string) => {
    const [y, m, d] = date.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toUtc(to) - toUtc(from)) / DAY_MS);
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return fromUtc(Date.UTC(y, m - 1, d) + days * DAY_MS).date;
}

// Today in the browser's time zone as YYYY-MM-DD.
export function localToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function eventsOn(events: CalendarEvent[], date: string): CalendarEvent[] {
  const target = normalizeDate(date);
  return events.filter((event) => normalizeDate(event.date) === target);
}

// Events on or after today, soonest first.
export function upcomingEvents(events: CalendarEvent[], today: string, limit: number): CalendarEvent[] {
  const from = normalizeDate(today);
  return events
    .filter((event) => normalizeDate(event.date) >= from)
    .sort((a, b) => normalizeDate(a.date).localeCompare(normalizeDate(b.date)))
    .slice(0, limit);
}
