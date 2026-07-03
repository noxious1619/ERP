import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import AdminSidebar from "../../../components/Admin/sidebar"
import AdminNavbar from "../../../components/Admin/Navbar"
import TimetableHeader from "../../../components/Admin/Academics/Timetable/TimetableHeader"
import TimetableGrid, { type TimetableBlock } from "../../../components/Admin/Academics/Timetable/TimetableGrid"
import EditPeriodModal from "../../../components/Admin/Academics/Timetable/EditPeriodModal"
import ManagePeriodsModal from "../../../components/Admin/Academics/Timetable/ManagePeriodsModal"
import { API_BASE_URL } from "../../../lib/api";

export default function Timetable() {
  const [activeTab, setActiveTab] = useState<"Teacher" | "Student">("Teacher")
  
  // Selection States
  const [selectedClassId, setSelectedClassId] = useState("")
  const [selectedSectionId, setSelectedSectionId] = useState("")
  const [selectedTeacherId, setSelectedTeacherId] = useState("")

  // Options Lists
  const [classes, setClasses] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])

  // Timetable Grid Data
  const [scheduleData, setScheduleData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<TimetableBlock | null>(null)

  // Manage Periods Modal State
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)

  // ─── Fetch Classes and Teachers ──────────────────────────────────────────
  useEffect(() => {
    const fetchInitialOptions = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers = { Authorization: `Bearer ${token}` }

        const [classesRes, teachersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/admin/subjects/classes`, { headers }),
          axios.get(`${API_BASE_URL}/api/admin/subjects/teachers`, { headers })
        ])

        if (classesRes.data.success) {
          setClasses(classesRes.data.data)
        }
        if (teachersRes.data.success) {
          setTeachers(teachersRes.data.data)
        }
      } catch (err) {
        console.error("Error loading initial options:", err)
      }
    }

    fetchInitialOptions()
  }, [])

  // ─── Fetch Sections on Class Change ───────────────────────────────────────
  const handleClassChange = async (classId: string) => {
    setSelectedClassId(classId)
    setSelectedSectionId("")
    setSections([])
    setScheduleData([])

    if (!classId) return

    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`${API_BASE_URL}/api/admin/subjects/classes/${classId}/sections`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data.success) {
        setSections(res.data.data)
      }
    } catch (err) {
      console.error("Error loading sections:", err)
    }
  }

  // ─── Fetch Timetable Data ────────────────────────────────────────────────
  const fetchTimetable = useCallback(async () => {
    const token = localStorage.getItem("token")
    const headers = { Authorization: `Bearer ${token}` }

    if (activeTab === "Student") {
      if (!selectedSectionId) {
        setScheduleData([])
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const res = await axios.get(`${API_BASE_URL}/api/timetable/section/${selectedSectionId}/weekly`, { headers })
        if (res.data.success) {
          setScheduleData(res.data.data)
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load weekly timetable.")
      } finally {
        setIsLoading(false)
      }
    } else {
      // Teacher tab
      if (!selectedTeacherId) {
        setScheduleData([])
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const res = await axios.get(`${API_BASE_URL}/api/timetable/teacher/${selectedTeacherId}/weekly`, { headers })
        if (res.data.success) {
          // Format keys to match standard Timetable fields
          const mapped = res.data.data.map((item: any) => ({
            id: item.id,
            day: item.day,
            period: item.period,
            startTime: item.time,
            endTime: item.endTime,
            isBreak: false,
            breakLabel: null,
            room: item.room,
            color: item.color,
            subject: { name: item.subject, code: item.code },
            displayTeacherName: "", // Not needed for teacher's own grid
            sectionLabel: item.sectionLabel || "Unassigned"
          }))
          setScheduleData(mapped)
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load teacher weekly timetable.")
      } finally {
        setIsLoading(false)
      }
    }
  }, [activeTab, selectedSectionId, selectedTeacherId])

  // ─── Extract Periods dynamically from timetable records ─────────────────
  const getPeriodsList = useCallback(() => {
    if (scheduleData.length === 0) {
      return [
        { period: 1, startTime: "08:00", endTime: "08:45" },
        { period: 2, startTime: "08:45", endTime: "09:30" },
        { period: 3, startTime: "09:30", endTime: "10:15" },
        { period: 4, startTime: "10:30", endTime: "11:15" },
        { period: 5, startTime: "11:15", endTime: "12:00" },
        { period: 6, startTime: "12:00", endTime: "12:45" },
        { period: 7, startTime: "01:15", endTime: "02:00" },
        { period: 8, startTime: "02:00", endTime: "02:45" }
      ]
    }

    const periodMap: Record<number, { period: number; startTime: string; endTime: string }> = {}
    scheduleData.forEach((item) => {
      const pNum = item.period
      const sTime = item.startTime || "08:00"
      const eTime = item.endTime || "08:45"
      periodMap[pNum] = {
        period: pNum,
        startTime: sTime,
        endTime: eTime,
      }
    })

    return Object.values(periodMap).sort((a, b) => a.period - b.period)
  }, [scheduleData])

  const periodsList = getPeriodsList()

  useEffect(() => {
    fetchTimetable()
  }, [fetchTimetable])

  const handleBlockClick = (block: TimetableBlock) => {
    setSelectedBlock(block)
    setIsModalOpen(true)
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            {/* Header */}
            <TimetableHeader
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab)
                setScheduleData([])
                setError(null)
              }}
              classes={classes}
              sections={sections}
              teachers={teachers}
              selectedClassId={selectedClassId}
              selectedSectionId={selectedSectionId}
              selectedTeacherId={selectedTeacherId}
              onClassChange={handleClassChange}
              onSectionChange={setSelectedSectionId}
              onTeacherChange={setSelectedTeacherId}
              onManagePeriodsClick={() => setIsManageModalOpen(true)}
            />

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-4 py-3 rounded-2xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
                <span className="flex-1 leading-snug">{error}</span>
              </div>
            )}

            {/* Grid */}
            {activeTab === "Student" && (!selectedClassId || !selectedSectionId) ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[300px]">
                <div className="text-center max-w-sm">
                  <div className="w-12 h-12 bg-blue-50 text-[#4285F4] rounded-full flex items-center justify-center mx-auto mb-4 font-sans text-xl font-bold">i</div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">Select Class and Section</h3>
                  <p className="text-xs text-gray-500">Please choose a class and section from the dropdown menus above to view and manage the student timetable.</p>
                </div>
              </div>
            ) : activeTab === "Teacher" && !selectedTeacherId ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-200 shadow-sm min-h-[300px]">
                <div className="text-center max-w-sm">
                  <div className="w-12 h-12 bg-blue-50 text-[#4285F4] rounded-full flex items-center justify-center mx-auto mb-4 font-sans text-xl font-bold">i</div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">Select Teacher</h3>
                  <p className="text-xs text-gray-500">Please choose a teacher from the dropdown menu above to view their weekly timetable schedule.</p>
                </div>
              </div>
            ) : (
              <TimetableGrid
                activeTab={activeTab}
                scheduleData={scheduleData}
                isLoading={isLoading}
                periods={periodsList}
                onBlockClick={handleBlockClick}
              />
            )}
          </div>
        </main>
      </div>

      {/* Edit Modal Popup */}
      <EditPeriodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false)
          fetchTimetable()
        }}
        block={selectedBlock}
        classId={selectedClassId}
        sectionId={selectedSectionId}
      />

      {/* Manage Periods Configuration Modal */}
      <ManagePeriodsModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        onSuccess={() => {
          setIsManageModalOpen(false)
          fetchTimetable()
        }}
        sectionId={selectedSectionId}
        currentPeriods={periodsList}
      />
    </div>
  )
}
