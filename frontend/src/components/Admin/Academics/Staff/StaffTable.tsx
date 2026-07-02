"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
export type StatusType = "Active" | "On Leave";
export type StaffType = {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  joiningDate: string;
  contact: string;
  status: StatusType;
};

function StatusBadge({ status }: { status: StatusType }) {
  const styles: Record<StatusType, string> = {
    Active: "bg-green-100 text-green-700",
    "On Leave": "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

const HEADERS = [
  "Employee ID",
  "Name",
  "Role",
  "Department",
  "Joining Date",
  "Contact",
  "Status",
];

interface StaffTableProps {
  staffList: StaffType[];
  loading?: boolean;
  onEdit: (staff: StaffType) => void;
  onDelete: (staff: StaffType[]) => void;
}

export default function StaffTable({
  staffList,
  loading,
  onEdit,
  onDelete,
}: StaffTableProps) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const allSelected =
    staffList.length > 0 && selected.length === staffList.length;
  const toggleAll = () =>
    setSelected(allSelected ? [] : staffList.map((s) => s.id));
  const toggleOne = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );

  const selectedStaff = staffList.filter((s) => selected.includes(s.id));
  const canEdit = selectedStaff.length === 1; // edit only for single
  const canDelete = selectedStaff.length >= 1; // delete for one or more

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-4 py-4 text-left w-12 sticky top-0 bg-gray-50 z-10 border-b border-gray-200">
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
                className="px-4 py-4 text-left font-medium text-gray-900 sticky top-0 bg-gray-50 z-10 border-b border-gray-200"
              >
                {h}
              </th>
            ))}
            <th className="px-4 py-4 text-right sticky top-0 bg-gray-50 z-10 border-b border-gray-200">
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => canEdit && onEdit(selectedStaff[0])}
                  disabled={!canEdit}
                  title={
                    canEdit
                      ? "Edit staff"
                      : "Select exactly one staff member to edit"
                  }
                  className={`p-1.5 rounded-lg transition-colors ${
                    canEdit
                      ? "text-blue-600 hover:bg-blue-50 cursor-pointer"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  onClick={() => canDelete && onDelete(selectedStaff)}
                  disabled={!canDelete}
                  title={
                    canDelete
                      ? `Delete ${selectedStaff.length} staff member(s)`
                      : "Select at least one staff member to delete"
                  }
                  className={`p-1.5 rounded-lg transition-colors ${
                    canDelete
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
          ) : staffList.length > 0 ? (
            staffList.map((staff) => (
              <tr
                key={staff.id}
                className={`border-b border-gray-50 hover:bg-gray-50/50 ${
                  selected.includes(staff.id) ? "bg-blue-50/30" : ""
                }`}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(staff.id)}
                    onChange={() => toggleOne(staff.id)}
                    className="h-4 w-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-4 text-gray-600">{staff.employeeId}</td>
                <td
                  className="px-4 py-4 font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/admin/academics/staff/${staff.id}`)}
                >
                  {staff.name}
                </td>
                <td
                  className="px-4 py-4 text-blue-600 hover:underline cursor-pointer"
                  onClick={() => navigate(`/admin/academics/staff/${staff.id}`)}
                >
                  {staff.role}
                </td>
                <td className="px-4 py-4 text-gray-600">{staff.department}</td>
                <td className="px-4 py-4 text-gray-600">{staff.joiningDate}</td>
                <td className="px-4 py-4 text-gray-600">{staff.contact}</td>
                <td className="px-4 py-4">
                  <StatusBadge status={staff.status} />
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
                No staff members found matching your search or filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
