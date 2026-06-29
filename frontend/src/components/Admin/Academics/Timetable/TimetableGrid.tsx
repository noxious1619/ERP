import { User, MapPin } from "lucide-react"

export type BlockType = "subject" | "assign" | "break"

export interface TimetableBlock {
  id?: string
  type: BlockType
  subject?: string
  teacher?: string
  day: string
  periodNumber: number
  timeRange: string
  hasClose?: boolean
  subjectId?: string
  teacherId?: string
  room?: string
  color?: string
}

interface TimetableGridProps {
  activeTab: "Teacher" | "Student"
  scheduleData: any[]
  isLoading: boolean
  periods: { period: number; startTime: string; endTime: string }[]
  onBlockClick: (block: TimetableBlock) => void
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default function TimetableGrid({
  activeTab,
  scheduleData,
  isLoading,
  periods,
  onBlockClick,
}: TimetableGridProps) {
  // Construct lookup table for weekly data based on the dynamic periods list
  const gridData: Record<number, Record<string, any>> = {}
  periods.forEach((p) => {
    gridData[p.period] = {}
    for (const day of DAYS) {
      gridData[p.period][day] = { type: "assign" }
    }
  })

  // Map API entries into the grid lookup
  scheduleData.forEach((entry) => {
    const rawDay = entry.day.toUpperCase()
    const dayName = rawDay.charAt(0) + rawDay.slice(1).toLowerCase() // MONDAY -> Monday
    if (gridData[entry.period] && DAYS.includes(dayName)) {
      gridData[entry.period][dayName] = {
        id: entry.id,
        type: entry.isBreak ? "break" : "subject",
        subjectName: entry.isBreak ? (entry.breakLabel || "Break") : (entry.subject?.name || "Subject"),
        subjectCode: entry.isBreak ? "" : (entry.subject?.code || ""),
        teacher: entry.isBreak ? undefined : (entry.displayTeacherName || "Unassigned"),
        subjectId: entry.subjectId || entry.subject?.id,
        teacherId: entry.teacherId || entry.teacher?.id,
        room: entry.room || "",
        color: entry.color || "",
        hasClose: activeTab === "Student",
        sectionLabel: entry.sectionLabel || "",
      }
    }
  })

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
          {isLoading ? (
            <tr>
              <td colSpan={7} className="px-6 py-20 text-center text-gray-500 font-medium bg-white">
                <div className="flex flex-col items-center justify-center gap-3">
                  <span className="w-8 h-8 border-3 border-[#4285F4] border-t-transparent rounded-full animate-spin"></span>
                  <span className="text-sm font-semibold text-gray-600">Loading timetable schedule...</span>
                </div>
              </td>
            </tr>
          ) : periods.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-20 text-center text-gray-500 font-medium bg-white">
                No periods configured. Click "Manage Periods" to initialize structure.
              </td>
            </tr>
          ) : (
            periods.map((period) => (
              <tr key={period.period} className="border-b border-gray-200 last:border-0">
                {/* Period details col */}
                <td className="px-4 py-5 border-r border-gray-100 text-center bg-gray-50/10">
                  <span className="block font-bold text-gray-900">Period {period.period}</span>
                  <span className="block text-[11px] text-gray-400 font-medium mt-0.5">
                    {period.startTime} - {period.endTime}
                  </span>
                </td>

                {/* Day cols */}
                {DAYS.map((day) => {
                  const cell = gridData[period.period]?.[day] || { type: "assign" }

                  if (cell.type === "break") {
                    return (
                      <td key={day} className="p-2">
                        <div
                          onClick={() => {
                            if (activeTab === "Student") {
                              onBlockClick({
                                id: cell.id,
                                type: "break",
                                day: day,
                                periodNumber: period.period,
                                timeRange: `${period.startTime} - ${period.endTime}`,
                                subject: cell.subjectName,
                                hasClose: cell.hasClose,
                              })
                            }
                          }}
                          className={`bg-[#FFF8E6] border border-[#FFE7A3] rounded-xl py-3 flex items-center justify-center text-amber-700 text-xs font-bold uppercase tracking-wider select-none h-[100px] ${
                            activeTab === "Student" ? "hover:shadow-md hover:border-amber-400 cursor-pointer" : ""
                          }`}
                        >
                          {cell.subjectName}
                        </div>
                      </td>
                    )
                  }

                  if (cell.type === "subject") {
                    const subtitleLabel = activeTab === "Student" ? (cell.teacher || "Unassigned") : (cell.sectionLabel || "Unassigned")
                    return (
                      <td key={day} className="p-2">
                        <div
                          onClick={() => {
                            if (activeTab === "Student") {
                              onBlockClick({
                                id: cell.id,
                                type: "subject",
                                subject: cell.subjectName,
                                teacher: cell.teacher,
                                day,
                                periodNumber: period.period,
                                timeRange: `${period.startTime} - ${period.endTime}`,
                                subjectId: cell.subjectId,
                                teacherId: cell.teacherId,
                                room: cell.room,
                                color: cell.color,
                                hasClose: cell.hasClose,
                              })
                            }
                          }}
                          className={`bg-blue-50/40 border border-blue-200/80 rounded-xl p-3 flex flex-col justify-between text-left relative transition duration-200 h-[100px] group ${
                            activeTab === "Student" ? "hover:shadow-md hover:border-[#4285F4] cursor-pointer" : "select-none"
                          }`}
                        >
                          <div className="flex flex-col h-full justify-between overflow-hidden">
                            <div className="flex flex-col overflow-hidden">
                              {cell.subjectCode && (
                                <span className="text-[10px] font-bold text-[#4285F4] uppercase tracking-[1px] leading-tight">
                                  {cell.subjectCode}
                                </span>
                              )}
                              <span className="font-bold text-gray-900 text-xs truncate max-w-[110px] leading-snug" title={cell.subjectName}>
                                {cell.subjectName}
                              </span>
                            </div>
                            <div className="flex flex-col gap-0.5 mt-auto">
                              <div className="flex items-center gap-1.5 text-[9px] text-[#707789]" title={subtitleLabel}>
                                <User size={10} className="shrink-0 text-[#707789]" />
                                <span className="truncate max-w-[95px]">{subtitleLabel}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[9px] text-[#707789]" title={cell.room}>
                                <MapPin size={10} className="shrink-0 text-[#707789]" />
                                <span className="truncate max-w-[95px]">{cell.room ? cell.room : "-"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    )
                  }

                  // Default "assign"
                  return (
                    <td key={day} className="p-2">
                      {activeTab === "Student" ? (
                        <div
                          onClick={() =>
                            onBlockClick({
                              id: cell.id,
                              type: "assign",
                              day,
                              periodNumber: period.period,
                              timeRange: `${period.startTime} - ${period.endTime}`,
                              room: cell.room,
                              color: cell.color
                            })
                          }
                          className="border border-dashed border-gray-300 bg-gray-50/10 hover:bg-blue-50/10 hover:border-[#4285F4] rounded-xl flex items-center justify-center transition duration-200 cursor-pointer h-[100px]"
                        >
                          <span className="text-gray-400 text-xs font-semibold tracking-wide">+ Assign</span>
                        </div>
                      ) : (
                        <div className="border border-dashed border-gray-100 bg-gray-50/5 rounded-xl h-[100px] select-none cursor-default" />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
