"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Pencil } from "lucide-react"

export type StatusType = "Active" | "On Leave"

export type StaffType = {
  id: string
  name: string
  role: string
  subject: string
  assigned: string[]
  contact: string
  status: StatusType
}

function StatusBadge({ status }: { status: StatusType }) {

  const styles: Record<StatusType, string> = {
    Active:     "bg-green-100 text-green-700",
    "On Leave": "bg-yellow-100 text-yellow-700",
  }
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}

const HEADERS = ["Employee ID", "Name", "Role", "Subject", "Assigned", "Contact", "Status"]

interface StaffTableProps {
  staffList: StaffType[];
}

export default function StaffTable({ staffList }: StaffTableProps) {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string[]>([])

  const allSelected = staffList.length > 0 && selected.length === staffList.length
  const toggleAll   = () => setSelected(allSelected ? [] : staffList.map((s) => s.id))
  const toggleOne   = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-4 py-4 text-left w-12">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="h-4 w-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
              />
            </th>
            {HEADERS.map((h) => (
              <th key={h} className="px-4 py-4 text-left font-medium text-gray-900">
                {h}
              </th>
            ))}
            <th className="px-4 py-4 text-right">
              <Pencil className="ml-auto h-4 w-4 text-gray-700" />
            </th>
          </tr>
        </thead>

        <tbody>
          {staffList.length > 0 ? (
            staffList.map((staff) => (
              <tr key={staff.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(staff.id)}
                    onChange={() => toggleOne(staff.id)}
                    className="h-4 w-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-4 text-gray-600">{staff.id}</td>
                <td 
                  className="px-4 py-4 font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                  onClick={() => navigate("/admin/academics/staff/profile")}
                >
                  {staff.name}
                </td>
                <td 
                  className="px-4 py-4 text-blue-600 hover:underline cursor-pointer"
                  onClick={() => navigate("/admin/academics/staff/profile")}
                >
                  {staff.role}
                </td>
                <td className="px-4 py-4 text-gray-600">{staff.subject}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {staff.assigned.map((cls, idx) => (
                      <span
                        key={idx}
                        className={
                          cls !== "-"
                            ? "bg-blue-50 text-blue-500 px-2 py-1 rounded-md text-xs font-medium"
                            : "text-gray-600"
                        }
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-600">{staff.contact}</td>
                <td className="px-4 py-4">
                  <StatusBadge status={staff.status} />
                </td>
                <td className="px-4 py-4 text-right"></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-500">
                No staff members found matching your search or filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}