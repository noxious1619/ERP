import { useState, useEffect } from "react";
import TeacherNavbar from "../../components/Teacher/Dashboard/Navbar";
import TeacherTimetableHeader, {
  type TeacherFilterMode,
  type TeacherSection,
} from "../../components/Teacher/Timetable/TeacherTimetableHeader";
import TeacherWeeklyTimetableGrid from "../../components/Teacher/Timetable/Teacherweeklytimetablegrid";
import useAuth from "../../hooks/useAuth"; // ✅ Added auth hook

const TeacherWeeklyTimetablePage = () => {
  const [filterMode, setFilterMode] = useState<TeacherFilterMode>("class");
  
  const { teacherData } = useAuth();

  // ─── Sections from teacher profile ───────────────────────────────────────
  const [teacherSections, setTeacherSections] = useState<TeacherSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<TeacherSection | null>(null);

  // ─── Auto-populate dropdown from Auth Context (No API call needed) ─────
  useEffect(() => {
    if (teacherData && teacherData.teachingAssignments) {
      
      // Map the nested sections exactly how the header wants them
      const mappedSections = teacherData.teachingAssignments.map((assignment: any) => ({
        id: assignment.section.id,
        name: assignment.section.name,
        academicClass: {
          id: assignment.section.academicClass.id,
          name: assignment.section.academicClass.name,
        }
      }));

      // Remove any duplicate sections
      const uniqueSections = Array.from(
        new Map(mappedSections.map((item: TeacherSection) => [item.id, item])).values()
      ) as TeacherSection[];

      setTeacherSections(uniqueSections);
      
      // Auto-select the first section if one isn't selected
      if (uniqueSections.length > 0 && !selectedSection) {
        setSelectedSection(uniqueSections[0]);
      }
    }
  }, [teacherData]);

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <TeacherNavbar />
      <div className="flex flex-1 flex-col h-screen min-w-0">
        {/* Sticky Header */}
        <div className="px-10 pt-8 py-4 shrink-0 bg-[#F5F6FA]">
          <TeacherTimetableHeader
            filterMode={filterMode}
            onFilterChange={setFilterMode}
            sections={teacherSections}
            selectedSection={selectedSection}
            onSectionChange={setSelectedSection}
          />
        </div>
        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-10 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TeacherWeeklyTimetableGrid
            filterMode={filterMode}
            selectedSection={selectedSection}
          />
        </div>
      </div>
    </div>
  );
};

export default TeacherWeeklyTimetablePage;