import { ChevronDown } from "lucide-react"

interface SubjectsFiltersProps {
  selectedClass: string
  onClassChange: (val: string) => void
  selectedType: string
  onTypeChange: (val: string) => void
  classes: any[]
}

export default function SubjectsFilters({
  selectedClass,
  onClassChange,
  selectedType,
  onTypeChange,
  classes,
}: SubjectsFiltersProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-4 flex flex-wrap items-center gap-4 shadow-sm">
      {/* Type Dropdown */}
      <div className="relative">
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] cursor-pointer"
        >
          <option value="All Type">All Type</option>
          <option value="Theory">Theory</option>
          <option value="Lab">Lab</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Classes Dropdown */}
      <div className="relative">
        <select
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] cursor-pointer"
        >
          <option value="All Classes">All Classes</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
}
