import { useState, useEffect } from "react";
import axios from "axios";
import TeacherNavbar from "../../components/Teacher/Dashboard/Navbar";
import TeacherTimetableHeader, {
  type TeacherFilterMode,
  type TeacherSection,
} from "../../components/Teacher/Timetable/TeacherTimetableHeader";
import TeacherWeeklyTimetableGrid from "../../components/Teacher/Timetable/Teacherweeklytimetablegrid";

const TeacherWeeklyTimetablePage = () => {
  const [filterMode, setFilterMode] = useState<TeacherFilterMode>("class");

  // ─── Sections from teacher profile ───────────────────────────────────────
  const [teacherSections, setTeacherSections] = useState<TeacherSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<TeacherSection | null>(null);

  // Fetch teacher profile to get assigned sections — same as daily page
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/teachers/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          const sections: TeacherSection[] = response.data.data.sections;
          setTeacherSections(sections);
          if (sections.length > 0) setSelectedSection(sections[0]);
        }
      } catch (err) {
        console.error("Failed to fetch teacher profile", err);
      }
    };
    fetchProfile();
  }, []);

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