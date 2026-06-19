import { Pencil } from "lucide-react"

export type SubjectTypeVal = "Theory" | "Lab"

export type SubjectRowData = {
  id: string
  name: string
  code: string
  classes: string[]
  teachers: string[]
  type: SubjectTypeVal
}

const MOCK_SUBJECTS: SubjectRowData[] = [
  { id: "SUB001", name: "Mathematics", code: "MATH101", classes: ["10A", "10B", "10C"], teachers: ["Dr. Rajesh Kumar", "Mrs. Priya Sharma"], type: "Theory" },
  { id: "SUB002", name: "Physics Lab", code: "PHY201L", classes: ["11A", "11B", "12A"], teachers: ["Ms. Sneha Reddy"], type: "Lab" },
  { id: "SUB003", name: "English Literature", code: "ENG101", classes: ["10A", "10B", "10C"], teachers: ["Mrs. Priya Sharma"], type: "Theory" },
  { id: "SUB004", name: "Computer Science", code: "CS301", classes: ["11A", "12A"], teachers: ["Dr. Rajesh Kumar"], type: "Theory" },
  { id: "SUB005", name: "Chemistry Lab", code: "CHEM201L", classes: ["11A", "12B", "11B"], teachers: ["Mr. Vikram Singh", "Dr. Anjali Verma"], type: "Lab" },
  { id: "SUB006", name: "Biology", code: "BIO201", classes: ["11B", "12B"], teachers: ["Dr. Rajesh Kumar"], type: "Theory" }
]

function TypeBadge({ type }: { type: SubjectTypeVal }) {
  const styles: Record<SubjectTypeVal, string> = {
    Theory: "bg-green-100 text-green-700",
    Lab: "bg-amber-100 text-amber-700"
  }
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[type]}`}>
      {type}
    </span>
  )
}

export default function SubjectsTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/30">
            <th className="px-6 py-4 text-left w-12"></th>
            <th className="px-4 py-4 text-left font-semibold text-gray-900">Sub Name</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-900">Sub Code</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-900">Classes</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-900">Assigned Teachers</th>
            <th className="px-4 py-4 text-left font-semibold text-gray-900">Type</th>
            <th className="px-6 py-4 text-right">
              <Pencil className="ml-auto h-4 w-4 text-gray-700 cursor-pointer" />
            </th>
          </tr>
        </thead>

        <tbody>
          {MOCK_SUBJECTS.map((subject, idx) => (
            <tr 
              key={subject.id} 
              className={`hover:bg-gray-50/50 ${idx < MOCK_SUBJECTS.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <td className="px-6 py-5">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                />
              </td>
              <td className="px-4 py-5 font-semibold text-gray-900">{subject.name}</td>
              <td className="px-4 py-5 text-gray-500 font-mono text-xs uppercase tracking-wider">{subject.code}</td>
              <td className="px-4 py-5">
                <div className="flex flex-wrap gap-1.5 max-w-[150px]">
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
          ))}
        </tbody>
      </table>
    </div>
  )
}
