import type { Student } from "../../../types/student"


interface StudentStatsCardsProps {
  students: Student[]
}

export default function StudentStatsCards({ students }: StudentStatsCardsProps) {
  const total      = students.length
  // "new this month" — students admitted in the current calendar month
  const now        = new Date()
  const newThisMonth = students.filter((s) => {
    // createdAt isn't in the type yet; fall back to 0
    return false
  }).length

  const stats = [
    { label: "Total Students",  value: total },
    { label: "New This Month",  value: newThisMonth },
    { label: "Active",          value: total },   // until status field lands
    { label: "On Leave",        value: 0 },
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