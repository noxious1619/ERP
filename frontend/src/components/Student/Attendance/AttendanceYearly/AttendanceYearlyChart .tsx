import { MONTHS, DOW_LABELS } from "./Attendancetypes ";
import MonthRow from "./Monthrow";
import Legend from "./Legend";

// ─── Component ────────────────────────────────────────────────────────────────

export default function AttendanceYearlyChart() {
  return (
    // Full-width centering wrapper
    <div className="flex items-center justify-center w-full">
      {/* Card */}
      <div
        className={[
          "px-[40px] pt-[2px] pb-[14px] mt-2",
          "w-fit min-w-[220px]",
        ].join(" ")}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-[10px]">
          <span className="text-[13px] font-bold text-[#1A1A2E] tracking-tight">
            Attendance
          </span>
          <span className="text-[13px] font-bold text-[#1A1A2E] tracking-tight">
            2026
          </span>
        </div>

        {/* ── Day-of-week column headers ── */}
        <div className="flex pl-[34px] mt-6 mb-2">
          <div
            className="grid gap-x-[3px]"
            style={{ gridTemplateColumns: "repeat(7, 20px)" }}
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
