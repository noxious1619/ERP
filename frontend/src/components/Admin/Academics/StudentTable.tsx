"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import type { Student } from "../../../types/student"


interface StudentTableProps {
  students: Student[]
  loading: boolean
  error: string | null
}

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

type StatusType = "Active" | "On Leave" | "Inactive"

function StatusBadge({ status }: { status: StatusType }) {
  const styles: Record<StatusType, string> = {
    Active:     "bg-green-100 text-green-700",
    "On Leave": "bg-yellow-100 text-yellow-700",
    Inactive:   "bg-gray-100 text-gray-500",
  }
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status] ?? styles.Inactive}`}>
      {status}
    </span>
  )
}

type FeeStatusType = "Paid" | "Pending" | "Overdue"

function FeeStatusBadge({ status }: { status: FeeStatusType }) {
  const styles: Record<FeeStatusType, string> = {
    Paid:    "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Overdue: "bg-red-100 text-red-600",
  }
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status] ?? styles.Pending}`}>
      {status}
    </span>
  )
}

// ── skeleton row shown while loading ─────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      {Array.from({ length: 11 }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 rounded bg-gray-100 animate-pulse" style={{ width: i === 0 ? "1rem" : i === 1 ? "2.5rem" : "70%" }} />
        </td>
      ))}
    </tr>
  )
}

const HEADERS = ["Admission No", "Name", "Class", "Section", "Attendance", "Contact", "Status", "Fee Status"]

export default function StudentTable({ students, loading, error }: StudentTableProps) {
  const [selected, setSelected] = useState<string[]>([])

  const allSelected = students.length > 0 && selected.length === students.length
  const toggleAll   = () => setSelected(allSelected ? [] : students.map((s) => s.id))
  const toggleOne   = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])

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
            {HEADERS.map((h) => (
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
          {/* ── loading ── */}
          {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

          {/* ── error ── */}
          {!loading && error && (
            <tr>
              <td colSpan={11} className="px-4 py-10 text-center text-sm text-red-500">
                {error}
              </td>
            </tr>
          )}

          {/* ── empty ── */}
          {!loading && !error && students.length === 0 && (
            <tr>
              <td colSpan={11} className="px-4 py-10 text-center text-sm text-gray-400">
                No students found.
              </td>
            </tr>
          )}

          {/* ── data rows ── */}
          {!loading && !error && students.map((student, idx) => {
            const className  = student.section?.academicClass?.name ?? "—"
            const sectionName = student.section?.name ?? "—"
            const contact    = student.phoneNumber ?? "—"
            const photo      = student.profileImage ?? `https://i.pravatar.cc/40?u=${student.id}`
            const fullName   = `${student.firstName} ${student.lastName}`

            return (
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
                <td className="px-4 py-4 text-gray-700">{student.admissionNumber}</td>
                <td className="px-4 py-4 font-medium text-gray-900">{fullName}</td>
                <td className="px-4 py-4 text-gray-600">{className}</td>
                <td className="px-4 py-4 text-gray-600">{sectionName}</td>
                <td className="px-4 py-4">
                  {/* attendance not in schema yet — placeholder */}
                  <AttendanceBadge value={0} />
                </td>
                <td className="px-4 py-4 text-gray-600">{contact}</td>
                <td className="px-4 py-4">
                  {/* status not in schema yet — default Active */}
                  <StatusBadge status="Active" />
                </td>
                <td className="px-4 py-4">
                  {/* feeStatus not in schema yet — placeholder */}
                  <FeeStatusBadge status="Pending" />
                </td>
                <td className="px-4 py-4" />
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}