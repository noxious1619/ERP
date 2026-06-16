
interface StudentAttendance {
  rollNo: string
  name: string
  status: ("P" | "A" | "L")[]
  percentage: number
}

const ATTENDANCE_DATA: StudentAttendance[] = [
  { rollNo: "001", name: "Aarav Sharma", status: ["P", "P", "P", "P", "P", "P"], percentage: 100.0 },
  { rollNo: "002", name: "Priya Patel", status: ["P", "L", "P", "P", "A", "P"], percentage: 85.7 },
  { rollNo: "003", name: "Rohan Gupta", status: ["A", "A", "L", "A", "A", "A"], percentage: 14.2 },
  { rollNo: "004", name: "Ananya Singh", status: ["P", "P", "P", "L", "P", "P"], percentage: 100.0 },
  { rollNo: "005", name: "Kabir Mehta", status: ["P", "L", "P", "P", "P", "P"], percentage: 100.0 },
  { rollNo: "006", name: "Diya Reddy", status: ["A", "A", "A", "A", "A", "P"], percentage: 14.2 },
  { rollNo: "007", name: "Arjun Kumar", status: ["P", "L", "P", "P", "A", "P"], percentage: 85.7 },
  { rollNo: "008", name: "Sara Khan", status: ["P", "P", "L", "L", "P", "P"], percentage: 100.0 },
  { rollNo: "009", name: "Ishita Desai", status: ["P", "L", "P", "P", "P", "P"], percentage: 100.0 },
  { rollNo: "010", name: "Vihaan Joshi", status: ["A", "A", "A", "P", "L", "A"], percentage: 28.5 }
]

export default function DailyAttendanceMatrix() {
  const getStatusBadge = (status: "P" | "A" | "L") => {
    switch (status) {
      case "P":
        return (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-green-50 text-green-600 border border-green-100 font-bold text-[10px]">
            P
          </span>
        )
      case "A":
        return (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-red-50 text-red-600 border border-red-100 font-bold text-[10px]">
            A
          </span>
        )
      case "L":
        return (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-50 text-amber-600 border border-amber-100 font-bold text-[10px]">
            L
          </span>
        )
    }
  }

  const getPercentageBadge = (pct: number) => {
    const isLow = pct < 75
    return (
      <span 
        className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition ${
          isLow 
            ? "bg-red-50 text-red-600 border-red-100" 
            : "bg-green-50 text-green-600 border-green-100"
        }`}
      >
        {pct.toFixed(1)}%
      </span>
    )
  }

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-3xs overflow-hidden flex flex-col h-full justify-between">
      
      {/* Card Header Panel */}
      <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <h3 className="font-bold text-gray-900 text-[14px]">
          Daily Attendance Matrix
        </h3>
        
        {/* Table Legend */}
        <div className="flex items-center gap-3.5 text-[11px] font-semibold text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-green-50 text-green-600 border border-green-100 font-bold text-[9px]">P</span>
            <span>Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-red-50 text-red-600 border border-red-100 font-bold text-[9px]">A</span>
            <span>Absent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-amber-50 text-amber-600 border border-amber-100 font-bold text-[9px]">L</span>
            <span>Late</span>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/45">
              <th className="py-3 px-5 w-20">Roll No.</th>
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4 text-center">Mon 08 Jun</th>
              <th className="py-3 px-4 text-center">Tue 11 Jun</th>
              <th className="py-3 px-4 text-center">Wed 12 Jun</th>
              <th className="py-3 px-4 text-center">Thu 12 Jun</th>
              <th className="py-3 px-4 text-center">Fri 12 Jun</th>
              <th className="py-3 px-4 text-center">Sat 12 Jun</th>
              <th className="py-3 px-5 text-right w-32">Attendance %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ATTENDANCE_DATA.map((row) => {
              const isLow = row.percentage < 75
              return (
                <tr 
                  key={row.rollNo} 
                  className={`transition hover:bg-gray-50/20 ${
                    isLow ? "bg-red-50/25" : ""
                  }`}
                >
                  {/* Roll No. */}
                  <td className={`py-3 px-5 text-xs font-bold ${
                    isLow ? "text-red-500" : "text-gray-500"
                  }`}>
                    {row.rollNo}
                  </td>

                  {/* Student Name */}
                  <td className={`py-3 px-4 text-xs font-bold ${
                    isLow ? "text-red-500" : "text-gray-950"
                  }`}>
                    {row.name}
                  </td>

                  {/* Status Blocks */}
                  {row.status.map((st, i) => (
                    <td key={i} className="py-3 px-4 text-center">
                      {getStatusBadge(st)}
                    </td>
                  ))}

                  {/* Attendance Percentage Badge */}
                  <td className="py-3 px-5 text-right">
                    {getPercentageBadge(row.percentage)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-white text-xs">
        <span className="font-semibold text-gray-500 text-[11px]">
          Showing 1 of 5 weeks
        </span>

        <div className="flex items-center gap-1.5">
          <button className="px-3 h-8 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-[11px] rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-white" disabled>
            Previous
          </button>
          
          <button className="w-8 h-8 bg-[#4285F4] text-white font-bold text-[11px] rounded-lg shadow-3xs cursor-pointer">
            1
          </button>
          
          <button className="w-8 h-8 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 font-semibold text-[11px] rounded-lg transition cursor-pointer">
            2
          </button>

          <button className="w-8 h-8 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 font-semibold text-[11px] rounded-lg transition cursor-pointer">
            3
          </button>

          <button className="px-3 h-8 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-[11px] rounded-lg transition cursor-pointer">
            Next
          </button>
        </div>
      </div>

    </div>
  )
}
