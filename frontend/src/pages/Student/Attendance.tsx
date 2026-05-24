import Navbar from "../../components/Student/Dashboard/Navbar";
import AttendanceHeader from "../../components/Student/Attendance/AttendanceHeader";
import CurrentStatusCard from "../../components/Student/Attendance/CurrentStatusCard";
import Calendar from "../../components/Student/Dashboard/Calendar";
import AttendanceYearlyGraph from "../../components/Student/Attendance/AttendanceYearlyGraph";
import AttendanceWeekly from "../../components/Student/Attendance/AttendanceWeekly";
import AttendanceYearlyChart from "../../components/Student/Attendance/AttendanceYearly/AttendanceYearlyChart ";

const AttendanceTracker = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />

      {/* Main Wrapper */}
      <div className="flex flex-1 h-screen overflow-hidden">
        {/* LEFT CONTENT */}
        <div className="flex-1 flex flex-col px-5">
          {/* Static Header — never scrolls */}
          <div className="flex-shrink-0 pt-8 bg-white z-10">
            <AttendanceHeader />
          </div>

          {/* Scrollable content below header */}
          <div
            className="flex-1 overflow-y-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="mt-12 flex flex-col gap-8 py-10 px-2">
              <div className="flex items-start gap-8">
                <CurrentStatusCard />
                <AttendanceWeekly />
                <div className="shrink-0">
                  <Calendar />
                </div>
              </div>
              <AttendanceYearlyGraph />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR — fully independent, never affected by left scroll */}
        <div
          className="w-[340px] bg-gray-100 shrink-0 h-screen overflow-y-auto flex flex-col items-center px-2 "
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className=" mt-8">
            <AttendanceYearlyChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
