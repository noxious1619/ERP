import { Download } from "lucide-react";
import type { TeacherFilterMode } from "./TeacherTimetableHeader";
import { downloadTimetablePDF } from "../../../utils/downloadtimetable";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface MySubjectScheduleItem {
  id: string;
  primary: string;
  sub: string | null;
  time: string;
  teacher: string;
  isBreak?: boolean;
  breakLabel?: string | null;
}

interface WeeklyTimetableEntry {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isBreak: boolean;
  breakLabel: string | null;
  room: string | null;
  color: string | null;
  subject?: { id: string; name: string; code: string } | null;
  teacher?: { id: string; name: string } | null;
}

interface MySubjectWeeklyEntry {
  id: string;
  day: string;
  startTime: string;
  isBreak: boolean;
  subject: string; // class name
  code: string; // subject name uppercased
  room: string;
  color: string;
}

interface DateScheduleCardProps {
  filterMode?: TeacherFilterMode;
  selectedDate: Date;
  // Class mode — full week data
  classWeeklyData?: WeeklyTimetableEntry[];
  classWeeklyLoading?: boolean;
  // My Subject mode — full week data
  mySubjectWeeklyData?: MySubjectWeeklyEntry[];
  mySubjectWeeklyLoading?: boolean;
  // PDF props
  teacherName?: string;
  sectionLabel?: string;
}

// ─── Day helpers (same as student DateScheduleCard) ───────────────────────────
const DAY_ENUM_MAP = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const getDayEnum = (date: Date): string => DAY_ENUM_MAP[date.getDay()];

const getDynamicTitle = (date: Date): string => {
  const safeDate = date instanceof Date ? date : new Date();
  const dayNum = safeDate.getDate();
  const monthName = safeDate.toLocaleDateString("en-US", { month: "short" });
  let suffix = "th";
  if (dayNum < 11 || dayNum > 13) {
    switch (dayNum % 10) {
      case 1:
        suffix = "st";
        break;
      case 2:
        suffix = "nd";
        break;
      case 3:
        suffix = "rd";
        break;
    }
  }
  return `${dayNum}${suffix} ${monthName} Schedule`;
};

// ─── Component ────────────────────────────────────────────────────────────────
const DateScheduleCard = ({
  filterMode = "class",
  selectedDate,
  classWeeklyData = [],
  classWeeklyLoading = false,
  mySubjectWeeklyData = [],
  mySubjectWeeklyLoading = false,
  teacherName = "Teacher",
  sectionLabel = "",
}: DateScheduleCardProps) => {
  const safeDate = selectedDate instanceof Date ? selectedDate : new Date();
  const targetDayEnum = getDayEnum(safeDate);
  const isLoading =
    filterMode === "class" ? classWeeklyLoading : mySubjectWeeklyLoading;

  // ─── Filter full week data by selected date's day ─────────────────────────
  const classFilteredItems = classWeeklyData
    .filter((item) => item.day?.toUpperCase() === targetDayEnum)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const mySubjectFilteredItems = mySubjectWeeklyData
    .filter((item) => item.day?.toUpperCase() === targetDayEnum)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const hasData =
    filterMode === "class"
      ? classFilteredItems.length > 0
      : mySubjectFilteredItems.length > 0;

  // ─── PDF download ─────────────────────────────────────────────────────────
  const handleDownload = () => {
    if (filterMode === "class") {
      downloadTimetablePDF({
        teacherName,
        filterMode: "class",
        sectionLabel,
        day: targetDayEnum,
        items: classFilteredItems.map((item) => ({
          time: item.startTime,
          isBreak: item.isBreak,
          breakLabel: item.breakLabel,
          subject: item.isBreak ? null : item.subject?.name || "No Subject",
          professor: item.isBreak
            ? null
            : item.teacher?.name || "Faculty Staff",
          room: item.room,
        })),
      });
    } else {
      downloadTimetablePDF({
        teacherName,
        filterMode: "mySubject",
        day: targetDayEnum,
        items: mySubjectFilteredItems.map((item) => ({
          time: item.startTime,
          isBreak: item.isBreak,
          breakLabel: null,
          subject: item.subject,
          professor: item.code,
          room: item.room,
        })),
      });
    }
  };

  return (
    <div className="mt-6 w-[340px]">
      {/* Dynamic title based on selected date */}
      <h3 className="text-center text-[13px] font-extrabold uppercase tracking-[2px] text-[#1F1F1F]">
        {getDynamicTitle(safeDate)}
      </h3>

      <div className="relative mt-6 flex flex-col gap-6">
        <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-[#D9DEE8]" />

        {/* Loading */}
        {isLoading ? (
          <div className="relative z-10 text-center text-xs font-medium text-gray-400 py-10 bg-white rounded-[14px] border border-[#D7DAE4]">
            Syncing schedule...
          </div>
        ) : !hasData ? (
          /* No data for selected date */
          <div className="relative z-10 text-center bg-gray-50 text-gray-400 p-6 rounded-[14px] text-xs font-medium border border-dashed border-gray-200">
            No classes scheduled for {targetDayEnum.toLowerCase()}.
          </div>
        ) : filterMode === "class" ? (
          /* ── CLASS MODE ── */
          classFilteredItems.map((item) => (
            <div
              key={item.id}
              className="relative z-10 flex py-2 items-center rounded-[14px] border border-[#D7DAE4] bg-white px-4 shadow-[0px_2px_6px_rgba(0,0,0,0.03)]"
            >
              <div className="flex flex-1 items-center">
                <h4 className="text-[18px] font-medium text-[#1F1F1F]">
                  {item.isBreak
                    ? item.breakLabel || "Break"
                    : item.subject?.name || "No Subject"}
                </h4>
              </div>
              <div className="flex flex-col items-end justify-center">
                <span className="text-[11px] font-medium tracking-[1px] text-[#8A8A8A]">
                  {item.startTime}
                </span>
                <p className="mt-2 text-[14px] text-[#6F6F6F]">
                  {item.isBreak
                    ? "Interval"
                    : item.teacher?.name || "Faculty Staff"}
                </p>
              </div>
            </div>
          ))
        ) : (
          /* ── MY SUBJECT MODE ── */
          mySubjectFilteredItems.map((item) => (
            <div
              key={item.id}
              className="relative z-10 flex py-2 items-center rounded-[14px] border border-[#D7DAE4] bg-white px-4 shadow-[0px_2px_6px_rgba(0,0,0,0.03)]"
            >
              <div className="flex flex-1 flex-col justify-center">
                <h4 className="text-[18px] font-medium text-[#1F1F1F]">
                         {item.isBreak ? (item as any).breakLabel || "Break" : item.subject}
                </h4>
                {item.code && (
                  <p className="mt-0.5 text-[12px] font-medium text-[#8A8A8A]">
                    {item.code}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end justify-center">
                <span className="text-[11px] font-medium tracking-[1px] text-[#8A8A8A]">
                  {item.startTime}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Download Button */}
      {hasData && (
        <button
          onClick={handleDownload}
          className="mt-6 flex h-[58px] w-full items-center justify-center gap-3 rounded-full bg-[#3F69FF] text-[20px] font-semibold text-white shadow-[0px_12px_24px_rgba(63,105,255,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download size={22} strokeWidth={2.5} />
          Download Timetable
        </button>
      )}
    </div>
  );
};

export default DateScheduleCard;
