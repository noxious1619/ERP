import { CheckCircle2, XCircle, Clock, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface AttendanceSnapshotCardProps {
  snapshot?: {
    present: number;
    absent: number;
    late: number;
    hasData: boolean;
  };
  weeklyTrend?: number[]; // Mon, Tue, Wed, Thu, Fri, Sat
}

export default function AttendanceSnapshotCard({ snapshot, weeklyTrend = [0, 0, 0, 0, 0, 0] }: AttendanceSnapshotCardProps) {
  const navigate = useNavigate()

  const hasSnapshotData = snapshot?.hasData === true
  const hasWeeklyTrendData = weeklyTrend.some((percent) => percent > 0)

  // Map values to height inside SVG (base is 160, max height is 140, so y = 160 - (percent / 100) * 140)
  const getBarHeight = (percent: number) => {
    return (percent / 100) * 140
  }

  const getBarY = (percent: number) => {
    return 160 - getBarHeight(percent)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 flex-1">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 font-sans">Attendance Snapshot</h3>
        <p className="text-sm text-gray-500 mt-0.5">Class-wise attendance for today</p>
      </div>

      {/* Snapshot Badges container */}
      <div className="bg-[#4285F4]/5 border border-blue-50/30 rounded-2xl p-4 flex justify-around items-center">
        {/* Present */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-lg font-bold text-gray-900">
              {hasSnapshotData ? snapshot.present.toLocaleString() : "-"}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-1">Present</span>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200"></div>

        {/* Absent */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-lg font-bold text-gray-900">
              {hasSnapshotData ? snapshot.absent.toLocaleString() : "-"}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-1">Absent</span>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200"></div>

        {/* Late */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-lg font-bold text-gray-900">
              {hasSnapshotData ? snapshot.late.toLocaleString() : "-"}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-1">Late</span>
        </div>
      </div>

      {/* Trend Section Header */}
      <div>
        <h4 className="font-bold text-gray-900 text-sm">Weekly Attendance Trend</h4>
        <p className="text-xs text-gray-500 mt-0.5">Overall school attendance percentage</p>
      </div>

      {/* Custom SVG Bar Chart */}
      <div className="w-full relative flex items-center justify-center p-2 border border-gray-100/50 bg-gray-50/20 rounded-2xl">
        <svg className={`w-full h-44 ${!hasWeeklyTrendData ? "opacity-20" : ""}`} viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          <line x1="30" y1="20" x2="380" y2="20" stroke="#F1F5F9" strokeDasharray="3 3" />
          <line x1="30" y1="55" x2="380" y2="55" stroke="#F1F5F9" strokeDasharray="3 3" />
          <line x1="30" y1="90" x2="380" y2="90" stroke="#F1F5F9" strokeDasharray="3 3" />
          <line x1="30" y1="125" x2="380" y2="125" stroke="#F1F5F9" strokeDasharray="3 3" />
          <line x1="30" y1="160" x2="380" y2="160" stroke="#E2E8F0" />

          {/* Y Axis labels */}
          <text x="20" y="24" fill="#94A3B8" fontSize="10" fontWeight="600" textAnchor="end">100</text>
          <text x="20" y="59" fill="#94A3B8" fontSize="10" fontWeight="600" textAnchor="end">75</text>
          <text x="20" y="94" fill="#94A3B8" fontSize="10" fontWeight="600" textAnchor="end">50</text>
          <text x="20" y="129" fill="#94A3B8" fontSize="10" fontWeight="600" textAnchor="end">25</text>
          <text x="20" y="164" fill="#94A3B8" fontSize="10" fontWeight="600" textAnchor="end">0</text>

          {/* Bars */}
          {hasWeeklyTrendData && (
            <>
              {/* Mon */}
              <rect x="55" y={getBarY(weeklyTrend[0])} width="22" height={getBarHeight(weeklyTrend[0])} rx="4" fill="#4285F4" className="hover:opacity-85 transition-opacity cursor-pointer" />
              {/* Tue */}
              <rect x="110" y={getBarY(weeklyTrend[1])} width="22" height={getBarHeight(weeklyTrend[1])} rx="4" fill="#4285F4" className="hover:opacity-85 transition-opacity cursor-pointer" />
              {/* Wed */}
              <rect x="165" y={getBarY(weeklyTrend[2])} width="22" height={getBarHeight(weeklyTrend[2])} rx="4" fill="#4285F4" className="hover:opacity-85 transition-opacity cursor-pointer" />
              {/* Thu */}
              <rect x="220" y={getBarY(weeklyTrend[3])} width="22" height={getBarHeight(weeklyTrend[3])} rx="4" fill="#4285F4" className="hover:opacity-85 transition-opacity cursor-pointer" />
              {/* Fri */}
              <rect x="275" y={getBarY(weeklyTrend[4])} width="22" height={getBarHeight(weeklyTrend[4])} rx="4" fill="#4285F4" className="hover:opacity-85 transition-opacity cursor-pointer" />
              {/* Sat */}
              <rect x="330" y={getBarY(weeklyTrend[5])} width="22" height={getBarHeight(weeklyTrend[5])} rx="4" fill="#4285F4" className="hover:opacity-85 transition-opacity cursor-pointer" />
            </>
          )}

          {/* X Axis labels */}
          <text x="66" y="176" fill="#94A3B8" fontSize="10" fontWeight="600" textAnchor="middle">Mon</text>
          <text x="121" y="176" fill="#94A3B8" fontSize="10" fontWeight="600" textAnchor="middle">Tue</text>
          <text x="176" y="176" fill="#94A3B8" fontSize="10" fontWeight="600" textAnchor="middle">Wed</text>
          <text x="231" y="176" fill="#94A3B8" fontSize="10" fontWeight="600" textAnchor="middle">Thu</text>
          <text x="286" y="176" fill="#94A3B8" fontSize="10" fontWeight="600" textAnchor="middle">Fri</text>
          <text x="341" y="176" fill="#94A3B8" fontSize="10" fontWeight="600" textAnchor="middle">Sat</text>
        </svg>

        {!hasWeeklyTrendData && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1.5px] rounded-2xl">
            <span className="text-sm font-semibold text-gray-400 border border-dashed border-gray-200 bg-white/80 p-3 rounded-2xl shadow-xs">
              No weekly trend data recorded
            </span>
          </div>
        )}
      </div>

      {/* Button footer */}
      <button 
        onClick={() => navigate("/admin/academics/attendance")}
        className="w-full text-center border border-gray-200 rounded-2xl py-3.5 text-[#4285F4] hover:bg-blue-50/20 text-sm font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
      >
        View Detailed Attendance <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
