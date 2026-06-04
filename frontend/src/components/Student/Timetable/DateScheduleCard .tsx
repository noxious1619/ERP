import { Download } from "lucide-react";

interface TimetableEntry {
  id: string;
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  isBreak: boolean;
  breakLabel: string | null;
  room: string | null;
  color: string | null;
  subject?: { id: string; name: string; code: string } | null;
  teacher?: { id: string; name: string } | null;
}

interface DateScheduleCardProps {
  selectedDate: Date;
  timetableData: TimetableEntry[];
  isLoading: boolean;
  isError: boolean;
}

const DateScheduleCard = ({ selectedDate, timetableData = [], isLoading, isError }: DateScheduleCardProps) => {
  
  // Safe validation check for calendar states
  const safeDate = selectedDate instanceof Date ? selectedDate : new Date();

  // 1. Identify which calendar day is selected (e.g., "MONDAY")
  const targetDayEnum = (() => {
    const daysEnumMap = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    return daysEnumMap[safeDate.getDay()];
  })();

  // 2. Client-side filter: Scan the whole week data array and grab only matching cards
  const filteredSchedule = timetableData
    .filter((item) => item.day?.toUpperCase() === targetDayEnum)
    .sort((a, b) => a.startTime.localeCompare(b));

  const getDynamicTitle = () => {
    const dayNum = safeDate.getDate();
    const monthName = safeDate.toLocaleDateString("en-US", { month: "short" });
    
    let suffix = "th";
    if (dayNum < 11 || dayNum > 13) {
      switch (dayNum % 10) {
        case 1: suffix = "st"; break;
        case 2: suffix = "nd"; break;
        case 3: suffix = "rd"; break;
      }
    }
    return `${dayNum}${suffix} ${monthName} Schedule`;
  };

  return (
    <div className="mt-6 w-[340px]">
      <h3 className="text-center text-[13px] font-extrabold uppercase tracking-[2px] text-[#1F1F1F]">
        {getDynamicTitle()}
      </h3>

      <div className="relative mt-6 flex flex-col gap-6">
        <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-[#D9DEE8]" />

        {/* 3. Handle data loading or error layout states smoothly */}
        {isLoading ? (
          <div className="relative z-10 text-center text-xs font-medium text-gray-400 py-10 bg-white rounded-[14px] border border-[#D7DAE4]">
            Syncing database arrays...
          </div>
        ) : isError ? (
          <div className="relative z-10 text-center text-xs font-medium text-red-500 py-10 bg-white rounded-[14px] border border-[#D7DAE4]">
            ⚠️ Error reading database parameters.
          </div>
        ) : filteredSchedule.length === 0 ? (
          <div className="relative z-10 text-center bg-gray-50 text-gray-400 p-6 rounded-[14px] text-xs font-medium border border-dashed border-gray-200">
            No classes scheduled for {targetDayEnum.toLowerCase()}.
          </div>
        ) : (
          filteredSchedule.map((item) => (
            <div
              key={item.id}
              className="relative z-10 flex py-2 items-center rounded-[14px] border border-[#D7DAE4] bg-white px-4 shadow-[0px_2px_6px_rgba(0,0,0,0.03)]"
            >
              <div className="flex flex-1 items-center">
                <h4 className="text-[18px] font-medium text-[#1F1F1F]">
                  {item.isBreak ? item.breakLabel || "Break" : item.subject?.name || "No Subject"}
                </h4>
              </div>

              <div className="flex flex-col items-end justify-center">
                <span className="text-[11px] font-medium tracking-[1px] text-[#8A8A8A]">
                  {item.startTime}
                </span>
                <p className="mt-2 text-[14px] text-[#6F6F6F]">
                  {item.isBreak ? "Interval" : item.teacher?.name || "Faculty Staff"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="mt-6 flex h-[58px] w-full items-center justify-center gap-3 rounded-full bg-[#3F69FF] text-[20px] font-semibold text-white shadow-[0px_12px_24px_rgba(63,105,255,0.35)] transition-all duration-300 hover:scale-[1.02]">
        <Download size={22} strokeWidth={2.5} />
        Download Timetable
      </button>
    </div>
  );
};

export default DateScheduleCard;