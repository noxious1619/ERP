import { Search } from "lucide-react"

interface SubjectsHeaderProps {
  search: string
  onSearchChange: (val: string) => void
  onAddSubjectClick?: () => void
  totalMatching: number
}

export default function SubjectsHeader({
  search,
  onSearchChange,
  onAddSubjectClick,
  totalMatching,
}: SubjectsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-sans">Subjects</h1>
        <p className="text-sm text-gray-500 mt-1">
          {totalMatching} {totalMatching === 1 ? "subject" : "subjects"} found
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, code..."
            className="h-10 w-[260px] rounded-xl border border-gray-200 bg-white pl-9 pr-4 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Add Subjects Button */}
        <button 
          onClick={onAddSubjectClick}
          className="bg-[#4285F4] hover:bg-blue-600 text-white text-sm font-semibold px-5 h-10 rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span>+</span> Add Subject
        </button>
      </div>
    </div>
  )
}
