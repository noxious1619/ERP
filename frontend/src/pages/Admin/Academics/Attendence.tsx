import { useState } from "react"
import AdminSidebar from "../../../components/Admin/sidebar"
import AdminNavbar from "../../../components/Admin/Navbar"
import AttendanceFilters from "../../../components/Admin/Academics/Attendence/AttendanceFilters"
import AttendanceStatsGrid from "../../../components/Admin/Academics/Attendence/AttendanceStatsGrid"
import DailyAttendanceMatrix from "../../../components/Admin/Academics/Attendence/DailyAttendanceMatrix"
import AttendanceAnalyticsSidebar from "../../../components/Admin/Academics/Attendence/AttendanceAnalyticsSidebar"

export default function AdminAttendance() {
  const [searchQuery, setSearchQuery] = useState("")
  const [startDate, setStartDate] = useState("2026-06-08")
  const [endDate, setEndDate] = useState("2026-06-12")
  const [selectedClass, setSelectedClass] = useState("Class 10")
  const [selectedSection, setSelectedSection] = useState("Section A")

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Sidebar navigation */}
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <AdminNavbar />

        {/* Main Work Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
            
            {/* Attendance Filters Dashboard Header */}
            <AttendanceFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
            />

            {/* Attendance Metrics Cards */}
            <AttendanceStatsGrid 
              attendanceRate="78.0%"
              totalAbsent={22}
              lateEntries={5}
              defaulters={3}
            />

            {/* Main Content Grid: Daily Matrix & Sidebar Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Daily Matrix table list */}
              <div className="lg:col-span-2">
                <DailyAttendanceMatrix />
              </div>

              {/* Analytics sidebar charts */}
              <div className="lg:col-span-1">
                <AttendanceAnalyticsSidebar />
              </div>

            </div>

          </div>
        </main>
      </div>

    </div>
  )
}
