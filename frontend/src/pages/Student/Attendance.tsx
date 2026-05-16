import Navbar from "../../components/Student/Dashboard/Navbar";
import AttendanceHeader from "../../components/Student/Attendance/AttendanceHeader";
import CurrentStatusCard from "../../components/Student/Attendance/CurrentStatusCard";
import Calendar from "../../components/Student/Dashboard/Calendar";
import AttendanceYearlyGraph from "../../components/Student/Attendance/AttendanceYearlyGraph";
import TakeLeaveCard from "../../components/Student/Attendance/TakeLeaveCard";
import AttendanceYearlyChart from "../../components/Student/Attendance/AttendanceYearly/AttendanceYearlyChart ";

const AttendanceTracker = () => {
  return (
    <div className="flex min-h-screen">
      <Navbar />

      {/* Main Wrapper */}
      <div
        className="flex flex-1 h-screen overflow-y-auto"
        style={{
          background:
            "linear-gradient(to right, white 0%, white calc(100% - 370px), #F7F7F7 calc(100% - 370px), #F7F7F7 100%)",
        }}
      >
        {/* LEFT CONTENT */}
        <div className="flex-1 px-12 mt-8">
          <AttendanceHeader />
          <div className="mt-12 flex flex-col gap-8 py-10">
            <div className="flex items-start gap-8">
              <CurrentStatusCard />
              <div className="shrink-0">
                <Calendar />
              </div>
            </div>
            <AttendanceYearlyGraph />
          </div>
        </div>

        {/* RIGHT SIDEBAR - transparent bg now, parent handles it */}
        <div className="w-[370px] shrink-0 ">
          <div className="p-8 ml-6">
            <AttendanceYearlyChart />
            <TakeLeaveCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
