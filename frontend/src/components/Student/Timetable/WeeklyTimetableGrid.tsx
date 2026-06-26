import React, { useMemo } from "react";
import type { TimetableEntry, DayOfWeek } from "../../../types";
import WeeklyClassCard from "../Timetable/WeeklyCard";

interface WeeklyTimetableGridProps {
  entries: TimetableEntry[];
}

// Maps your database enum strings directly to your grid columns without changing layout
const DAY_COLUMNS: Record<DayOfWeek, number> = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
};

const DAYS_HEADER = [
  { day: "Monday"},
  { day: "Tuesday"},
  { day: "Wednesday"},
  { day: "Thursday"},
  { day: "Friday"},
  { day: "Saturday"},
];

const WeeklyTimetableGrid: React.FC<WeeklyTimetableGridProps> = ({
  entries,
}) => {
  // DYNAMIC SLOT CALCULATION: Extract ALL startTimes to build the Y-axis accurately
  const dynamicTimeSlots = useMemo(() => {
    // ⚡ FIX: We map all start times, including breaks, so the grid adapts perfectly to the DB
    const times = entries.map((e) => e.startTime);
    return Array.from(new Set(times)).sort((a, b) => a.localeCompare(b));
  }, [entries]);

  return (
    <div className="mt-10 rounded-[38px] bg-rgba(228, 232, 240, 0.3) py-6">
      {/* Header Days */}
      <div className="ml-[72px] grid grid-cols-6 gap-[12px]">
        {DAYS_HEADER.map((item) => (
          <div
            key={item.day}
            className="flex h-[54px] flex-col items-center justify-center rounded-full bg-slate-200 "
          >
            <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#666B78]">
              {item.day}
            </span>
          </div>
        ))}
      </div>

      {/* Grid Layout */}
      <div className="mt-2 flex">
        {/* Time Labels */}
        <div className="flex w-[72px] flex-col">
          {dynamicTimeSlots.map((time) => (
            <div
              key={time}
              className="flex h-[132px] items-start pt-7 text-[16px] font-medium text-[#8A8FA1]"
            >
              {time}
            </div>
          ))}
        </div>

        {/* Right Grid */}
        <div className="relative grid flex-1 grid-cols-6 border-l border-t border-[#E6EAF2]">
          {/* Background Cells - Calculates wireframe boxes based on dynamic slots length */}
          {Array.from({ length: 6 * dynamicTimeSlots.length }).map(
            (_, index) => (
              <div
                key={index}
                className="h-[132px] border-r border-b border-[#E6EAF2]"
              />
            ),
          )}

          {/* Cards */}
          {entries.map((item: any) => {
            const columnIndex = DAY_COLUMNS[item.day as DayOfWeek];
            const rowIndex = dynamicTimeSlots.indexOf(item.startTime);

            if (rowIndex === -1) return null;

            return (
              <div
                key={item.id}
                className="absolute p-[8px]"
                style={{
                  left: `calc(${columnIndex} * 16.6667%)`,
                  top: `${rowIndex * 132}px`,
                  width: "16.6667%",
                }}
              >
                {item.isBreak ? (
                  // ⚡ FIX: Render a styled placeholder for the break block
                  <div className="flex h-[116px] w-full items-center justify-center rounded-[20px] border-2 border-dashed border-[#D1D5E4] bg-[#F8F9FE]">
                    <span className="px-2 text-center text-[11px] font-bold uppercase tracking-[2px] text-slate-400">
                      {item.breakLabel || "BREAK"}
                    </span>
                  </div>
                ) : (
                  <WeeklyClassCard
                    code={item.subject?.code || "N/A"}
                    subject={item.subject?.name || "No Subject"}
                    teacher={item.displayTeacherName || "Staff"}
                    location={item.room || "TBD"}
                    accentColor={item.color || "#0060AE"}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyTimetableGrid;