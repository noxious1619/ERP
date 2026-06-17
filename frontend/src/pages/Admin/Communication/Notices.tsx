import { useState } from "react"
import AdminSidebar from "../../../components/Admin/sidebar"
import AdminNavbar from "../../../components/Admin/Navbar"
import NoticesHeader from "../../../components/Admin/Communication/Notices/NoticesHeader"
import NoticesTabs from "../../../components/Admin/Communication/Notices/NoticesTabs"
import NoticesTimeline from "../../../components/Admin/Communication/Notices/NoticesTimeline"
import NoticesCalendar from "../../../components/Admin/Communication/Notices/NoticesCalendar"
import CreateNoticeModal from "../../../components/Admin/Communication/Notices/CreateNoticeModal"

export default function Notices() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("ALL")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className={`flex-1 p-6 ${isModalOpen ? "overflow-hidden" : "overflow-auto"}`}>
          <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            {/* Header */}
            <NoticesHeader onAddNoticeClick={() => setIsModalOpen(true)} />

            {/* Tabs categories */}
            <NoticesTabs activeFilter={activeTab} onFilterChange={setActiveTab} />

            {/* Bottom Content Area: Timeline on left, Calendar on right */}
            <div className="flex flex-col lg:flex-row gap-8 items-start mt-2">
              <NoticesTimeline activeTab={activeTab} selectedDate={selectedDate} />
              <NoticesCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
            </div>
          </div>
        </main>
      </div>

      {/* Create Notice Modal */}
      <CreateNoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
