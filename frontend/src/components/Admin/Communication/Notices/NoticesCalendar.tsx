import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface NoticesCalendarProps {
  selectedDate: Date | null
  onDateSelect: (date: Date | null) => void
}

export default function NoticesCalendar({ selectedDate, onDateSelect }: NoticesCalendarProps) {
  const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

  // Initialize to the actual current date on first load
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() // 0-indexed

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  // Calculate days in the current displayed month
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
  const daysInMonth = getDaysInMonth(year, month)

  // Calculate day starting index (0 for Monday, 6 for Sunday)
  const getFirstDayIndex = (y: number, m: number) => {
    const day = new Date(y, m, 1).getDay()
    return day === 0 ? 6 : day - 1
  }
  const firstDayIndex = getFirstDayIndex(year, month)
  const blankCells = Array.from({ length: firstDayIndex })
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  // Highlight Checks
  const isToday = (day: number) => {
    const today = new Date()
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year
  }

  const isScheduled = (day: number) => {
    // Scheduled notices are set on 18, 20, 25 of the current month
    const today = new Date()
    if (month === today.getMonth() && year === today.getFullYear()) {
      return [18, 20, 25].includes(day)
    }
    return false
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    )
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day)
    if (isSelected(day)) {
      // Toggle selection off if clicking selected date again
      onDateSelect(null)
    } else {
      onDateSelect(clickedDate)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm w-full max-w-[320px] shrink-0 self-start">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-5">
        <h4 className="font-bold text-gray-900 text-sm">
          {monthNames[month]} {year}
        </h4>
        <div className="flex items-center gap-1">
          <button 
            onClick={handlePrevMonth}
            className="p-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekdays Grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <span key={day} className="text-[10px] font-semibold text-gray-400 text-center uppercase tracking-wider">
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Blank cells for start offset */}
        {blankCells.map((_, idx) => (
          <div key={`blank-${idx}`} className="w-8 h-8" />
        ))}
        
        {/* Days of the month */}
        {daysArray.map((day) => {
          const todayFlag = isToday(day)
          const scheduledFlag = isScheduled(day)
          const selectedFlag = isSelected(day)

          // 1. Today Highlight (matches blue circle in mockup)
          if (todayFlag) {
            return (
              <div 
                key={day} 
                onClick={() => handleDateClick(day)}
                className="flex flex-col items-center justify-center w-8 h-8 relative mx-auto cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-full bg-[#4285F4] text-white flex items-center justify-center text-xs font-bold shadow-xs select-none hover:bg-blue-600 transition ${
                  selectedFlag ? "ring-2 ring-blue-700 ring-offset-1" : ""
                }`}>
                  {day}
                </div>
                {/* Underneath Dot */}
                <span className="w-1 h-1 bg-[#4285F4] rounded-full absolute bottom-[-4px]" />
              </div>
            )
          }

          // 2. Notice Scheduled (matches green text and dot in mockup)
          if (scheduledFlag) {
            return (
              <div 
                key={day} 
                onClick={() => handleDateClick(day)}
                className="flex flex-col items-center justify-center w-8 h-8 relative mx-auto cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  selectedFlag 
                    ? "ring-2 ring-[#4285F4] bg-[#4285F4]/10 text-emerald-600" 
                    : "text-emerald-600 hover:bg-gray-50"
                }`}>
                  {day}
                </div>
                {/* Underneath Dot */}
                <span className="w-1 h-1 bg-emerald-500 rounded-full absolute bottom-[-4px]" />
              </div>
            )
          }

          // 3. Standard and Selected Day styles
          return (
            <div 
              key={day} 
              onClick={() => handleDateClick(day)}
              className={`flex items-center justify-center w-8 h-8 mx-auto text-xs font-semibold rounded-full cursor-pointer select-none transition ${
                selectedFlag 
                  ? "ring-2 ring-[#4285F4] bg-blue-50/70 text-gray-900" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {day}
            </div>
          )
        })}
      </div>

      {/* Legends & Filter Actions Footer */}
      <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col gap-2.5 text-xs font-medium text-gray-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#4285F4] rounded-full" />
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
