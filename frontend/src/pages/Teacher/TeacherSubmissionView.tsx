// TeacherSubmissionView.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../../components/Teacher/Dashboard/Navbar";
import HomeworkHeader from "../../components/Student/Homework/HomeworkHeader";
import SubmissionImageViewer from "../../components/Teacher/Homework/TeacherSubmissionView/SubmissionImageViewer";
import SubmissionInfoCard from "../../components/Teacher/Homework/TeacherSubmissionView/SubmissionInfoCard";

const SIDEBAR_WIDTH = 360;

const TeacherSubmissionView = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />

      {/* Main content — right-padded when sidebar is open so image viewer doesn't go under it */}
      <div
        className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden px-10 pt-4 pb-6 transition-all duration-300"
        style={{
          paddingRight: sidebarOpen ? `${SIDEBAR_WIDTH + 40}px` : "40px",
        }}
      >
        {/* Header */}
        <div className="shrink-0">
          <HomeworkHeader />
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700 mb-4 mt-4 w-fit cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Image viewer fills remaining height */}
        <div className="flex-1 min-h-0">
          <SubmissionImageViewer
            sidebarOpen={sidebarOpen}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
        </div>
      </div>

      {/* Sidebar — fixed, full viewport height, right edge */}
      <div
        className="fixed top-0 right-0 h-screen z-40 transition-transform duration-300 ease-in-out bg-white overflow-hidden shadow-2xl"
        style={{
          width: `${SIDEBAR_WIDTH}px`,
          transform: sidebarOpen
            ? "translateX(0)"
            : `translateX(${SIDEBAR_WIDTH}px)`,
        }}
      >
        {/* × button — top-left of sidebar */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-5 left-4 z-50 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-800 text-base leading-none transition-all cursor-pointer"
        >
          ×
        </button>

        {/* Scrollable card content */}
        <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <SubmissionInfoCard />
        </div>
      </div>
    </div>
  );
};

export default TeacherSubmissionView;
