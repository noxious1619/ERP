import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../../style/Student/Dashboard/calendar.css";

// 1. Define communication channels in props
type CalendarSectionProps = {
  variant?: "dashboard" | "timetable";
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
};

const CalendarSection = ({ 
  variant = "dashboard",
  selectedDate = new Date(),
  onDateSelect
}: CalendarSectionProps) => {
  const isDashboard = variant === "dashboard";

  // 2. Control the active highlighted value via the parent state
  const value = isDashboard ? new Date(2026, 7, 23) : selectedDate;

  return (
    <div className={`rounded-3xl bg-white px-5 py-4 shadow-[0px_15px_25px_10px_rgba(0,0,0,0.05)] ${isDashboard ? "w-[330px]" : "w-full"}`}>
      <Calendar
        value={value}
        // 3. Inform parent state when a user clicks a day tile
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
          
          if (!isDashboard) {
            // Apply visual active focus highlights matching state values
            const isSelected = date.getDate() === selectedDate.getDate() && 
                             date.getMonth() === selectedDate.getMonth() &&
                             date.getFullYear() === selectedDate.getFullYear();
                             
            return isSelected ? "selected-simple" : "";
          }
          return "";
        }}
      />
    </div>
  );
};

export default CalendarSection;