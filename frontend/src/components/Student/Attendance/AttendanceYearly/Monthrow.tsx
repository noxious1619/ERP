import { FIRST_DOW, DAYS_IN_MONTH, YEAR } from "./Attendancetypes ";
import Pill from "./Pill";

interface MonthRowProps {
  month: string;
  monthIndex: number;
  heatmapData: Record<string, "P" | "A">;
}

/**
 * Builds the calendar grid matrix purely from mathematical offsets.
 */
function buildWeeks(monthIndex: number): (number | null)[][] {
  const totalDays = DAYS_IN_MONTH[monthIndex];
  const firstDow = FIRST_DOW[monthIndex]; 

  // Add leading empty layout offsets
  const cells: (number | null)[] = Array<null>(firstDow).fill(null);
  
  // Fill real calendar days
  for (let d = 1; d <= totalDays; d++) {
    cells.push(d);
  }

  // Pad the trailing week completely
  while (cells.length % 7 !== 0) cells.push(null);

  // Slice into 7-day row chunks
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export default function MonthRow({ month, monthIndex, heatmapData }: MonthRowProps) {
  const weeks = buildWeeks(monthIndex);
  
  // Create standardized month string (e.g., "01" for Jan)
  const monthStr = String(monthIndex + 1).padStart(2, "0");
  const today = new Date();

  return (
    <div className="flex items-start mb-[6px]">
      <span className="w-7 shrink-0 mr-[8px] pt-[2px] text-[9px] font-bold tracking-[0.04em] text-[#8A94A6] text-right select-none">
        {month}
      </span>

      <div className="flex flex-col gap-[3px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid gap-x-[3px]" style={{ gridTemplateColumns: "repeat(7, 18px)" }}>
            {week.map((dayNum, ci) => {
              // Handle empty padding cells
              if (dayNum === null) {
                return (
                  <div key={ci} className="flex justify-center">
                    <div className="w-[18px] h-[7px]" />
                  </div>
                );
              }

              // 1. Construct the database lookup key
              const dayStr = String(dayNum).padStart(2, "0");
              const dateKey = `${YEAR}-${monthStr}-${dayStr}`;

              // 2. Query the dictionary (O(1) lookup)
              const backendStatus = heatmapData[dateKey];

              // 3. Fallback logic for unlogged days
              const currentDayDate = new Date(YEAR, monthIndex, dayNum);
              const isSunday = currentDayDate.getDay() === 0;
              const isFuture = currentDayDate > today;

              let finalStatus: any = "empty";
              if (backendStatus) {
                finalStatus = backendStatus;
              } else if (isFuture) {
                finalStatus = "future";
              } else if (isSunday) {
                finalStatus = "sunday";
              }

              return (
                <div key={ci} className="flex justify-center">
                  <Pill status={finalStatus} day={dayNum} month={month} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}