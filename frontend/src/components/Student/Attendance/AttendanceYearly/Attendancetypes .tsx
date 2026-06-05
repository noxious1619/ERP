// src/components/Student/Attendance/Attendancetypes.ts

export type DayStatus = "present" | "absent" | "holiday" | "sunday" | "future" | "empty";

export const YEAR = 2026;

export const MONTHS: string[] = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN", 
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

// 2026 is a non-leap year
export const DAYS_IN_MONTH: number[] = [
  31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
];

/**
 * FIRST_DOW[mi] = Mon-based column (0=Mon…6=Sun) that the 1st of month mi falls on.
 */
export const FIRST_DOW: number[] = MONTHS.map((_, mi) => {
  const jsDow = new Date(YEAR, mi, 1).getDay(); 
  return (jsDow + 6) % 7; 
});

export const DOW_LABELS: string[] = ["M", "T", "W", "T", "F", "S", "S"];

/**
 * Hex colour for each status.
 */
export const PILL_HEX: Record<DayStatus, string> = {
  present: "#4F7EF7",
  absent: "#E8394A",
  holiday: "#1A1A2E",
  sunday: "#D5DBE8", 
  future: "#D5DBE8",
  empty: "#F1F5F9", // Very light gray for past days with no records
};