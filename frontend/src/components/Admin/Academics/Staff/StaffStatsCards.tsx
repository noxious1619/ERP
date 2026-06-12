export default function StaffStatsCards() {
  const stats = [
    { label: "Total Staff", value: 123 },
    { label: "New This Month", value: 5 },
    { label: "Active", value: 120 },
    { label: "On Leave", value: 3 },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}