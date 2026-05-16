import {
  type DayEntry,
  MONTHS,
  FIRST_DOW,
  YEAR_DATA,
} from "./Attendancetypes ";
import Pill from "./Pill";

interface MonthRowProps {
  month: string;
}

/**
 * Builds a 2D array of (DayEntry | null) — one inner array per calendar week row.
 *
 * Leading nulls  = empty cells before the 1st of the month (correct DOW alignment).
 * Trailing nulls = empty cells to complete the final week row to 7 cells.
 *
 * FIRST_DOW[mi] is derived from `new Date(2026, mi, 1).getDay()` so it is
 * always the true Mon-based column index for the 1st — no manual lookup table.
 */
function buildWeeks(month: string): (DayEntry | null)[][] {
  const mi = MONTHS.indexOf(month);
  const days = YEAR_DATA[month];
  const firstDow = FIRST_DOW[mi]; // 0=Mon … 6=Sun

  const cells: (DayEntry | null)[] = [
    ...Array<null>(firstDow).fill(null), // leading empty cells
    ...days,
  ];

  // Pad to full last row
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (DayEntry | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export default function MonthRow({ month }: MonthRowProps) {
  const weeks = buildWeeks(month);

  return (
    <div className="flex items-start mb-[6px]">
      {/* Month label: fixed 28px width, right-aligned, aligns with pill grid */}
      <span className="w-7 shrink-0 mr-[6px] pt-[2px] text-[9px] font-bold tracking-[0.04em] text-[#8A94A6] text-right select-none">
        {month}
      </span>

      {/* Week rows */}
      <div className="flex flex-col gap-[3px]">
        {weeks.map((week, wi) => (
          <div
            key={wi}
            className="grid gap-x-[3px]"
            style={{ gridTemplateColumns: "repeat(7, 20px)" }}
          >
            {week.map((cell, ci) => (
              <div key={ci} className="flex justify-center">
                {cell ? (
                  <Pill status={cell.status} day={cell.day} month={month} />
                ) : (
                  <div className="w-[18px] h-[7px]" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
