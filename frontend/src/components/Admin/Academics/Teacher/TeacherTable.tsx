"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

export type TeacherRowType = {
  id: string;
  employeeId: string;
  name: string;
  subject: string;
  sections: string[];
  qualification: string;
  contact: string;
  status: string;
};

type StatusType = "Active" | "On Leave";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-green-100 text-green-700",
    "On Leave": "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}

const HEADERS = [
  "Employee ID",
  "Name",
  "Subject",
  "Sections",
  "Qualification",
  "Contact",
  "Status",
];

interface TeacherTableProps {
  teacherList: TeacherRowType[];
  loading?: boolean;
  onEdit: (teacher: TeacherRowType) => void;
  onDelete: (teacher: TeacherRowType) => void;
}

export default function TeacherTable({
  teacherList,
  loading,
  onEdit,
  onDelete,
}: TeacherTableProps) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const allSelected =
    teacherList.length > 0 && selected.length === teacherList.length;
  const toggleAll = () =>
    setSelected(allSelected ? [] : teacherList.map((t) => t.id));
  const toggleOne = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );

  const selectedTeachers = teacherList.filter((t) => selected.includes(t.id));
  const canAct = selectedTeachers.length === 1;

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
              <th
                key={h}
                className="px-4 py-4 text-left font-medium text-gray-900"
              >
                {h}
              </th>
            ))}
            <th className="px-4 py-4 text-right">
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => canAct && onEdit(selectedTeachers[0])}
                  disabled={!canAct}
                  title={canAct ? "Edit teacher" : "Select one teacher to edit"}
                  className={`p-1.5 rounded-lg transition-colors ${
                    canAct
                      ? "text-blue-600 hover:bg-blue-50 cursor-pointer"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => canAct && onDelete(selectedTeachers[0])}
                  disabled={!canAct}
                  title={
                    canAct ? "Delete teacher" : "Select one teacher to delete"
                  }
                  className={`p-1.5 rounded-lg transition-colors ${
                    canAct
                      ? "text-red-500 hover:bg-red-50 cursor-pointer"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-gray-50">
                {[...Array(9)].map((_, j) => (
                  <td key={j} className="px-4 py-4">
                    <div
                      className="h-4 rounded bg-gray-200 animate-pulse"
                      style={{ width: j === 0 ? 16 : "80%" }}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : teacherList.length > 0 ? (
            teacherList.map((teacher) => (
              <tr
                key={teacher.id}
                className={`border-b border-gray-50 hover:bg-gray-50/50 ${
                  selected.includes(teacher.id) ? "bg-blue-50/30" : ""
                }`}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(teacher.id)}
                    onChange={() => toggleOne(teacher.id)}
                    className="h-4 w-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-4 text-gray-600">
                  {teacher.employeeId}
                </td>
                <td
                  className="px-4 py-4 font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                  onClick={() =>
                    navigate(`/admin/academics/teachers/${teacher.id}`)
                  }
                >
                  {teacher.name}
                </td>
                <td className="px-4 py-4 text-gray-600">{teacher.subject}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.sections.map((s, idx) => (
                      <span
                        key={idx}
                        className={
                          s !== "-"
                            ? "bg-blue-50 text-blue-500 px-2 py-1 rounded-md text-xs font-medium"
                            : "text-gray-600"
                        }
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-600">
                  {teacher.qualification}
                </td>
                <td className="px-4 py-4 text-gray-600">{teacher.contact}</td>
                <td className="px-4 py-4">
                  <StatusBadge status={teacher.status} />
                </td>
                <td className="px-4 py-4" />
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={9}
                className="px-4 py-8 text-center text-sm text-gray-500"
              >
                No teachers found matching your search or filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
