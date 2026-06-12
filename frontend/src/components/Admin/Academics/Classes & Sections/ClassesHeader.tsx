import { ChevronDown } from "lucide-react"

export default function ClassesHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-sans">Classes & Sections</h1>
        <p className="text-sm text-gray-500 mt-1">Manage classes and sections</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Year Dropdown */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 mb-1.5">Year</span>
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] cursor-pointer">
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Class Dropdown */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 mb-1.5">Class</span>
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] cursor-pointer">
              <option>Class 1</option>
              <option>Class 2</option>
              <option>Class 3</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
