import { ChevronDown, Settings } from "lucide-react"

interface TimetableHeaderProps {
  activeTab: "Teacher" | "Student"
  onTabChange: (tab: "Teacher" | "Student") => void
  classes: any[]
  sections: any[]
  teachers: any[]
  selectedClassId: string
  selectedSectionId: string
  selectedTeacherId: string
  onClassChange: (id: string) => void
  onSectionChange: (id: string) => void
  onTeacherChange: (id: string) => void
  onManagePeriodsClick?: () => void
}

export default function TimetableHeader({
  activeTab,
  onTabChange,
  classes,
  sections,
  teachers,
  selectedClassId,
  selectedSectionId,
  selectedTeacherId,
  onClassChange,
  onSectionChange,
  onTeacherChange,
  onManagePeriodsClick,
}: TimetableHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-sans">Timetable Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage class schedules</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Student Mode Filters */}
        {activeTab === "Student" && (
          <>
            {/* Class Dropdown */}
            <div className="relative">
              <select
                value={selectedClassId}
                onChange={(e) => onClassChange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-5 py-2.5 pr-10 text-sm font-semibold text-[#4285F4] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[150px] cursor-pointer"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4285F4] pointer-events-none" />
            </div>

            {/* Section Dropdown */}
            <div className="relative">
              <select
                value={selectedSectionId}
                onChange={(e) => onSectionChange(e.target.value)}
                disabled={!selectedClassId}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-5 py-2.5 pr-10 text-sm font-semibold text-[#4285F4] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[120px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Section</option>
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4285F4] pointer-events-none" />
            </div>

            {/* Manage Periods button */}
            {selectedSectionId && (
              <button
                type="button"
                onClick={onManagePeriodsClick}
                className="bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer flex items-center gap-2 transition-all"
              >
                <Settings className="w-4 h-4 text-[#4285F4]" />
                <span>Manage Periods</span>
              </button>
            )}
          </>
        )}

        {/* Teacher Mode Filters */}
        {activeTab === "Teacher" && (
          <div className="relative">
            <select
              value={selectedTeacherId}
              onChange={(e) => onTeacherChange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-5 py-2.5 pr-10 text-sm font-semibold text-[#4285F4] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-w-[200px] cursor-pointer"
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4285F4] pointer-events-none" />
          </div>
        )}

        {/* Segmented Toggle Control */}
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => onTabChange("Teacher")}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "Teacher"
                ? "bg-[#4285F4] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Teacher
          </button>
          <button
            onClick={() => onTabChange("Student")}
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
