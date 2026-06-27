import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import AdminSidebar from "../../components/Admin/sidebar";
import AdminNavbar from "../../components/Admin/Navbar";
import TeacherProfileCard  from "../../components/Teacher/Profile/TeacherProfileCard"
import ProfessionalInfoCard from "../../components/Teacher/Profile/ProfessionalInfoCard"
import ContactCard         from "../../components/Teacher/Profile/Contactcard"
import type { TeacherProfileData } from "../../types/teacherprofile"

export default function AdminTeacherProfilePage() {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const [teacher,   setTeacher]   = useState<TeacherProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res  = await fetch(`http://localhost:5000/api/teachers/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        const json = await res.json()
        if (!json.success) throw new Error(json.message)
        setTeacher(json.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    if (id) fetchTeacher()
  }, [id])

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-auto p-6">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              {teacher && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {teacher.firstName} {teacher.lastName}
                </p>
              )}
            </div>
          </div>

          {error ? (
            <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center text-sm text-red-600">
              {error}
            </div>
          ) : (
            <div className="flex items-start gap-6">
              {/* Left — personal card */}
              <div className="shrink-0">
                <TeacherProfileCard
                  teacher={teacher}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
              {/* Right — professional + contact */}
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <ProfessionalInfoCard teacher={teacher} isLoading={isLoading} />
                <ContactCard         teacher={teacher} isLoading={isLoading} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}