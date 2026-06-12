import AdminSidebar from "../../components/Admin/sidebar"
import AdminNavbar from "../../components/Admin/Navbar"
import StaffView from "../../components/Admin/Academics/Staff/StaffView"

export default function Staff() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-auto p-6">
          <StaffView />
        </main>
      </div>
    </div>
  )
}