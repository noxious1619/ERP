"use client"

import { useState } from "react"
import AdminSidebar from "../../components/Admin/sidebar"
import AdminNavbar from "../../components/Admin/Navbar"
import StudentsView from "../../components/Admin/Academics/StudentsView"


export default function Academics() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <AdminSidebar
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-auto p-6">
          <StudentsView />
        </main>
      </div>
    </div>
  )
}