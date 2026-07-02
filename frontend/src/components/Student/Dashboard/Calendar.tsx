import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../../style/Student/Dashboard/calendar.css";

type CalendarSectionProps = {
  variant?: "dashboard" | "timetable";
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  heatmapData?: Record<string, "P" | "A" | "H">;
  className?: string;
};

const CalendarSection = ({
  variant = "dashboard",
  selectedDate = new Date(),
  onDateSelect,
  heatmapData = {},
  className,
}: CalendarSectionProps) => {
  const isDashboard = variant === "dashboard";

  // className prop overrides the default width behaviour when provided
  const containerWidth = className ?? (isDashboard ? "w-[340px]" : "w-full");

  return (
    <div
      className={`rounded-3xl bg-white px-6 py-6 shadow-[0px_15px_25px_10px_rgba(0,0,0,0.05)] ${containerWidth}`}
    >
      <Calendar
        value={selectedDate}
        onChange={(val) => {
          if (onDateSelect && val instanceof Date) {
            onDateSelect(val);
          }
        }}
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={true}
        formatShortWeekday={(_locale, date) =>
          ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][date.getDay()]
        }
        tileClassName={({ date, view }) => {
          if (view !== "month") return "";

          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const dateKey = `${year}-${month}-${day}`;
          const status = heatmapData[dateKey];

          if (isDashboard) {
            if (status === "P") return "present";
            if (status === "A") return "absent";
            if (status === "H") return "holiday";
            return "";
          }

          if (!isDashboard) {
            const isSelected =
              date.getDate() === selectedDate.getDate() &&
              date.getMonth() === selectedDate.getMonth() &&
              date.getFullYear() === selectedDate.getFullYear();
            return isSelected ? "selected-simple" : "";
          }

          return "";
        }}
      />

      {isDashboard && (
        <div className="mt-6 flex items-center justify-center gap-5 text-[10px] font-bold tracking-widest text-[#222222]">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-full bg-[#6cd63c]" />
            <span>PRESENT</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-full bg-[#ff4d6d]" />
            <span>ABSENT</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-full bg-[#f5b333]" />
            <span>HOLIDAY</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarSection;
