import { Pencil, Trash2 } from "lucide-react";
import type { Student } from "../../../../types/student";

interface StudentTableProps {
  students: Student[];
  selectedIds: string[];
  onSelectRow: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  isLoading: boolean;
  error: string | null;
}

type StatusType = "Active" | "Inactive";

function StatusBadge({ status }: { status: StatusType }) {
  const styles: Record<StatusType, string> = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status] ?? styles.Inactive}`}
    >
      {status}
    </span>
  );
}

const HEADERS = [
  "Admission No",
  "Name",
  "Class",
  "Section",
  "Contact",
  "Status",
];

export default function StudentTable({
  students,
  selectedIds,
  onSelectRow,
  onSelectAll,
  onEditClick,
  onDeleteClick,
  isLoading,
  error,
}: StudentTableProps) {
  const selectedCount = selectedIds.length;
  const allSelectedOnPage =
    students.length > 0 && students.every((s) => selectedIds.includes(s.id));

  return (
    <div className="overflow-auto h-full rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-[900px] text-sm ">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-4 text-left w-12 sticky top-0 bg-gray-50 z-10 border-b border-gray-200">
              <input
                type="checkbox"
                checked={allSelectedOnPage}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
              />
            </th>
            {HEADERS.map((h) => (
              <th
                key={h}
                className="px-4 py-4 text-left font-semibold text-gray-900 sticky top-0 bg-gray-50 z-10 border-b border-gray-200"
              >
                {h}
              </th>
            ))}
            <th className="px-6 py-4 text-right sticky top-0 bg-gray-50 z-10 border-b border-gray-200">
              <div className="flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={onEditClick}
                  disabled={selectedCount !== 1}
                  className={`p-1.5 rounded-lg transition-all ${
                    selectedCount === 1
                      ? "text-[#4285F4] hover:bg-blue-50 cursor-pointer"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                  title="Edit selected student"
                >
                  <Pencil className="h-4.5 w-4.5 stroke-[2.2]" />
                </button>
                <button
                  type="button"
                  onClick={onDeleteClick}
                  disabled={selectedCount === 0}
                  className={`p-1.5 rounded-lg transition-all ${
                    selectedCount >= 1
                      ? "text-[#4285F4] hover:bg-blue-50 cursor-pointer"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                  title="Delete selected students"
                >
                  <Trash2 className="h-4.5 w-4.5 stroke-[2.2]" />
                </button>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {/* ── loading ── */}
          {isLoading && (
            <tr>
              <td
                colSpan={8}
                className="px-6 py-12 text-center text-gray-500 font-medium"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                  Loading students...
                </div>
              </td>
            </tr>
          )}

          {/* ── error ── */}
          {!isLoading && error && (
            <tr>
              <td
                colSpan={8}
                className="px-6 py-12 text-center text-sm text-red-500 font-medium"
              >
                {error}
              </td>
            </tr>
          )}

          {/* ── empty ── */}
          {!isLoading && !error && students.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="px-6 py-12 text-center text-sm text-gray-400 font-medium"
              >
                No students found matching your filters.
              </td>
            </tr>
          )}

          {/* ── data rows ── */}
          {!isLoading &&
            !error &&
            students.map((student, idx) => {
              const className = student.section?.academicClass?.name ?? "—";
              const sectionName = student.section?.name ?? "—";
              const contact = student.phoneNumber ?? "—";
              const fullName = `${student.firstName} ${student.lastName}`;
              const isChecked = selectedIds.includes(student.id);

              return (
                <tr
                  key={student.id}
                  className={`hover:bg-gray-50/50 transition-colors ${
                    isChecked ? "bg-blue-50/20" : ""
                  } ${idx < students.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <td className="px-6">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        onSelectRow(student.id, e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-4  text-gray-700">
                    {student.admissionNumber}
                  </td>
                  <td className="px-4 py-5 font-semibold text-gray-900">
                    {fullName}
                  </td>
                  <td className="px-4 py-5 text-gray-600">{className}</td>
                  <td className="px-4 py-5 text-gray-600">{sectionName}</td>
                  <td className="px-4 py-5 text-gray-600">{contact}</td>
                  <td className="px-4 py-5">
                    <StatusBadge
                      status={
                        student.isActive !== false ? "Active" : "Inactive"
                      }
                    />
                  </td>
                  <td className="px-6 py-5 text-right" />
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
