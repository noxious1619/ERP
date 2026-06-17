import { useState } from "react"
import AdminSidebar from "../../../components/Admin/sidebar"
import AdminNavbar from "../../../components/Admin/Navbar"
import TimetableHeader from "../../../components/Admin/Academics/Timetable/TimetableHeader"
import TimetableGrid, { type TimetableBlock } from "../../../components/Admin/Academics/Timetable/TimetableGrid"
import EditPeriodModal from "../../../components/Admin/Academics/Timetable/EditPeriodModal"

export default function Timetable() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<TimetableBlock | null>(null)

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
            <TimetableHeader />

            {/* Grid */}
            <TimetableGrid onBlockClick={handleBlockClick} />
          </div>
        </main>
      </div>

      {/* Edit Modal Popup */}
      <EditPeriodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        block={selectedBlock}
      />
    </div>
  )
}
