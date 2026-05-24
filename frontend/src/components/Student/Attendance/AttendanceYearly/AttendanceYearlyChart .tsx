import { MONTHS, DOW_LABELS } from "./Attendancetypes ";
import MonthRow from "./Monthrow";
import Legend from "./Legend";

// ─── Component ────────────────────────────────────────────────────────────────
// Chart content total width:
// month label (28px) + gap (8px) + 7 cols × 18px + 6 gaps × 3px = 180px

export default function AttendanceYearlyChart() {
  return (
    <div className="flex flex-col items-center w-full py-2">
      {/* Fixed-width content block — always 180px wide, perfectly centered */}
      <div style={{ width: "180px" }}>
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-[10px]">
          <span className="text-[14px] font-bold text-[#1A1A2E] tracking-tight">
            Attendance
          </span>
          <span className="text-[14px] font-bold text-[#1A1A2E] tracking-tight">
            2026
          </span>
        </div>

        {/* ── Day-of-week column headers ── */}
        <div className="flex pl-[36px] mt-6 mb-2">
          <div
            className="grid gap-x-[3px]"
            style={{ gridTemplateColumns: "repeat(7, 18px)" }}
          >
            {DOW_LABELS.map((d, i) => (
              <div
                key={i}
                className="text-center text-[9px] font-semibold text-[#8A94A6] tracking-[0.03em]"
              >
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* ── Month rows ── */}
        <div>
          {MONTHS.map((m) => (
            <MonthRow key={m} month={m} />
          ))}
        </div>

        {/* ── Legend ── */}
        <Legend />
      </div>
    </div>
  );
}
