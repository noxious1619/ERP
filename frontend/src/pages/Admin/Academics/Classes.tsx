import { useState } from "react"
import AdminSidebar from "../../../components/Admin/sidebar"
import AdminNavbar from "../../../components/Admin/Navbar"
import ClassesHeader from "../../../components/Admin/Academics/Classes & Sections/ClassesHeader"
import ClassesBanner from "../../../components/Admin/Academics/Classes & Sections/ClassesBanner"
import SectionCard from "../../../components/Admin/Academics/Classes & Sections/SectionCard"
import AddClassModal from "../../../components/Admin/Academics/Classes & Sections/AddClassModal"
import AddSectionModal from "../../../components/Admin/Academics/Classes & Sections/AddSectionModal"

export default function Classes() {
  const [isAddClassOpen, setIsAddClassOpen] = useState(false)
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false)

  const sections = [
    {
      sectionName: "Class 1A",
      teacherName: "Mrs. Rashi Verma",
      roomNumber: "101",
      strength: 50,
      maxStrength: 50
    },
    {
      sectionName: "Class 1B",
      teacherName: "Mrs. Riya Roy",
      roomNumber: "102",
      strength: 49,
      maxStrength: 50
    },
    {
      sectionName: "Class 1C",
      teacherName: "Mrs. Rashmi Chand",
      roomNumber: "103",
      strength: 45,
      maxStrength: 50
    }
  ]

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            {/* Header */}
            <ClassesHeader />

            {/* Banner */}
            <ClassesBanner 
              onAddClassClick={() => setIsAddClassOpen(true)}
              onAddSectionClick={() => setIsAddSectionOpen(true)}
            />

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {sections.map((section) => (
                <SectionCard
                  key={section.sectionName}
                  sectionName={section.sectionName}
                  teacherName={section.teacherName}
                  roomNumber={section.roomNumber}
                  strength={section.strength}
                  maxStrength={section.maxStrength}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddClassModal isOpen={isAddClassOpen} onClose={() => setIsAddClassOpen(false)} />
      <AddSectionModal isOpen={isAddSectionOpen} onClose={() => setIsAddSectionOpen(false)} />
    </div>
  )
}
