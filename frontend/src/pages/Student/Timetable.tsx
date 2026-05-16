import Navbar from "../../components/Student/Dashboard/Navbar";
import TimetableHeader from "../../components/Student/Timetable/Header";
import TimetableSchedule from "../../components/Student/Timetable/ScheduleSection";
import Calendar from "../../components/Student/Dashboard/Calendar";
import DateScheduleCard from "../../components/Student/Timetable/DateScheduleCard ";
const Timetable = () => {
  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      <Navbar />
      <div className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="px-8 py-8">
          <TimetableHeader />
          <div className="mt-8 flex items-start gap-6">
            {/* LEFT */}
            <div className="flex-1 min-w-0">
              <TimetableSchedule />
            </div>
            {/* RIGHT — always fixed */}
            <div className="w-[360px] shrink-0 bg-gray-100 px-5 py-6 ">
              <Calendar variant="timetable" />
              {/* Date Schedule */}
              <DateScheduleCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Timetable;
