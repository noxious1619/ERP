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
    },
    {
      sectionName: "Class 2A",
      teacherName: "Mr. Amit Sharma",
      roomNumber: "201",
      strength: 48,
      maxStrength: 50
    },
    {
      sectionName: "Class 2B",
      teacherName: "Mrs. Priya Patel",
      roomNumber: "202",
      strength: 45,
      maxStrength: 50
    },
    {
      sectionName: "Class 2C",
      teacherName: "Mr. Vikram Rao",
      roomNumber: "203",
      strength: 50,
      maxStrength: 50
    },
    {
      sectionName: "Class 3A",
      teacherName: "Ms. Neha Singh",
      roomNumber: "301",
      strength: 42,
      maxStrength: 50
    },
    {
      sectionName: "Class 3B",
      teacherName: "Mr. Rajesh Gupta",
      roomNumber: "302",
      strength: 47,
      maxStrength: 50
    },
    {
      sectionName: "Class 3C",
      teacherName: "Ms. Pooja Verma",
      roomNumber: "303",
      strength: 49,
      maxStrength: 50
    }
  ]

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 flex flex-col overflow-hidden p-6">
          <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full h-full">
            {/* Header */}
            <ClassesHeader />

            {/* Banner */}
            <ClassesBanner 
              onAddClassClick={() => setIsAddClassOpen(true)}
              onAddSectionClick={() => setIsAddSectionOpen(true)}
            />

            {/* Cards Grid Container (Scrollable) */}
            <div className="flex-1 overflow-y-auto min-h-0 pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 pb-4">
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
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddClassModal isOpen={isAddClassOpen} onClose={() => setIsAddClassOpen(false)} />
      <AddSectionModal isOpen={isAddSectionOpen} onClose={() => setIsAddSectionOpen(false)} />
    </div>
  )
}
