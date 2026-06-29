import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import "../../../../style/Student/Dashboard/calendar.css"
import "../../../../style/Admin/Communication/noticesCalendar.css"

interface NoticesCalendarProps {
  selectedDate: Date | null
  onDateSelect: (date: Date | null) => void
  /** ISO date strings (YYYY-MM-DD) for dates that have at least one notice */
  noticeDates?: string[]
}

export default function NoticesCalendar({ selectedDate, onDateSelect, noticeDates = [] }: NoticesCalendarProps) {
  const today = new Date()

  const isScheduled = (date: Date) => {
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    return noticeDates.includes(key)
  }

  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return ""

    const isSelected =
      selectedDate !== null &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()

    const scheduled = isScheduled(date)

    const classes: string[] = []

    if (isSelected) classes.push("selected-simple")
    if (scheduled) classes.push("notice-scheduled")

    return classes.join(" ")
  }

  const handleChange = (val: unknown) => {
    if (val instanceof Date) {
      // Toggle off if the same date is clicked again
      if (
        selectedDate &&
        val.getDate() === selectedDate.getDate() &&
        val.getMonth() === selectedDate.getMonth() &&
        val.getFullYear() === selectedDate.getFullYear()
      ) {
        onDateSelect(null)
      } else {
        onDateSelect(val)
      }
    }
  }

  return (
    <div className="rounded-3xl bg-white px-6 py-6 shadow-[0px_15px_25px_10px_rgba(0,0,0,0.05)] w-full">
      <Calendar
        value={selectedDate ?? today}
        onChange={handleChange}
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={true}
        formatShortWeekday={(_locale, date) =>
          ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][date.getDay()]
        }
        tileClassName={getTileClassName}
        tileContent={({ date, view }) => {
          if (view !== "month") return null
          if (isScheduled(date)) {
            return (
              <span className="notices-calendar__dot notices-calendar__dot--scheduled" />
            )
          }
          // Show dot under today as well
          const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
          if (isToday) {
            return <span className="notices-calendar__dot notices-calendar__dot--today" />
          }
          return null
        }}
      />

      {/* Legend + Clear Filter */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-2 text-xs font-medium text-gray-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#3b82f6] rounded-full" />
            <span>Today</span>
          </div>
          {selectedDate && (
            <button
              data-clear-date
              onClick={() => onDateSelect(null)}
              className="text-[#4285F4] hover:text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          <span>Notice scheduled</span>
        </div>
      </div>
    </div>
  )
}
