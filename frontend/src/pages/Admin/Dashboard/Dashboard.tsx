import { useState, useEffect } from "react"
import axios from "axios"
import AdminSidebar from "../../../components/Admin/sidebar"
import AdminNavbar from "../../../components/Admin/Navbar"
import DashboardHeader from "../../../components/Admin/Dashboard/DashboardHeader"
import DashboardStatsGrid from "../../../components/Admin/Dashboard/DashboardStatsGrid"
import NoticeBoardCard from "../../../components/Admin/Dashboard/NoticeBoardCard"
import AttendanceSnapshotCard from "../../../components/Admin/Dashboard/AttendanceSnapshotCard"

export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem("token")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const response = await axios.get("http://localhost:5000/api/admin/dashboard/stats", { headers })
        
        if (response.data.success) {
          console.log("Dashboard stats fetched successfully:", response.data.data);
          setData(response.data.data)
        } else {
          setError("Failed to load dashboard statistics.")
        }
      } catch (err: any) {
        console.error("Dashboard stats fetch error:", err)
        setError(err.response?.data?.message || "Error connecting to backend server.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col max-w-7xl mx-auto">
            {/* Header */}
            <DashboardHeader />

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4285F4]" />
                <span className="text-sm font-semibold text-gray-500">Loading admin metrics...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 text-sm font-semibold flex items-center justify-center gap-2 mt-4 shadow-sm">
                <span>⚠️ {error}</span>
              </div>
            ) : (
              <>
                {/* Metrics Grid */}
                <DashboardStatsGrid stats={data?.stats} />

                {/* Bottom Section: Notices & Attendance Trend */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2 items-stretch">
                  <NoticeBoardCard notices={data?.notices} />
                  <AttendanceSnapshotCard 
                    snapshot={data?.attendanceSnapshot} 
                    weeklyTrend={data?.weeklyTrend} 
                  />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
