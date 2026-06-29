interface StudentRow {
  id: string
  rollNumber: string
  name: string
  className: string
  sectionName: string
  percentage: number | null
}

interface DailyAttendanceMatrixProps {
  rows: StudentRow[]
  isLoading: boolean
  error: string | null
  page: number
  totalPages: number
  totalCount: number
  onPageChange: (p: number) => void
}

export default function DailyAttendanceMatrix({
  rows = [],
  isLoading = false,
  error = null,
  page = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange,
}: DailyAttendanceMatrixProps) {
  const getPercentageBadge = (pct: number | null) => {
    if (pct === null) {
      return (
        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold border bg-gray-50 text-gray-400 border-gray-100 italic">
          N/A
        </span>
      )
    }
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

  // Generate pagination buttons
  const renderPageButtons = () => {
    const buttons = []
    for (let i = 1; i <= totalPages; i++) {
      if (i === page) {
        buttons.push(
          <button
            key={i}
            className="w-8 h-8 bg-[#4285F4] text-white font-bold text-[11px] rounded-lg shadow-3xs cursor-pointer"
          >
            {i}
          </button>
        )
      } else {
        buttons.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className="w-8 h-8 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 font-semibold text-[11px] rounded-lg transition cursor-pointer"
          >
            {i}
          </button>
        )
      }
    }
    return buttons
  }

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-3xs overflow-hidden flex flex-col h-[400px]">
      
      {/* Card Header Panel */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-2.5">
        <h3 className="font-bold text-gray-900 text-[14px]">
          Student Attendance Matrix
        </h3>
      </div>

      {/* Matrix Table */}
      <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/75">
              <th className="py-3 px-5 w-24 sticky top-0 bg-gray-50 z-10 border-b border-gray-100">Roll No.</th>
              <th className="py-3 px-4 sticky top-0 bg-gray-50 z-10 border-b border-gray-100">Student Name</th>
              <th className="py-3 px-5 text-right w-36 sticky top-0 bg-gray-50 z-10 border-b border-gray-100">Attendance %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* ── loading ── */}
            {isLoading && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-xs text-gray-500 font-semibold">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#4285F4] border-t-transparent rounded-full animate-spin"></span>
                    Loading matrix records...
                  </div>
                </td>
              </tr>
            )}

            {/* ── error ── */}
            {!isLoading && error && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-xs text-red-500 font-semibold">
                  {error}
                </td>
              </tr>
            )}

            {/* ── empty ── */}
            {!isLoading && !error && rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-xs text-gray-400 font-semibold">
                  No attendance records found.
                </td>
              </tr>
            )}

            {/* ── data rows ── */}
            {!isLoading && !error && rows.map((row) => {
              const isLow = row.percentage !== null && row.percentage < 75
              return (
                <tr 
                  key={row.id} 
                  className={`transition hover:bg-gray-50/20 ${
                    isLow ? "bg-red-50/25" : ""
                  }`}
                >
                  {/* Roll No. */}
                  <td className={`py-3 px-5 text-xs font-bold ${
                    isLow ? "text-red-500" : "text-gray-500"
                  }`}>
                    {row.rollNumber}
                  </td>

                  {/* Student Name */}
                  <td className={`py-3 px-4 text-xs font-bold ${
                    isLow ? "text-red-500" : "text-gray-950"
                  }`}>
                    {row.name}
                  </td>

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
          Showing page {page} of {totalPages} ({totalCount} total students)
        </span>

        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-3 h-8 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-[11px] rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-white"
          >
            Previous
          </button>
          
          {renderPageButtons()}

          <button 
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 h-8 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-[11px] rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  )
}
