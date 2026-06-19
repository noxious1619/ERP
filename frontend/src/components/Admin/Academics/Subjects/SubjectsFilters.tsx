import { ChevronDown } from "lucide-react"

export default function SubjectsFilters() {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-4 flex flex-wrap items-center gap-4 shadow-sm">
      {/* Type Dropdown */}
      <div className="relative">
        <select className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] cursor-pointer">
          <option>All Type</option>
          <option>Theory</option>
          <option>Lab</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Classes Dropdown */}
      <div className="relative">
        <select className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] cursor-pointer">
          <option>All Classes</option>
          <option>Class 1</option>
          <option>Class 2</option>
          <option>Class 3</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  )
}
