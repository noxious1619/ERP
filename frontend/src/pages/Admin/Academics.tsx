"use client"

import { useState } from "react"
import AdminSidebar from "../../components/Admin/sidebar"
import AdminNavbar from "../../components/Admin/Navbar"
import StudentsHeader from "../../components/Admin/Academics/StudentHeader"
import StudentFilters from "../../components/Admin/Academics/StudentFilters"
import StudentStatsCards from "../../components/Admin/Academics/StudentStatsCards"
import StudentTable from "../../components/Admin/Academics/StudentTable"
import StudentPagination from "../../components/Admin/Academics/StudentPagination"



export default function Academics() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col gap-5">
            <StudentsHeader totalCount={6} />
            <StudentStatsCards />
            <StudentFilters />
            <StudentTable />
            <StudentPagination total={6} perPage={6} />
          </div>
        </main>
      </div>
    </div>
  )
}