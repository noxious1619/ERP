import Navbar from "../../components/Student/Dashboard/Navbar";
import RightExamHeader from "../../components/Student/Exam/RightExamHeader";
import Calendar from "../.../../../components/Student/Dashboard/Calendar";
import CalendarMessageCard from "../.../../../components/Student/Dashboard/CalendarMessageCard";
import UpcomingExams from "../../components/Student/Exam/UpcomingExams";

const Exam = () => {
  return (
    <div className="flex min-h-screen bg-[#F7F7F7]">
      <Navbar />
      <div className="flex flex-1  h-screen overflow-y-auto">
        {/* LEFT CONTENT */}
        <div className="flex flex-1 flex-col px-14 py-10">
          {/* Heading Section */}
          <div>
            <h1 className="text-[44px] font-[700] leading-[54px] tracking-[-1.8px] text-[#2D3335]">
              Exam & Result
            </h1>
            <p className="mt-10 text-[14px] font-[600] text-[#484747]">
              Upcoming Exams
            </p>
          </div>

          {/* Cards — centered, full width up to a max */}
          <div className="mt-8 flex flex-1 justify-center">
            <UpcomingExams />
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[360px] shrink-0 bg-gray-100 px-6 py-10 mr-2 ml-2">
          <RightExamHeader />
          <div className="mt-14 flex flex-col gap-8">
            <Calendar />
            <CalendarMessageCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
