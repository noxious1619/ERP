import { Pencil, Trash2 } from "lucide-react"

export type SubjectTypeVal = "Theory" | "Lab"

export type SubjectRowData = {
  id: string
  name: string
  code: string
  classes: string[]
  teachers: string[]
  type: SubjectTypeVal
}

interface SubjectsTableProps {
  subjects: SubjectRowData[]
  selectedIds: string[]
  onSelectRow: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onEditClick: () => void
  onDeleteClick: () => void
  isLoading: boolean
}

function TypeBadge({ type }: { type: SubjectTypeVal }) {
  const styles: Record<SubjectTypeVal, string> = {
    Theory: "bg-green-100 text-green-700",
    Lab: "bg-amber-100 text-amber-700"
  }
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[type] || "bg-gray-100 text-gray-700"}`}>
      {type}
    </span>
  )
}

export default function SubjectsTable({
  subjects,
  selectedIds,
  onSelectRow,
  onSelectAll,
  onEditClick,
  onDeleteClick,
  isLoading,
}: SubjectsTableProps) {
  const selectedCount = selectedIds.length
  const allSelectedOnPage = subjects.length > 0 && subjects.every((s) => selectedIds.includes(s.id))

  return (
    <div className="overflow-auto h-full rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-[900px] text-sm">
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
            <th className="px-4 py-4 text-left font-semibold text-gray-900 sticky top-0 bg-gray-50 z-10 border-b border-gray-200">Sub Name</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-900 sticky top-0 bg-gray-50 z-10 border-b border-gray-200">Sub Code</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-900 sticky top-0 bg-gray-50 z-10 border-b border-gray-200">Classes/Sections</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-900 sticky top-0 bg-gray-50 z-10 border-b border-gray-200">Assigned Teachers</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-900 sticky top-0 bg-gray-50 z-10 border-b border-gray-200">Type</th>
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
                  title="Edit selected subject"
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
                  title="Delete selected subjects"
                >
                  <Trash2 className="h-4.5 w-4.5 stroke-[2.2]" />
                </button>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-medium">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                  Loading subjects...
                </div>
              </td>
            </tr>
          ) : subjects.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-medium">
                No subjects found matching your filters.
              </td>
            </tr>
          ) : (
            subjects.map((subject, idx) => {
              const isChecked = selectedIds.includes(subject.id)
              return (
                <tr 
                  key={subject.id} 
                  className={`hover:bg-gray-50/50 transition-colors ${
                    isChecked ? "bg-blue-50/20" : ""
                  } ${idx < subjects.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <td className="px-6 py-5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => onSelectRow(subject.id, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-5 font-semibold text-gray-900">{subject.name}</td>
                  <td className="px-4 py-5 text-gray-500 font-mono text-xs uppercase tracking-wider">{subject.code}</td>
                  <td className="px-4 py-5">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {subject.classes.map((cls, cidx) => (
                        <span 
                          key={cidx} 
                          className="bg-blue-50 text-[#4285F4] text-xs font-semibold px-2 py-0.5 rounded-md"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-5 text-gray-700 leading-relaxed max-w-[240px]">
                    {subject.teachers.join(", ")}
                  </td>
                  <td className="px-4 py-5">
                    <TypeBadge type={subject.type} />
                  </td>
                  <td className="px-6 py-5 text-right"></td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
