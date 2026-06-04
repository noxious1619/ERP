import Navbar from "../../components/Student/Dashboard/Navbar"; // reuse student navbar
import TeacherTimetableHeader from "../../components/Teacher/Timetable/TeacherTimetableHeader";
import TeacherWeeklyTimetableGrid from "../../components/Teacher/Timetable/Teacherweeklytimetablegrid";
import { useState } from "react";
import type { TeacherFilterMode } from "../../components/Teacher/Timetable/TeacherTimetableHeader";

const TeacherWeeklyTimetablePage = () => {
  const [filterMode, setFilterMode] = useState<TeacherFilterMode>("class");

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />
      <div className="flex flex-1 flex-col h-screen min-w-0">
        {/* Sticky Header */}
        <div className="px-10 pt-8 py-4 shrink-0 bg-[#F5F6FA]">
          <TeacherTimetableHeader
            filterMode={filterMode}
            onFilterChange={setFilterMode}
          />
        </div>
        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-10 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TeacherWeeklyTimetableGrid filterMode={filterMode} />
        </div>
      </div>
    </div>
  );
};

export default TeacherWeeklyTimetablePage;
