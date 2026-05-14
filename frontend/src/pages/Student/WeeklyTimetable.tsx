import Navbar from "../../components/Student/Dashboard/Navbar";
import TimetableHeader from "../../components/Student/Timetable/Header";
import WeeklyTimetableGrid from "../../components/Student/Timetable/WeeklyTimetableGrid";
const WeeklyTimetable = () => {
  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      {/* Navbar */}
      <Navbar />
      {/* Main Content */}
      <div className="flex-1 overflow-x-auto">
        <div className=" px-10 py-8">
          {/* Header */}
          <TimetableHeader />
          {/* Weekly Grid */}
          <WeeklyTimetableGrid />
        </div>
      </div>
    </div>
  );
};

export default WeeklyTimetable;
