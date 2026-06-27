import { Users, Trash2 } from "lucide-react";
interface ClassesBannerProps {
  className: string;
  totalStudents: number;
  totalCapacity: number;
  sectionCount: number;
  hasSelectedClass: boolean;
  onAddSectionClick?: () => void;
  onAddClassClick?: () => void;
  onDeleteClassClick?: () => void;
}

export default function ClassesBanner({
  className,
  totalStudents,
  totalCapacity,
  sectionCount,
  hasSelectedClass,
  onAddSectionClick,
  onAddClassClick,
  onDeleteClassClick,
}: ClassesBannerProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
      {/* Left Info */}
      <div className="flex flex-wrap items-center gap-6 bg-gray-50/50 border border-gray-200/80 rounded-xl px-5 py-3">
        {hasSelectedClass ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#4285F4]">
                {className}
              </span>
              <button
                onClick={onDeleteClassClick}
                className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                title="Delete this class"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
              <Users className="h-4 w-4 text-gray-400" />
              <span>
                {totalStudents}/{totalCapacity}
              </span>
            </div>

            <span className="text-sm text-gray-500 font-medium">
              {sectionCount} {sectionCount === 1 ? "Section" : "Sections"}
            </span>

            <button
              onClick={onAddSectionClick}
              className="bg-[#4285F4] hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
            >
              + Add Section
            </button>
          </>
        ) : (
          <span className="text-sm text-gray-400 font-medium">
            No classes yet — add one to get started
          </span>
        )}
      </div>

      {/* Right Button — always visible */}
      <button
        onClick={onAddClassClick}
        className="bg-[#4285F4] hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm self-stretch sm:self-auto flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span>+</span> Add Class
      </button>
    </div>
  );
}
