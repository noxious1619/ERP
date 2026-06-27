import { X, ChevronDown } from "lucide-react"

export interface SubjectOption {
  id: string
  name: string
  code: string
  classId: string
  className: string
}

export interface SectionOption {
  id: string
  name: string
  classId: string
  className: string
}

export interface TeacherAssignment {
  subjectId: string
  classId: string
  sectionIds: string[]
  availableSections: SectionOption[]
  loading: boolean
}

interface TeacherAssignmentCardProps {
  index: number
  assignment: TeacherAssignment
  subjects: SubjectOption[]
  canRemove: boolean
  onSubjectChange: (index: number, subjectId: string) => void
  onSectionToggle: (index: number, sectionId: string) => void
  onRemove: (index: number) => void
}

export default function TeacherAssignmentCard({
  index,
  assignment,
  subjects,
  canRemove,
  onSubjectChange,
  onSectionToggle,
  onRemove,
}: TeacherAssignmentCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 flex flex-col gap-4">
      {/* Card header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Assignment {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-gray-300 hover:text-red-400 transition-colors p-0.5"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Subject dropdown */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#0a1c3a]">Subject</label>
        <div className="relative">
          <select
            value={assignment.subjectId}
            onChange={(e) => onSubjectChange(index, e.target.value)}
            className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.className})
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-[#0a1c3a]">Sections</label>

        {!assignment.subjectId ? (
          <p className="text-sm text-gray-400 px-1">Select a subject first</p>
        ) : assignment.loading ? (
          <div className="flex items-center gap-2 px-1 py-1">
            <div className="h-4 w-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
            <span className="text-sm text-gray-400">Loading sections…</span>
          </div>
        ) : assignment.availableSections.length === 0 ? (
          <p className="text-sm text-gray-400 px-1">No sections available</p>
        ) : (
          <div className="rounded-xl border border-gray-200/80 bg-[#f8fafd] px-4 py-3 flex flex-wrap gap-x-6 gap-y-2 max-h-32 overflow-y-auto">
            {assignment.availableSections.map((sec) => (
              <label key={sec.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assignment.sectionIds.includes(sec.id)}
                  onChange={() => onSectionToggle(index, sec.id)}
                  className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                />
                <span className="text-sm text-gray-700">
                  {sec.className} – {sec.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}