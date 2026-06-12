import { X } from "lucide-react"

export type BlockType = "subject" | "assign" | "break"

export interface TimetableBlock {
  type: BlockType
  subject?: string
  teacher?: string
  day: string
  periodNumber: number
  timeRange: string
  hasClose?: boolean
}

interface TimetableGridProps {
  onBlockClick: (block: TimetableBlock) => void
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const PERIOD_TIMES = [
  { num: 1, range: "08:00 - 08:45" },
  { num: 2, range: "08:45 - 09:30" },
  { num: 3, range: "09:30 - 10:15" },
  { num: 4, range: "10:30 - 11:15" },
  { num: 5, range: "11:15 - 12:00" },
  { num: 6, range: "12:00 - 12:45" },
  { num: 7, range: "01:15 - 02:00" },
  { num: 8, range: "02:00 - 02:45" }
]

// Grid layout mapping for quick lookup: [periodNumber][dayIndex]
const TIMETABLE_DATA: Record<number, Record<string, { type: BlockType; subject?: string; teacher?: string; hasClose?: boolean }>> = {
  1: {
    Monday: { type: "subject", subject: "Mathematics", teacher: "Mrs. Priya Sharma" },
    Tuesday: { type: "subject", subject: "English", teacher: "Ms. Sneha Reddy" },
    Wednesday: { type: "subject", subject: "Mathematics", teacher: "Mrs. Priya Sharma" },
    Thursday: { type: "subject", subject: "Mathematics", teacher: "Mrs. Priya Sharma" },
    Friday: { type: "subject", subject: "Mathematics", teacher: "Mrs. Priya Sharma", hasClose: true },
    Saturday: { type: "assign" }
  },
  2: {
    Monday: { type: "subject", subject: "English", teacher: "Ms. Sneha Reddy" },
    Tuesday: { type: "subject", subject: "Mathematics", teacher: "Mrs. Priya Sharma" },
    Wednesday: { type: "subject", subject: "Science", teacher: "Dr. Anjali Verma" },
    Thursday: { type: "subject", subject: "English", teacher: "Ms. Sneha Reddy" },
    Friday: { type: "subject", subject: "English", teacher: "Ms. Sneha Reddy" },
    Saturday: { type: "assign" }
  },
  3: {
    Monday: { type: "subject", subject: "Hindi", teacher: "Mr. Suresh Rao" },
    Tuesday: { type: "subject", subject: "Computer Science", teacher: "Mr. Ravi Kumar" },
    Wednesday: { type: "subject", subject: "English", teacher: "Ms. Sneha Reddy" },
    Thursday: { type: "subject", subject: "Hindi", teacher: "Mr. Suresh Rao" },
    Friday: { type: "assign" },
    Saturday: { type: "assign" }
  },
  4: {
    Monday: { type: "subject", subject: "Mathematics", teacher: "Mrs. Priya Sharma" },
    Tuesday: { type: "break", subject: "Short Break" },
    Wednesday: { type: "break", subject: "Short Break" },
    Thursday: { type: "break", subject: "Short Break" },
    Friday: { type: "break", subject: "Short Break" },
    Saturday: { type: "break", subject: "Short Break" }
  },
  5: {
    Monday: { type: "subject", subject: "Science", teacher: "Dr. Anjali Verma" },
    Tuesday: { type: "assign" },
    Wednesday: { type: "assign" },
    Thursday: { type: "assign" },
    Friday: { type: "assign" },
    Saturday: { type: "assign" }
  },
  6: {
    Monday: { type: "assign" },
    Tuesday: { type: "assign" },
    Wednesday: { type: "assign" },
    Thursday: { type: "assign" },
    Friday: { type: "assign" },
    Saturday: { type: "assign" }
  },
  7: {
    Monday: { type: "break", subject: "Lunch Break" },
    Tuesday: { type: "break", subject: "Lunch Break" },
    Wednesday: { type: "break", subject: "Lunch Break" },
    Thursday: { type: "break", subject: "Lunch Break" },
    Friday: { type: "break", subject: "Lunch Break" },
    Saturday: { type: "break", subject: "Lunch Break" }
  },
  8: {
    Monday: { type: "assign" },
    Tuesday: { type: "assign" },
    Wednesday: { type: "assign" },
    Thursday: { type: "assign" },
    Friday: { type: "assign" },
    Saturday: { type: "assign" }
  }
}

export default function TimetableGrid({ onBlockClick }: TimetableGridProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-4 font-bold text-gray-900 border-r border-gray-100 text-center bg-gray-50/20 w-[140px]">
              Period / Day
            </th>
            {DAYS.map((day) => (
              <th key={day} className="px-4 py-4 font-bold text-gray-900 text-center w-[140px]">
                {day}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {PERIOD_TIMES.map((period) => (
            <tr key={period.num} className="border-b border-gray-200 last:border-0">
              {/* Period details col */}
              <td className="px-4 py-5 border-r border-gray-100 text-center bg-gray-50/10">
                <span className="block font-bold text-gray-900">Period {period.num}</span>
                <span className="block text-[11px] text-gray-400 font-medium mt-0.5">{period.range}</span>
              </td>

              {/* Day cols */}
              {DAYS.map((day) => {
                const cell = TIMETABLE_DATA[period.num]?.[day] || { type: "assign" }

                if (cell.type === "break") {
                  return (
                    <td key={day} className="p-2">
                      <div className="bg-[#FFF8E6] border border-[#FFE7A3] rounded-xl py-3 flex items-center justify-center text-amber-700 text-xs font-bold uppercase tracking-wider select-none h-[64px]">
                        {cell.subject}
                      </div>
                    </td>
                  )
                }

                if (cell.type === "subject") {
                  return (
                    <td key={day} className="p-2">
                      <div 
                        onClick={() => onBlockClick({
                          type: "subject",
                          subject: cell.subject,
                          teacher: cell.teacher,
                          day,
                          periodNumber: period.num,
                          timeRange: period.range,
                          hasClose: cell.hasClose
                        })}
                        className="bg-blue-50/40 border border-blue-200/80 rounded-xl p-3 flex flex-col text-left relative hover:shadow-md hover:border-[#4285F4] transition duration-200 cursor-pointer h-[64px] group"
                      >
                        <span className="font-bold text-gray-900 text-xs truncate max-w-[110px]">{cell.subject}</span>
                        <span className="text-[11px] text-gray-500 truncate max-w-[110px] mt-0.5">{cell.teacher}</span>
                        {cell.hasClose && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              // Optional: call a delete/remove logic, for now open standard modal
                              onBlockClick({
                                type: "subject",
                                subject: cell.subject,
                                teacher: cell.teacher,
                                day,
                                periodNumber: period.num,
                                timeRange: period.range,
                                hasClose: true
                              })
                            }}
                            className="absolute top-1.5 right-1.5 bg-blue-100/80 text-blue-500 rounded-full p-0.5 hover:bg-blue-200 transition-colors shadow-xs"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )
                }

                // Default "assign"
                return (
                  <td key={day} className="p-2">
                    <div
                      onClick={() => onBlockClick({
                        type: "assign",
                        day,
                        periodNumber: period.num,
                        timeRange: period.range
                      })}
                      className="border border-dashed border-gray-300 bg-gray-50/10 hover:bg-blue-50/10 hover:border-[#4285F4] rounded-xl flex items-center justify-center transition duration-200 cursor-pointer h-[64px]"
                    >
                      <span className="text-gray-400 text-xs font-semibold tracking-wide">+ Assign</span>
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
