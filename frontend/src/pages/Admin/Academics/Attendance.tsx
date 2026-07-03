import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import AdminSidebar from "../../../components/Admin/sidebar"
import AdminNavbar from "../../../components/Admin/Navbar"
import AttendanceFilters from "../../../components/Admin/Academics/Attendance/AttendanceFilters"
import AttendanceStatsGrid from "../../../components/Admin/Academics/Attendance/AttendanceStatsGrid"
import DailyAttendanceMatrix from "../../../components/Admin/Academics/Attendance/DailyAttendanceMatrix"
import AttendanceAnalyticsSidebar from "../../../components/Admin/Academics/Attendance/AttendanceAnalyticsSidebar"
import useAuth from "../../../hooks/useAuth"
import { API_BASE_URL } from "../../../lib/api";
const PAGE_SIZE = 6

export default function AdminAttendance() {
  const navigate = useNavigate()
  const { role } = useAuth()

  // Route security: only ADMIN and SUPER_ADMIN have access
  useEffect(() => {
    if (role && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      navigate("/")
    }
  }, [role, navigate])

  const [searchQuery, setSearchQuery] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [page, setPage] = useState(1)

  // Filters options lists
  const [classes, setClasses] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])

  // Records and Stats state
  const [rows, setRows] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [validationWarning, setValidationWarning] = useState<string | null>(null)

  const [stats, setStats] = useState({
    attendanceRate: "100.0%",
    totalAbsent: 0,
    lateEntries: 0,
    defaulters: 0,
  })

  // Dynamic charts data state
  const [chartsData, setChartsData] = useState<any>(null)

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`${API_BASE_URL}/api/admin/subjects/classes`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.data.success) {
          setClasses(res.data.data)
        }
      } catch (err) {
        console.error("Error fetching classes list:", err)
      }
    }
    fetchClasses()
  }, [])

  // Fetch sections when class filter changes
  useEffect(() => {
    if (!selectedClass) {
      setSections([])
      setSelectedSection("")
      return
    }

    const fetchSections = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`${API_BASE_URL}/api/admin/subjects/classes/${selectedClass}/sections`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.data.success) {
          setSections(res.data.data)
        }
      } catch (err) {
        console.error("Error fetching sections list:", err)
      }
    }
    fetchSections()
  }, [selectedClass])

  // Fetch summaries and stats from backend
  const fetchSummary = async () => {
    // Date Range Validation Check
    const hasStart = !!startDate
    const hasEnd = !!endDate

    if ((hasStart && !hasEnd) || (!hasStart && hasEnd)) {
      setValidationWarning("Please enter both start and end dates (enter the other date first to view filtered records).")
      setRows([])
      setPagination(null)
      return
    }

    setValidationWarning(null)
    setIsLoading(true)
    setErrorMsg(null)

    try {
      const token = localStorage.getItem("token")
      const params = new URLSearchParams()
      
      if (selectedClass) params.set("classId", selectedClass)
      if (selectedSection) params.set("sectionId", selectedSection)
      if (startDate) params.set("startDate", startDate)
      if (endDate) params.set("endDate", endDate)
      if (searchQuery) params.set("search", searchQuery)
      
      params.set("page", page.toString())
      params.set("limit", PAGE_SIZE.toString())

      const res = await axios.get(`${API_BASE_URL}/api/attendance/admin-summary?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.data.success) {
        setRows(res.data.data)
        setPagination(res.data.pagination)
        if (res.data.stats) {
          setStats(res.data.stats)
        }
        if (res.data.charts) {
          setChartsData(res.data.charts)
        }
      } else {
        setErrorMsg("Failed to load attendance summaries.")
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || "Error loading summaries.")
    } finally {
      setIsLoading(false)
    }
  }

  // Trigger fetch when any search/filters/pages changes
  useEffect(() => {
    fetchSummary()
  }, [searchQuery, startDate, endDate, selectedClass, selectedSection, page])

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Sidebar navigation */}
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <AdminNavbar />

        {/* Main Work Area */}
        <main className="flex-1 flex flex-col overflow-hidden p-6">
          <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full h-full">
            
            {/* Attendance Filters Dashboard Header */}
            <AttendanceFilters
              searchQuery={searchQuery}
              setSearchQuery={(val) => {
                setSearchQuery(val)
                setPage(1)
              }}
              startDate={startDate}
              setStartDate={(val) => {
                setStartDate(val)
                setPage(1)
              }}
              endDate={endDate}
              setEndDate={(val) => {
                setEndDate(val)
                setPage(1)
              }}
              selectedClass={selectedClass}
              setSelectedClass={(val) => {
                setSelectedClass(val)
                setSelectedSection("")
                setPage(1)
              }}
              selectedSection={selectedSection}
              setSelectedSection={(val) => {
                setSelectedSection(val)
                setPage(1)
              }}
              classes={classes}
              sections={sections}
            />

            {/* Validation warning block */}
            {validationWarning && (
              <div className="bg-amber-50 border border-amber-100 text-amber-600 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0"></span>
                <span>{validationWarning}</span>
              </div>
            )}

            {/* Attendance Metrics Cards */}
            <AttendanceStatsGrid 
              attendanceRate={stats.attendanceRate}
              totalAbsent={stats.totalAbsent}
              lateEntries={stats.lateEntries}
              defaulters={stats.defaulters}
            />

            {/* Main Content Grid: Daily Matrix & Sidebar Analytics (Scrollable) */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
                
                {/* Daily Matrix table list */}
                <div className="lg:col-span-2">
                  <DailyAttendanceMatrix 
                    rows={rows}
                    isLoading={isLoading}
                    error={errorMsg}
                    page={page}
                    totalPages={pagination?.totalPages ?? 1}
                    totalCount={pagination?.total ?? 0}
                    onPageChange={(p) => setPage(p)}
                  />
                </div>

                {/* Analytics sidebar charts */}
                <div className="lg:col-span-1">
                  <AttendanceAnalyticsSidebar 
                    chartsData={chartsData} 
                    isLoading={isLoading} 
                  />
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>

    </div>
  )
}
