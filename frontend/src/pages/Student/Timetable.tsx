import Navbar from "../../components/Student/Dashboard/Navbar";
import TimetableHeader from "../../components/Student/Timetable/Header";
import TimetableSchedule from "../../components/Student/Timetable/ScheduleSection";
import Calendar from "../../components/Student/Dashboard/Calendar";
import DateScheduleCard from "../../components/Student/Timetable/DateScheduleCard ";

const Timetable = () => {
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
          <div className="flex items-start gap-6">
            {/* LEFT */}
            <div className="flex-1 min-w-0">
              <TimetableSchedule />
            </div>
            {/* RIGHT */}
            <div className="w-[360px] shrink-0 bg-gray-100 px-5 py-6">
              <Calendar variant="timetable" />
              <DateScheduleCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Timetable;
