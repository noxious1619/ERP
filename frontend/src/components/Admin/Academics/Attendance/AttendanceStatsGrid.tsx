interface AttendanceStatsGridProps {
  attendanceRate?: string
  totalAbsent?: number
  lateEntries?: number
  defaulters?: number
}

export default function AttendanceStatsGrid({
  attendanceRate = "78.0%",
  totalAbsent = 22,
  lateEntries = 5,
  defaulters = 3
}: AttendanceStatsGridProps) {
  const stats = [
    { label: "Attendance Rate", value: attendanceRate, isRed: false },
    { label: "Total Absent", value: totalAbsent.toString(), isRed: false },
    { label: "Late Entries", value: lateEntries.toString(), isRed: false },
    { label: "Defaulters", value: defaulters.toString(), isRed: true }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat) => (
        <div 
          key={stat.label} 
          className="border border-gray-200 rounded-xl p-5 bg-white flex flex-col gap-1 shadow-3xs"
        >
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {stat.label}
          </span>
          <span 
            className={`text-2xl font-black tracking-tight ${
              stat.isRed ? "text-red-500 font-bold" : "text-gray-950"
            }`}
          >
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  )
}
