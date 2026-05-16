// ─── Types ────────────────────────────────────────────────────────────────────

export type DayStatus = "present" | "absent" | "holiday" | "sunday" | "future";

export interface DayEntry {
  day: number;
  status: DayStatus;
  dow: number; // Mon-based: 0=Mon … 6=Sun
}

export type YearData = Record<string, DayEntry[]>;

// ─── Constants ────────────────────────────────────────────────────────────────

export const YEAR = 2026;

export const MONTHS: string[] = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export const DAYS_IN_MONTH: number[] = [
  31,
  28,
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31, // 2026 (non-leap)
];

/**
 * FIRST_DOW[mi] = Mon-based column (0=Mon…6=Sun) that the 1st of month mi falls on.
 * Derived directly from Date — never hardcoded.
 */
export const FIRST_DOW: number[] = MONTHS.map((_, mi) => {
  const jsDow = new Date(YEAR, mi, 1).getDay(); // 0=Sun…6=Sat
  return (jsDow + 6) % 7; // remap → 0=Mon…6=Sun
});

export const DOW_LABELS: string[] = ["M", "T", "W", "T", "F", "S", "S"];

/**
 * Hex colour for each status.
 * Used for BOTH the pill background (via inline style) and legend swatches.
 * Using inline style everywhere avoids Tailwind purge issues with arbitrary hex values.
 */
export const PILL_HEX: Record<DayStatus, string> = {
  present: "#4F7EF7",
  absent: "#E8394A",
  holiday: "#1A1A2E",
  sunday: "#D5DBE8", // muted blue-gray — clearly distinct from white/bg
  future: "#D5DBE8",
};

// ─── Data generation ──────────────────────────────────────────────────────────

/**
 * Generates attendance data for every calendar day of 2026.
 *
 * Status rules (checked in order):
 *  1. future  → date is after today
 *  2. sunday  → JS getDay() === 0  (i.e. actual Sunday, regardless of grid column)
 *  3. Mon–Sat → present / absent / holiday via deterministic seed
 */
export function generateYearData(): YearData {
  const today = new Date(YEAR, 8, 14); // simulate today = 14 Sep 2026
  const data: YearData = {};

  MONTHS.forEach((m, mi) => {
    data[m] = [];

    for (let d = 1; d <= DAYS_IN_MONTH[mi]; d++) {
      const date = new Date(YEAR, mi, d);
      const jsDow = date.getDay(); // 0=Sun … 6=Sat  — JS convention, use for logic
      const monDow = (jsDow + 6) % 7; // 0=Mon … 6=Sun  — used for grid column placement only

      const isSunday = jsDow === 0; // TRUE only for real Sundays
      const isFuture = date > today;

      let status: DayStatus;

      if (isFuture) {
        status = "future";
      } else if (isSunday) {
        status = "sunday"; // Only actual Sundays get this — never Mondays
      } else {
        // Mon–Sat: deterministic demo pattern
        const seed = (mi * 31 + d) % 17;
        if (seed === 5 || seed === 11) status = "absent";
        else if (seed === 3 || seed === 14) status = "holiday";
        else status = "present";
      }

      data[m].push({ day: d, status, dow: monDow });
    }
  });

  return data;
}

export const YEAR_DATA: YearData = generateYearData();
