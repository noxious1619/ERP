import Navbar from "../../components/Student/Dashboard/Navbar";
import RightExamHeader from "../../components/Student/Exam/RightExamHeader";
import Calendar from "../.../../../components/Student/Dashboard/Calendar";
import CalendarMessageCard from "../.../../../components/Student/Dashboard/CalendarMessageCard";
import UpcomingExams from "../../components/Student/Exam/UpcomingExams";
import { getDynamicHeaderDate } from "../../utils/dateHelpers";

const Exam = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />
      <div className="flex flex-1 h-screen">
        {/* LEFT CONTENT */}
        <div className="flex flex-1 flex-col h-screen">
          {/* Sticky Left Header */}
          <div className="px-14 pt-10 shrink-0 ">
            <h1 className="text-[44px] font-[700] leading-[54px] tracking-[-1.8px] text-[#2D3335]">
              Exam & Result
            </h1>
            <p className=" text-sm font-semibold text-gray-400 mt-1">
              {getDynamicHeaderDate()}
            </p>
            <p className="mt-10 text-[18px] font-[600] text-[#484747]">
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

              {/* Download Timetable Button */}
              <button
                className="
      mt-2
      h-[56px]
      w-full
      rounded-full
      bg-[#3F6EF6]
      shadow-[0px_8px_18px_rgba(63,110,246,0.35)]
      flex
      items-center
      justify-center
      gap-3
      text-white
      font-semibold
      text-[16px]
      transition-all
      duration-200
      hover:scale-[1.01]
    "
              >
                <span>Download Timetable</span>

                {/* Download Icon */}
                <div className="w-7 h-7 rounded-full border border-white flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v12" />
                    <path d="M7 10l5 5 5-5" />
                    <path d="M5 21h14" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
