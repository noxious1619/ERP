import AdminSidebar from "../../../components/Admin/sidebar"
import AdminNavbar from "../../../components/Admin/Navbar"
import DashboardHeader from "../../../components/Admin/Dashboard/DashboardHeader"
import DashboardStatsGrid from "../../../components/Admin/Dashboard/DashboardStatsGrid"
import NoticeBoardCard from "../../../components/Admin/Dashboard/NoticeBoardCard"
import AttendanceSnapshotCard from "../../../components/Admin/Dashboard/AttendanceSnapshotCard"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col max-w-7xl mx-auto">
            {/* Header */}
            <DashboardHeader />

            {/* Metrics Grid */}
            <DashboardStatsGrid />

            {/* Bottom Section: Notices & Attendance Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2 items-stretch">
              <NoticeBoardCard />
              <AttendanceSnapshotCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
