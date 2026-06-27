import { Users, UserCheck, CheckCircle2, UserPlus, BookOpen, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

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
  // Format pending fees nicely
  let formattedFees = "No Data";
  if (stats?.pendingFees !== null && stats?.pendingFees !== undefined) {
    const fees = stats.pendingFees;
    if (fees === 0) {
      formattedFees = "₹0";
    } else if (fees >= 100000) {
      formattedFees = `₹${(fees / 100000).toFixed(1)}L`;
    } else if (fees >= 1000) {
      formattedFees = `₹${(fees / 1000).toFixed(1)}K`;
    } else {
      formattedFees = `₹${fees}`;
    }
  }

  const statItems = [
    {
      label: "Total Students",
      value: stats?.totalStudents !== undefined ? stats.totalStudents.toLocaleString() : "No Data",
      trend: "Active",
      trendType: "neutral",
      icon: Users,
      iconBg: "bg-blue-50 text-blue-500",
    },
    {
      label: "Total Staff",
      value: stats?.totalStaff !== undefined ? stats.totalStaff.toLocaleString() : "No Data",
      trend: "Teachers & Staff",
      trendType: "neutral",
      icon: UserCheck,
      iconBg: "bg-green-50 text-green-500",
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
    },
    {
      label: "New Admissions",
      value: stats?.newAdmissions !== undefined ? stats.newAdmissions.toString() : "No Data",
      trend: "Joined past 7d",
      trendType: "neutral",
      icon: UserPlus,
      iconBg: "bg-blue-50 text-blue-500",
    },
    {
      label: "Active Classes",
      value: stats?.activeClasses !== undefined ? stats.activeClasses.toString() : "No Data",
      trend: "Covered sections",
      trendType: "neutral",
      icon: BookOpen,
      iconBg: "bg-blue-50 text-blue-500",
    },
    {
      label: "Pending Fees",
      value: formattedFees,
      trend: stats?.pendingFees !== null && stats?.pendingFees !== undefined ? "Current ledger" : "No outstanding",
      trendType: "neutral",
      icon: DollarSign,
      iconBg: "bg-orange-50 text-orange-500",
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {statItems.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex justify-between items-start">
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
