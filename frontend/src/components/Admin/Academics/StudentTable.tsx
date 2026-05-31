"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"

export interface Student {
  id: string
  admissionNo: string
  name: string
  photo: string
  class: number
  section: string
  attendance: number
  contact: string
  status: "Active" | "On Leave" | "Inactive"
  feeStatus: "Paid" | "Pending" | "Overdue"
}

const students: Student[] = [
  {
    id: "1", admissionNo: "ADM001", name: "Rahul Sharma",
    photo: "https://i.pravatar.cc/40?img=11",
    class: 10, section: "A", attendance: 95,
    contact: "98765 43210", status: "Active", feeStatus: "Paid",
  },
  {
    id: "2", admissionNo: "ADM002", name: "Priya Patel",
    photo: "https://i.pravatar.cc/40?img=5",
    class: 9, section: "B", attendance: 88,
    contact: "88755 87241", status: "Active", feeStatus: "Pending",
  },
  {
    id: "3", admissionNo: "ADM003", name: "Arjun Kumar",
    photo: "https://i.pravatar.cc/40?img=12",
    class: 8, section: "A", attendance: 68,
    contact: "82765 83254", status: "Active", feeStatus: "Overdue",
  },
  {
    id: "4", admissionNo: "ADM004", name: "Rohan Verma",
    photo: "https://i.pravatar.cc/40?img=13",
    class: 11, section: "C", attendance: 98,
    contact: "76765 03202", status: "Active", feeStatus: "Paid",
  },
  {
    id: "5", admissionNo: "ADM005", name: "Ravi Roy",
    photo: "https://i.pravatar.cc/40?img=15",
    class: 10, section: "B", attendance: 58,
    contact: "62765 83234", status: "Active", feeStatus: "Overdue",
  },
  {
    id: "6", admissionNo: "ADM006", name: "Rishab Singh",
    photo: "https://i.pravatar.cc/40?img=17",
    class: 10, section: "A", attendance: 93,
    contact: "96765 07252", status: "On Leave", feeStatus: "Paid",
  },
]

function AttendanceBadge({ value }: { value: number }) {
  const color =
    value >= 90 ? "bg-green-500" : value >= 80 ? "bg-yellow-400" : "bg-red-500"
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-6 rounded-sm ${color}`} />
      <span className="text-sm text-gray-700">{value}%</span>
    </div>
  )
}

function StatusBadge({ status }: { status: Student["status"] }) {
  const styles: Record<Student["status"], string> = {
    Active:     "bg-green-100 text-green-700",
    "On Leave": "bg-yellow-100 text-yellow-700",
    Inactive:   "bg-gray-100 text-gray-500",
  }
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}

function FeeStatusBadge({ status }: { status: Student["feeStatus"] }) {
  const styles: Record<Student["feeStatus"], string> = {
    Paid:    "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Overdue: "bg-red-100 text-red-600",
  }
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}

export default function StudentTable() {
  const [selected, setSelected] = useState<string[]>([])

  const allSelected = selected.length === students.length
  const toggleAll = () => setSelected(allSelected ? [] : students.map((s) => s.id))
  const toggleOne = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-4 py-3 text-left w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="h-4 w-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
              />
            </th>
            {["Admission No","Name","Class","Section","Attendance","Contact","Status","Fee Status"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                {h}
              </th>
            ))}
            <th className="px-4 py-3 text-right">
              <Pencil className="ml-auto h-4 w-4 text-gray-400" />
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, idx) => (
            <tr
              key={student.id}
              className={[
                "transition-colors hover:bg-gray-50",
                idx < students.length - 1 ? "border-b border-gray-50" : "",
              ].join(" ")}
            >
              <td className="px-4 py-4">
                <input
                  type="checkbox"
                  checked={selected.includes(student.id)}
                  onChange={() => toggleOne(student.id)}
                  className="h-4 w-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                />
              </td>
              <td className="px-4 py-4 text-gray-700">{student.admissionNo}</td>
              <td className="px-4 py-4 font-medium text-gray-900">{student.name}</td>
              <td className="px-4 py-4 text-gray-600">{student.class}</td>
              <td className="px-4 py-4 text-gray-600">{student.section}</td>
              <td className="px-4 py-4">
                <AttendanceBadge value={student.attendance} />
              </td>
              <td className="px-4 py-4 text-gray-600">{student.contact}</td>
              <td className="px-4 py-4">
                <StatusBadge status={student.status} />
              </td>
              <td className="px-4 py-4">
                <FeeStatusBadge status={student.feeStatus} />
              </td>
              <td className="px-4 py-4" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}