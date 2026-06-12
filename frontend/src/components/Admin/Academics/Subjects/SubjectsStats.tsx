export default function SubjectsStats() {
  const cards = [
    { label: "Total Subjects", value: 6 },
    { label: "Theory Subjects", value: 4 },
    { label: "Lab Subjects", value: 2 },
    { label: "Active Teachers", value: 6 }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <span className="text-gray-400 text-sm font-semibold tracking-wide block uppercase">{card.label}</span>
          <span className="text-3xl font-extrabold text-gray-900 block mt-2">{card.value}</span>
        </div>
      ))}
    </div>
  )
}
