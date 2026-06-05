import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../../style/Student/Dashboard/calendar.css";

type CalendarSectionProps = {
  variant?: "dashboard" | "timetable";
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  heatmapData?: Record<string, "P" | "A" | "H">; 
};

const CalendarSection = ({ 
  variant = "dashboard",
  selectedDate = new Date(),
  onDateSelect,
  heatmapData = {} 
}: CalendarSectionProps) => {
  const isDashboard = variant === "dashboard";

  return (
    <div className={`rounded-3xl bg-white px-6 py-6 shadow-[0px_15px_25px_10px_rgba(0,0,0,0.05)] ${isDashboard ? "w-[340px]" : "w-full"}`}>
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
        formatShortWeekday={(locale, date) =>
          ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][date.getDay()]
        }
        tileClassName={({ date, view }) => {
          if (view !== "month") return "";
          
          // Construct the strict YYYY-MM-DD key for the dictionary lookup
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const dateKey = `${year}-${month}-${day}`;

          const status = heatmapData[dateKey];

          // Dashboard Heatmap Mode
          if (isDashboard) {
            // CRITICAL FIX: These now perfectly match your CSS file!
            if (status === "P") return "present";
            if (status === "A") return "absent";
            if (status === "H") return "holiday";
            return ""; // Your CSS handles the default grey background automatically
          }
          
          // Timetable/Interactive Mode
          if (!isDashboard) {
            const isSelected = date.getDate() === selectedDate.getDate() && 
                               date.getMonth() === selectedDate.getMonth() &&
                               date.getFullYear() === selectedDate.getFullYear();
            return isSelected ? "selected-simple" : "";
          }
          
          return "";
        }}
      />

      {/* Custom Legend */}
      {isDashboard && (
        <div className="mt-6 flex items-center justify-center gap-5 text-[10px] font-bold tracking-widest text-[#222222]">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-full bg-[#6cd63c]" /> {/* Matched to your CSS hex */}
            <span>PRESENT</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-full bg-[#ff4d6d]" /> {/* Matched to your CSS hex */}
            <span>ABSENT</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-full bg-[#f5b333]" /> {/* Matched to your CSS hex */}
            <span>HOLIDAY</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarSection;