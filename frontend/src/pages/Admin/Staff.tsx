import AdminSidebar from "../../components/Admin/sidebar"
import AdminNavbar from "../../components/Admin/Navbar"
import StaffView from "../../components/Admin/Academics/Staff/StaffView"

export default function Staff() {
  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 flex flex-col overflow-hidden p-6">
          <StaffView />
        </main>
      </div>
    </div>
  )
}