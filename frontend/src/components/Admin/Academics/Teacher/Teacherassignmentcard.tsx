import { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Check } from "lucide-react";

export interface SubjectOption {
  id: string;
  name: string;
  code: string;
  classId: string;
  className: string;
}

export interface SectionOption {
  id: string;
  name: string;
  classId: string;
  className: string;
}

export interface TeacherAssignment {
  subjectId: string;
  classId: string;
  sectionIds: string[];
  availableSections: SectionOption[];
  loading: boolean;
}

interface TeacherAssignmentCardProps {
  index: number;
  assignment: TeacherAssignment;
  subjects: SubjectOption[];
  canRemove: boolean;
  onSubjectChange: (index: number, subjectId: string) => void;
  onSectionToggle: (index: number, sectionId: string) => void;
  onRemove: (index: number) => void;
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedSubject = subjects.find((s) => s.id === assignment.subjectId);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleSelect = (subjectId: string) => {
    onSubjectChange(index, subjectId);
    setIsOpen(false);
  };

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
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`w-full flex items-center justify-between rounded-xl border bg-white px-4 py-2.5 text-sm text-left focus:outline-none transition-all ${
              isOpen
                ? "border-blue-500 ring-2 ring-blue-500/20"
                : "border-gray-200/80"
            } ${selectedSubject ? "text-gray-800" : "text-gray-400"}`}
          >
            <span className="truncate">
              {selectedSubject
                ? `${selectedSubject.name} (${selectedSubject.className})`
                : "Select Subject"}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 shrink-0 ml-2 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div
              className="absolute z-20 mt-1.5 w-full rounded-xl border border-gray-200 bg-white shadow-lg max-h-56 overflow-y-auto
                [scrollbar-width:thin] [scrollbar-color:#c7d2e0_transparent]
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-gray-300
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb:hover]:bg-gray-400"
            >
              <button
                type="button"
                onClick={() => handleSelect("")}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                  !assignment.subjectId ? "text-gray-500" : "text-gray-700"
                }`}
              >
                Select Subject
              </button>
              {subjects.map((s) => {
                const isSelected = s.id === assignment.subjectId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelect(s.id)}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors ${
                      isSelected
                        ? "bg-blue-500 text-white hover:bg-blue-500"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="truncate">
                      {s.name} ({s.className})
                    </span>
                    {isSelected && <Check className="h-4 w-4 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}
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
              <label
                key={sec.id}
                className="flex items-center gap-2 cursor-pointer"
              >
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
  );
}
