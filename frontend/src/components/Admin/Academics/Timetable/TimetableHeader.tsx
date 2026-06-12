import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function TimetableHeader() {
  const [activeTab, setActiveTab] = useState<"Teacher" | "Student">("Teacher")

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-sans">Timetable Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage class schedules</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Class Dropdown */}
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-200 rounded-xl px-5 py-2.5 pr-10 text-sm font-semibold text-[#4285F4] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] cursor-pointer">
            <option>Class 10th</option>
            <option>Class 9th</option>
            <option>Class 8th</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4285F4] pointer-events-none" />
        </div>

        {/* Segmented Toggle Control */}
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("Teacher")}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "Teacher"
                ? "bg-[#4285F4] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Teacher
          </button>
          <button
            onClick={() => setActiveTab("Student")}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "Student"
                ? "bg-[#4285F4] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Student
          </button>
        </div>
      </div>
    </div>
  )
}
