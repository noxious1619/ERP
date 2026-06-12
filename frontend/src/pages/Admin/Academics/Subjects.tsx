import AdminSidebar from "../../../components/Admin/sidebar"
import AdminNavbar from "../../../components/Admin/Navbar"
import SubjectsHeader from "../../../components/Admin/Academics/Subjects/SubjectsHeader"
import SubjectsStats from "../../../components/Admin/Academics/Subjects/SubjectsStats"
import SubjectsFilters from "../../../components/Admin/Academics/Subjects/SubjectsFilters"
import SubjectsTable from "../../../components/Admin/Academics/Subjects/SubjectsTable"
import SubjectsPagination from "../../../components/Admin/Academics/Subjects/SubjectsPagination"

export default function Subjects() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            {/* Header */}
            <SubjectsHeader />

            {/* Stats Cards */}
            <SubjectsStats />

            {/* Filters */}
            <SubjectsFilters />

            {/* Table */}
            <SubjectsTable />

            {/* Pagination */}
            <SubjectsPagination />
          </div>
        </main>
      </div>
    </div>
  )
}
