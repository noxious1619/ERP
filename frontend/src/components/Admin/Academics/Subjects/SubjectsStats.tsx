interface SubjectsStatsProps {
  stats: {
    total: number
    theory: number
    lab: number
  }
}

export default function SubjectsStats({ stats }: SubjectsStatsProps) {
  const cards = [
    { label: "Total Subjects", value: stats.total },
    { label: "Theory Subjects", value: stats.theory },
    { label: "Lab Subjects", value: stats.lab }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <span className="text-gray-400 text-sm font-semibold tracking-wide block uppercase">{card.label}</span>
          <span className="text-3xl font-extrabold text-gray-900 block mt-2">{card.value}</span>
        </div>
      ))}
    </div>
  )
}
