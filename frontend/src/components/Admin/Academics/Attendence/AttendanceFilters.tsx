import type { Dispatch, SetStateAction } from "react"
import { Search, ChevronDown } from "lucide-react"

interface AttendanceFiltersProps {
  searchQuery: string
  setSearchQuery: (val: string) => void
  startDate: string
  setStartDate: (val: string) => void
  endDate: string
  setEndDate: (val: string) => void
  selectedClass: string
  setSelectedClass: (val: string) => void
  selectedSection: string
  setSelectedSection: (val: string) => void
}

export default function AttendanceFilters({
  searchQuery,
  setSearchQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedClass,
  setSelectedClass,
  selectedSection,
  setSelectedSection
}: AttendanceFiltersProps) {
  return (
    <div className="flex flex-col gap-5 bg-white border border-gray-200 rounded-xl p-5 shadow-3xs">
      
      {/* Top row: Page title details and search input */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold text-gray-950 tracking-tight">
            Attendance Overview
          </h1>
          <p className="text-[11px] text-gray-500 font-medium">
            Track and monitor student attendance
          </p>
        </div>

        {/* Search input field */}
        <div className="relative shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, employee ID, or phone..."
            className="w-full md:w-[360px] h-10 border border-gray-250 bg-white rounded-full pl-10 pr-4 text-xs font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] transition shadow-3xs"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Bottom Filter Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        
        {/* Left Side: Date Range Picker */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-900 tracking-wide">
            Date Range
          </span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-205 rounded-xl px-4 py-2 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] shadow-3xs cursor-pointer h-9 w-40"
              />
            </div>
            
            <span className="text-xs font-bold text-gray-500 px-1">
              to
            </span>

            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-205 rounded-xl px-4 py-2 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] shadow-3xs cursor-pointer h-9 w-40"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Class and Section selector */}
        <div className="flex flex-col gap-2 w-full lg:w-auto">
          <span className="text-xs font-bold text-gray-900 tracking-wide">
            Class and Section
          </span>
          <div className="flex items-center gap-3">
            {/* Select Class */}
            <div className="relative w-full lg:w-44">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full border border-gray-205 rounded-xl px-4 py-2 pr-10 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] shadow-3xs cursor-pointer appearance-none h-9"
              >
                <option value="">Select Class</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Select Section */}
            <div className="relative w-full lg:w-44">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full border border-gray-205 rounded-xl px-4 py-2 pr-10 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] shadow-3xs cursor-pointer appearance-none h-9"
              >
                <option value="">Select Section</option>
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
                <option value="Section C">Section C</option>
                <option value="Section D">Section D</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
