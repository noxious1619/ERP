import { Users, UserCheck, CheckCircle2, BookOpen, TrendingUp, TrendingDown } from "lucide-react"

interface DashboardStatsGridProps {
  stats?: {
    totalStudents?: number;
    totalStaff?: number;
    studentAttendanceToday?: number | null;
    newAdmissions?: number;
    activeClasses?: number;
    pendingFees?: number | null;
  }
}

export default function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  const statItems = [
    {
      label: "Total Students",
      value: stats?.totalStudents !== undefined ? stats.totalStudents.toLocaleString() : "No Data",
      trend: "Active",
      trendType: "neutral",
      icon: Users,
      iconBg: "bg-blue-50 text-blue-500",
      gridClass: "col-span-1 lg:col-span-4",
    },
    {
      label: "Total Staff",
      value: stats?.totalStaff !== undefined ? stats.totalStaff.toLocaleString() : "No Data",
      trend: "Teachers & Staff",
      trendType: "neutral",
      icon: UserCheck,
      iconBg: "bg-green-50 text-green-500",
      gridClass: "col-span-1 lg:col-span-4",
    },
    {
      label: "Student Attendance Today",
      value: stats?.studentAttendanceToday !== null && stats?.studentAttendanceToday !== undefined 
        ? `${stats.studentAttendanceToday}%` 
        : "No Data",
      trend: stats?.studentAttendanceToday !== null && stats?.studentAttendanceToday !== undefined 
        ? "Present / Late" 
        : "No logs today",
      trendType: "neutral",
      icon: CheckCircle2,
      iconBg: "bg-green-50 text-green-500",
      gridClass: "col-span-1 lg:col-span-4",
    },
  
    {
      label: "Active Classes",
      value: stats?.activeClasses !== undefined ? stats.activeClasses.toString() : "No Data",
      trend: "Covered sections",
      trendType: "neutral",
      icon: BookOpen,
      iconBg: "bg-blue-50 text-blue-500",
      gridClass: "col-span-1 sm:col-span-2 lg:col-span-6",
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 mb-6">
      {statItems.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <div key={idx} className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex justify-between items-start ${stat.gridClass}`}>
            <div className="flex flex-col">
              <span className="text-gray-400 text-xs font-semibold tracking-wide uppercase mb-1">{stat.label}</span>
              <span className="text-3xl font-extrabold text-gray-900">{stat.value}</span>
              
              <div className="flex items-center gap-1 mt-2 text-xs font-medium">
                {stat.trendType === "up" && (
                  <span className="text-green-600 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" />
                    {stat.trend}
                  </span>
                )}
                {stat.trendType === "down" && (
                  <span className="text-red-600 flex items-center gap-0.5">
                    <TrendingDown className="h-3 w-3" />
                    {stat.trend}
                  </span>
                )}
                {stat.trendType === "neutral" && (
                  <span className="text-gray-500">
                    {stat.trend}
                  </span>
                )}
              </div>
            </div>

            <div className={`p-3 rounded-2xl ${stat.iconBg}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
