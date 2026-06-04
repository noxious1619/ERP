// import { useState } from "react";
// import TeacherNavbar from "../../components/Teacher/Dashboard/Navbar";
// import Calendar from "../../components/Student/Dashboard/Calendar";
// import DateScheduleCard from "../../components/Teacher/Timetable/TeacherDateScheduleCard";

// import TeacherTimetableHeader, {
//   type TeacherFilterMode,
// } from "../../components/Teacher/Timetable/TeacherTimetableHeader";

// import TeacherTimetableSchedule from "../../components/Teacher/Timetable/Teachertimetableschedule";

// const TeacherTimetablePage = () => {
//   const [filterMode, setFilterMode] = useState<TeacherFilterMode>("class");

//   return (
//     <div className="flex min-h-screen bg-[#F8F9FE]">
//       {/* Left Navbar */}
//       <TeacherNavbar />

//       <div className="flex flex-1 flex-col h-screen min-w-0">
//         {/* Sticky Header */}
//         <div className="px-10 pt-8 py-4 shrink-0 bg-[#F5F6FA]">
//           <TeacherTimetableHeader
//             filterMode={filterMode}
//             onFilterChange={setFilterMode}
//           />
//         </div>

//         {/* Body */}
//         <div className="flex flex-1 overflow-hidden">
//           {/* Left Content */}
//           <div className="flex-1 overflow-y-auto px-10 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//             <TeacherTimetableSchedule filterMode={filterMode} />
//           </div>

//           {/* Right Panel */}
//           <div className="w-90 shrink-0 bg-gray-100 px-3 py-6 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//             <Calendar variant="timetable" />
//             <DateScheduleCard filterMode={filterMode} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeacherTimetablePage;
import { useState, useEffect } from "react";
import axios from "axios";
import TeacherNavbar from "../../components/Teacher/Dashboard/Navbar";
import Calendar from "../../components/Student/Dashboard/Calendar";
import DateScheduleCard, {
  type MySubjectScheduleItem,
} from "../../components/Teacher/Timetable/TeacherDateScheduleCard";
import TeacherTimetableHeader, {
  type TeacherFilterMode,
} from "../../components/Teacher/Timetable/TeacherTimetableHeader";
import TeacherTimetableSchedule from "../../components/Teacher/Timetable/Teachertimetableschedule";
import { getCurrentSystemDay } from "../../utils/dateHelpers";

// ─── Shape returned by the API ────────────────────────────────────────────────
interface MySubjectApiItem {
  id: string;
  time: string;
  subject: string; // "Class 10 - Section A"
  professor: string; // "English"
  room: string;
  isActive: boolean;
  isBreak: boolean;
  breakLabel: string | null;
  color: string | null;
  duration?: string;
}

const TeacherTimetablePage = () => {
  const [filterMode, setFilterMode] = useState<TeacherFilterMode>("class");

  // My Subject — raw API data shared between schedule cards + date panel
  const [mySubjectItems, setMySubjectItems] = useState<MySubjectApiItem[]>([]);
  const [mySubjectLoading, setMySubjectLoading] = useState(false);
  const [mySubjectError, setMySubjectError] = useState<string | null>(null);

  // Fetch when filterMode switches to mySubject
  useEffect(() => {
    if (filterMode !== "mySubject") return;

    const fetchMySubject = async () => {
      try {
        setMySubjectLoading(true);
        setMySubjectError(null);

        const token = localStorage.getItem("token");
        const today = getCurrentSystemDay(); 

        const response = await axios.get(
          "http://localhost:5000/api/academic/timetable/teacher/my-subject",
          {
            params: { day: today },
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data.success) {
          setMySubjectItems(response.data.data);
        } else {
          setMySubjectError("Failed to load timetable.");
        }
      } catch (err: any) {
        setMySubjectError(
          err.response?.data?.message || "Error connecting to server.",
        );
      } finally {
        setMySubjectLoading(false);
      }
    };

    fetchMySubject();
  }, [filterMode]);

  // ─── Transform API data → DateScheduleCard shape ─────────────────────────
  const mySubjectScheduleData: MySubjectScheduleItem[] = mySubjectItems.map(
    (item) => ({
      id: item.id,
      primary: item.subject, // "Class 10 - Section A"
      sub: item.professor, // "English"
      time: item.time,
      teacher: "", // teacher name not in this endpoint — add when needed
    }),
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <TeacherNavbar />

      <div className="flex flex-1 flex-col h-screen min-w-0">
        {/* Sticky Header */}
        <div className="px-10 pt-8 py-4 shrink-0 bg-[#F5F6FA]">
          <TeacherTimetableHeader
            filterMode={filterMode}
            onFilterChange={setFilterMode}
          />
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Schedule Cards */}
          <div className="flex-1 overflow-y-auto px-10 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TeacherTimetableSchedule
              filterMode={filterMode}
              mySubjectItems={mySubjectItems}
              mySubjectLoading={mySubjectLoading}
              mySubjectError={mySubjectError}
            />
          </div>

          {/* Right Panel */}
          <div className="w-90 shrink-0 bg-gray-100 px-3 py-6 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Calendar variant="timetable" />
            <DateScheduleCard
              filterMode={filterMode}
              mySubjectData={mySubjectScheduleData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherTimetablePage;
