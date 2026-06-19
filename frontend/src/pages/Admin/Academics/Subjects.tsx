import { useState } from "react"
import AdminSidebar from "../../../components/Admin/sidebar"
import AdminNavbar from "../../../components/Admin/Navbar"
import SubjectsHeader from "../../../components/Admin/Academics/Subjects/SubjectsHeader"
import SubjectsStats from "../../../components/Admin/Academics/Subjects/SubjectsStats"
import SubjectsFilters from "../../../components/Admin/Academics/Subjects/SubjectsFilters"
import SubjectsTable from "../../../components/Admin/Academics/Subjects/SubjectsTable"
import SubjectsPagination from "../../../components/Admin/Academics/Subjects/SubjectsPagination"
import AddSubjectModal from "../../../components/Admin/Academics/Subjects/AddSubjectModal"

export default function Subjects() {
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false)

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 flex flex-col overflow-hidden p-6">
          <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full h-full">
            {/* Header */}
            <SubjectsHeader onAddSubjectClick={() => setIsAddSubjectOpen(true)} />

            {/* Stats Cards */}
            <SubjectsStats />

            {/* Filters */}
            <SubjectsFilters />

            {/* Table Container (Scrollable) */}
            <div className={`flex-1 min-h-0 ${isAddSubjectOpen ? "overflow-hidden" : "overflow-y-auto"}`}>
              <SubjectsTable />
            </div>

            {/* Pagination */}
            <SubjectsPagination />
          </div>
        </main>
      </div>

      {/* Add Subject Modal */}
      <AddSubjectModal isOpen={isAddSubjectOpen} onClose={() => setIsAddSubjectOpen(false)} />
    </div>
  )
}
