import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import AdminSidebar from "../../../components/Admin/sidebar"
import AdminNavbar from "../../../components/Admin/Navbar"
import NoticesHeader from "../../../components/Admin/Communication/Notices/NoticesHeader"
import NoticesTabs from "../../../components/Admin/Communication/Notices/NoticesTabs"
import NoticesTimeline from "../../../components/Admin/Communication/Notices/NoticesTimeline"
import NoticesCalendar from "../../../components/Admin/Communication/Notices/NoticesCalendar"
import CreateNoticeModal from "../../../components/Admin/Communication/Notices/CreateNoticeModal"
import type { Notice } from "../../../types/notice"

const API_BASE = "http://localhost:5000"

export default function Notices() {
  const [isModalOpen, setIsModalOpen]   = useState(false)
  const [activeTab, setActiveTab]       = useState("ALL")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const [notices, setNotices]   = useState<Notice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState<string | null>(null)

  // ── Fetch notices from admin API ─────────────────────────────────────────
  const fetchNotices = useCallback(async (category: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const token = localStorage.getItem("token")
      const params = category !== "ALL" ? { category } : {}
      const res = await axios.get(`${API_BASE}/api/admin/notices`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      if (res.data.success) {
        setNotices(res.data.data)
      } else {
        setError("Failed to fetch notices.")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error connecting to notice server.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotices(activeTab)
  }, [activeTab, fetchNotices])

  // ── Delete a notice ──────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this notice? This action cannot be undone.")) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${API_BASE}/api/admin/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      // Optimistic update — remove from local state immediately
      setNotices((prev) => prev.filter((n) => n.id !== id))
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete notice.")
    }
  }

  // ── Derive notice dates for calendar dots ────────────────────────────────
  const noticeDates = notices.map((n) => {
    const d = new Date(n.createdAt)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  })
  // Deduplicate
  const uniqueNoticeDates = [...new Set(noticeDates)]

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className={`flex-1 p-6 ${isModalOpen ? "overflow-hidden" : "overflow-auto"}`}>
          <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            {/* Header */}
            <NoticesHeader onAddNoticeClick={() => setIsModalOpen(true)} />

            {/* Category tabs */}
            <NoticesTabs activeFilter={activeTab} onFilterChange={setActiveTab} />

            {/* Content area */}
            <div className="flex flex-col lg:flex-row gap-8 items-start mt-2">
              {/* Timeline — real data */}
              <NoticesTimeline
                notices={notices}
                isLoading={isLoading}
                error={error}
                selectedDate={selectedDate}
                onDelete={handleDelete}
              />

              {/* Calendar — real notice dates as dots */}
              <div className="shrink-0 w-full lg:max-w-[320px]">
                <NoticesCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  noticeDates={uniqueNoticeDates}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Notice Modal */}
      <CreateNoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchNotices(activeTab)}
      />
    </div>
  )
}
