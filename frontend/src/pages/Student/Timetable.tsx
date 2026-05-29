import Navbar from "../../components/Student/Dashboard/Navbar";
import TimetableHeader from "../../components/Student/Timetable/Header";
import TimetableSchedule from "../../components/Student/Timetable/ScheduleSection";
import Calendar from "../../components/Student/Dashboard/Calendar";
import DateScheduleCard from "../../components/Student/Timetable/DateScheduleCard ";

const Timetable = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />
      <div className="flex flex-1 flex-col h-screen min-w-0">
        {/* Sticky Header */}
        <div className="px-10 pt-8 py-4 shrink-0 bg-[#F5F6FA]">
          <TimetableHeader />
        </div>
        {/* Body */}
        <div className="flex flex-1 overflow-hidden ">
          {/* LEFT - default scrollbar scrolls only this */}
          <div className="flex-1 overflow-y-auto px-10 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TimetableSchedule />
          </div>
          {/* RIGHT - completely static, never moves */}
          <div className="w-90 shrink-0 bg-gray-100 px-3 py-6 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Calendar variant="timetable" />
            <DateScheduleCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
