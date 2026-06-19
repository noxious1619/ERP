import { useState, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";

const TABS = ["All", "Today"] as const;
type Tab = (typeof TABS)[number];

// ── Shape coming from teacherData.teachingAssignments ─────────────────────────
interface TeachingAssignment {
  section: {
    id: string;
    name: string;
    academicClass: {
      id: string;
      name: string;
    };
  };
  subject: {
    id: string;
    name: string;
  };
}

interface TeacherHomeworkFiltersProps {
  teachingAssignments: TeachingAssignment[];
  onFilterChange: (filters: {
    classId: string;
    sectionId: string;
    subjectId: string;
    date: "today" | "all";
  }) => void;
}

const TeacherHomeworkFilters = ({
  teachingAssignments,
  onFilterChange,
}: TeacherHomeworkFiltersProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("Today");
  const [dropdownOpen, setDropdownOpen] = useState<"class" | "section" | "subject" | null>(null);

  // Selected state IDs
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  // ─── 1. Derive Unique Lists for Dropdowns ──────────────────────────────────
  
  // Unique Classes taught by teacher
  const availableClasses = useMemo(() => {
    const classMap = new Map();
    teachingAssignments.forEach((ta) => {
      const cls = ta.section.academicClass;
      if (!classMap.has(cls.id)) classMap.set(cls.id, cls);
    });
    return Array.from(classMap.values());
  }, [teachingAssignments]);

  // Unique Sections filtered by the currently selected Class
  const availableSections = useMemo(() => {
    if (!selectedClassId) return [];
    const sectionMap = new Map();
    teachingAssignments
      .filter((ta) => ta.section.academicClass.id === selectedClassId)
      .forEach((ta) => {
        if (!sectionMap.has(ta.section.id)) sectionMap.set(ta.section.id, ta.section);
      });
    return Array.from(sectionMap.values());
  }, [teachingAssignments, selectedClassId]);

  // Unique Subjects filtered by the currently selected Section
  const availableSubjects = useMemo(() => {
    if (!selectedSectionId) return [];
    const subjectMap = new Map();
    teachingAssignments
      .filter((ta) => ta.section.id === selectedSectionId)
      .forEach((ta) => {
        if (!subjectMap.has(ta.subject.id)) subjectMap.set(ta.subject.id, ta.subject);
      });
    return Array.from(subjectMap.values());
  }, [teachingAssignments, selectedSectionId]);

  // ─── 2. Auto-select initial values on load ─────────────────────────────────
  useEffect(() => {
    if (availableClasses.length > 0 && !selectedClassId) {
      setSelectedClassId(availableClasses[0].id);
    }
  }, [availableClasses, selectedClassId]);

  useEffect(() => {
    if (availableSections.length > 0) {
      // Auto-select first section when class changes
      if (!availableSections.find(s => s.id === selectedSectionId)) {
        setSelectedSectionId(availableSections[0].id);
      }
    } else {
      setSelectedSectionId("");
    }
  }, [availableSections, selectedSectionId]);

  useEffect(() => {
    if (availableSubjects.length > 0) {
       // Auto-select first subject when section changes
      if (!availableSubjects.find(s => s.id === selectedSubjectId)) {
        setSelectedSubjectId(availableSubjects[0].id);
      }
    } else {
      setSelectedSubjectId("");
    }
  }, [availableSubjects, selectedSubjectId]);

  // ─── 3. Emit changes to Parent ─────────────────────────────────────────────
  useEffect(() => {
    // Only emit when we have resolved down to a subject (or if it's explicitly cleared)
    onFilterChange({
      classId: selectedClassId,
      sectionId: selectedSectionId,
      subjectId: selectedSubjectId,
      date: activeTab === "Today" ? "today" : "all",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId, selectedSectionId, selectedSubjectId, activeTab]);


  // Helpers to get display names
  const className = availableClasses.find((c) => c.id === selectedClassId)?.name || "Select Class";
  const sectionName = availableSections.find((s) => s.id === selectedSectionId)?.name || "Select Section";
  const subjectName = availableSubjects.find((s) => s.id === selectedSubjectId)?.name || "Select Subject";

  return (
    <div className="border-b border-[#EAECF0]">
      <div className="flex items-center justify-between">
        
        {/* Left: Tabs */}
        <div className="flex items-center gap-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                pb-4 text-[15px] font-medium whitespace-nowrap transition-all cursor-pointer
                ${
                  activeTab === tab
                    ? "text-[#101828] border-b-2 border-[#1D2939]"
                    : "text-[#98A2B3] hover:text-[#667085]"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right: Cascading Dropdowns */}
        <div className="flex items-center gap-3 pb-3">
          
          {/* 1. Class Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(dropdownOpen === "class" ? null : "class")}
              className="h-[40px] min-w-[120px] px-4 bg-white border border-[#EAECF0] rounded-full flex items-center justify-between gap-2 shadow-sm text-[14px] font-medium text-[#344054] cursor-pointer"
            >
              {className}
              <ChevronDown size={14} />
            </button>

            {dropdownOpen === "class" && (
              <div className="absolute top-full right-0 mt-2 w-[160px] bg-white rounded-2xl shadow-lg border border-[#EAECF0] z-50 overflow-hidden py-1">
                {availableClasses.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => {
                      setSelectedClassId(cls.id);
                      setDropdownOpen(null);
                    }}
                    className={`block w-full text-left px-4 py-2 text-[14px] font-medium text-[#344054] hover:bg-gray-50 ${selectedClassId === cls.id ? "bg-blue-50" : ""}`}
                  >
                    {cls.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Section Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(dropdownOpen === "section" ? null : "section")}
              disabled={availableSections.length === 0}
              className="h-[40px] min-w-[130px] px-4 bg-white border border-[#EAECF0] rounded-full flex items-center justify-between gap-2 shadow-sm text-[14px] font-medium text-[#344054] cursor-pointer disabled:opacity-50"
            >
              Section {sectionName !== "Select Section" ? sectionName : "..."}
              <ChevronDown size={14} />
            </button>

            {dropdownOpen === "section" && (
              <div className="absolute top-full right-0 mt-2 w-[165px] bg-white rounded-2xl shadow-lg border border-[#EAECF0] z-50 overflow-hidden py-1">
                {availableSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setSelectedSectionId(sec.id);
                      setDropdownOpen(null);
                    }}
                    className={`block w-full text-left px-4 py-2 text-[14px] font-medium text-[#344054] hover:bg-gray-50 ${selectedSectionId === sec.id ? "bg-blue-50" : ""}`}
                  >
                    Section {sec.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Subject Dropdown */}
           <div className="relative">
            <button
              onClick={() => setDropdownOpen(dropdownOpen === "subject" ? null : "subject")}
              disabled={availableSubjects.length === 0}
              className="h-[40px] min-w-[140px] px-4 bg-white border border-[#EAECF0] rounded-full flex items-center justify-between gap-2 shadow-sm text-[14px] font-medium text-[#344054] cursor-pointer disabled:opacity-50"
            >
              {subjectName}
              <ChevronDown size={14} />
            </button>

            {dropdownOpen === "subject" && (
              <div className="absolute top-full right-0 mt-2 w-[165px] bg-white rounded-2xl shadow-lg border border-[#EAECF0] z-50 overflow-hidden py-1">
                {availableSubjects.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubjectId(sub.id);
                      setDropdownOpen(null);
                    }}
                    className={`block w-full text-left px-4 py-2 text-[14px] font-medium text-[#344054] hover:bg-gray-50 ${selectedSubjectId === sub.id ? "bg-blue-50" : ""}`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherHomeworkFilters;