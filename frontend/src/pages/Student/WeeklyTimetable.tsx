import Navbar from "../../components/Student/Dashboard/Navbar";
import TimetableHeader from "../../components/Student/Timetable/Header";
import WeeklyTimetableGrid from "../../components/Student/Timetable/WeeklyTimetableGrid";

const WeeklyTimetable = () => {
  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      <Navbar />
      <div className="flex flex-1 flex-col h-screen min-w-0">
        {/* Sticky Header */}
        <div className="px-10 pt-8 py-4 shrink-0 bg-[#F5F6FA]">
          <TimetableHeader />
        </div>
        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-10 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <WeeklyTimetableGrid />
        </div>
      </div>
    </div>
  );
};

export default WeeklyTimetable;
