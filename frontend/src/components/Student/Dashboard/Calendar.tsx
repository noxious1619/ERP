import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../../style/Student/Dashboard/calendar.css";

type CalendarSectionProps = {
  variant?: "dashboard" | "timetable";
};

const attendanceMap: Record<string, string> = {
  "2026-08-01": "present",
  "2026-08-02": "present",
  "2026-08-05": "present",
  "2026-08-06": "present",
  "2026-08-07": "absent",
  "2026-08-08": "present",
  "2026-08-09": "present",
  "2026-08-12": "present",
  "2026-08-13": "present",
  "2026-08-14": "holiday",
  "2026-08-15": "present",
  "2026-08-16": "present",
  "2026-08-19": "present",
  "2026-08-20": "present",
  "2026-08-21": "present",
  "2026-08-22": "present",
  "2026-08-23": "selected",
};

const CalendarSection = ({ variant = "dashboard" }: CalendarSectionProps) => {
  const isDashboard = variant === "dashboard";

  const value = isDashboard ? new Date(2026, 7, 23) : new Date(2025, 0, 12);

  return (
    <div
      className={`rounded-3xl bg-white px-5 py-4 shadow-[0px_15px_25px_10px_rgba(0,0,0,0.05)]
      ${isDashboard ? "w-[330px]" : "w-full"}`}
    >
      <Calendar
        value={value}
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={true}
        formatShortWeekday={(locale, date) =>
          ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][date.getDay()]
        }
        tileClassName={({ date, view }) => {
          if (view !== "month") return "";
          // Timetable Variant
          if (!isDashboard) {
            const selectedDate = date.getDate() === 12 ? "selected-simple" : "";

            const outlinedDate = date.getDate() === 16 ? "outlined-date" : "";

            return `${selectedDate} ${outlinedDate}`;
          }
          // Dashboard Variant
          const formattedDate = date.toISOString().split("T")[0];

          return attendanceMap[formattedDate] || "";
        }}
      />
      {/* Legend Only For Dashboard */}
      {isDashboard && (
        <div className="mt-2 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-[10px] w-[10px] rounded-full bg-[#6CD63C]" />
            <span className="text-[10px] font-semibold text-[#4B4B4B]">
              PRESENT
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-[10px] w-[10px] rounded-full bg-[#FF4D6D]" />
            <span className="text-[10px] font-semibold text-[#4B4B4B]">
              ABSENT
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-[10px] w-[10px] rounded-full bg-[#F5B333]" />
            <span className="text-[10px] font-semibold text-[#4B4B4B]">
              HOLIDAY
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarSection;
