import AdminSidebar from "../../../components/Admin/sidebar";
import AdminNavbar from "../../../components/Admin/Navbar";
import TeacherView from "../../../components/Admin/Academics/Teacher/TeacherView";

export default function AdminTeachersPage() {
  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-hidden p-6">
          <TeacherView />
        </main>
      </div>
    </div>
  );
}
