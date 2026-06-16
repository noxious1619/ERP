import { Users, UserCheck, CheckCircle2, UserPlus, BookOpen, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

export default function DashboardStatsGrid() {
  const stats = [
    {
      label: "Total Students",
      value: "1,248",
      trend: "+12.5%",
      trendType: "up",
      icon: Users,
      iconBg: "bg-blue-50 text-blue-500",
    },
    {
      label: "Total Staff",
      value: "84",
      trend: "+2 this month",
      trendType: "up",
      icon: UserCheck,
      iconBg: "bg-green-50 text-green-500",
    },
    {
      label: "Student Attendance Today",
      value: "94%",
      trend: "+2.1% from yesterday",
      trendType: "up",
      icon: CheckCircle2,
      iconBg: "bg-green-50 text-green-500",
    },
    {
      label: "New Admissions",
      value: "45",
      trend: "+15 this week",
      trendType: "up",
      icon: UserPlus,
      iconBg: "bg-blue-50 text-blue-500",
    },
    {
      label: "Active Classes",
      value: "32",
      trend: "All sections covered",
      trendType: "neutral",
      icon: BookOpen,
      iconBg: "bg-blue-50 text-blue-500",
    },
    {
      label: "Pending Fees",
      value: "₹2.4L",
      trend: "-8.2% from last week",
      trendType: "down",
      icon: DollarSign,
      iconBg: "bg-orange-50 text-orange-500",
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {stats.map((stat, idx) => {
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
