import Navbar from "../../components/Student/Dashboard/Navbar";
import RightExamHeader from "../../components/Student/Exam/RightExamHeader";
import Calendar from "../.../../../components/Student/Dashboard/Calendar";
import CalendarMessageCard from "../.../../../components/Student/Dashboard/CalendarMessageCard";
import UpcomingExams from "../../components/Student/Exam/UpcomingExams";

const Exam = () => {
  return (
    <div className="flex min-h-screen bg-[#F7F7F7]">
      <Navbar />
      <div className="flex flex-1 h-screen">
        {/* LEFT CONTENT */}
        <div className="flex flex-1 flex-col h-screen">
          {/* Sticky Left Header */}
          <div className="px-14 pt-10 shrink-0 ">
            <h1 className="text-[44px] font-[700] leading-[54px] tracking-[-1.8px] text-[#2D3335]">
              Exam & Result
            </h1>
            <p className="mt-10 text-[14px] font-[600] text-[#484747]">
              Upcoming Exams
            </p>
          </div>

          {/* Scrollable Left Body */}
          <div className="flex-1 overflow-y-auto px-14 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex justify-center">
              <UpcomingExams />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[360px] shrink-0 bg-gray-100 mr-2 ml-2 sticky top-0 h-screen flex flex-col">
          {/* Sticky Right Header */}
          <div className="px-2 py-4 pt-12 shrink-0">
            <RightExamHeader />
          </div>

          {/* Scrollable Right Body */}
          <div className="flex-1 overflow-y-auto px-6 pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col gap-6">
              <Calendar />
              <CalendarMessageCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
