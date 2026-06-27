import { Pencil, Trash2 } from "lucide-react";
interface SectionCardProps {
  id: string;
  sectionName: string;
  teacherName: string;
  roomNumber: string;
  strength: number;
  maxStrength: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function SectionCard({
  sectionName,
  teacherName,
  roomNumber,
  strength,
  maxStrength,
  onEdit,
  onDelete,
}: SectionCardProps) {
  const percentage = Math.round((strength / maxStrength) * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-5">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          Section {sectionName}
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Info Stack */}
      <div className="space-y-3">
        {/* Class Teacher */}
        <div className="bg-gray-50/30 border border-gray-100 rounded-xl p-4">
          <span className="block text-gray-400 text-xs font-semibold tracking-wider uppercase mb-1">
            Class Teacher
          </span>
          <span className="font-semibold text-gray-900 text-sm">
            {teacherName}
          </span>
        </div>

        {/* Room Number */}
        <div className="bg-gray-50/30 border border-gray-100 rounded-xl p-4">
          <span className="block text-gray-400 text-xs font-semibold tracking-wider uppercase mb-1">
            Room Number
          </span>
          <span className="font-semibold text-gray-900 text-sm">
            {roomNumber}
          </span>
        </div>

        {/* Strength & Progress Bar */}
        <div className="bg-gray-50/30 border border-gray-100 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">
              Total Class Strength
            </span>
            <span className="text-xs font-bold text-[#4285F4]">
              {percentage}%
            </span>
          </div>
          <div className="flex items-baseline mt-1.5">
            <span className="text-3xl font-bold text-gray-900">{strength}</span>
            <span className="text-gray-400 text-sm font-semibold ml-0.5">
              /{maxStrength}
            </span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-[#4285F4] h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
