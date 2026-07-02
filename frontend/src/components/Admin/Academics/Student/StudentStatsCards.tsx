
interface StudentStatsCardsProps {
  stats: {
    total: number
    active: number
    inactive: number
    newThisMonth: number
  }
}

export default function StudentStatsCards({ stats }: StudentStatsCardsProps) {
  const statItems = [
    { label: "Total Students",  value: stats.total },
    { label: "New This Month",  value: stats.newThisMonth },
    { label: "Active",          value: stats.active },
    { label: "On Leave",        value: stats.inactive },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {statItems.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}