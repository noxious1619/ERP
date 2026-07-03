// TeacherSubmissionView.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../../components/Teacher/Dashboard/Navbar";
import HomeworkHeader from "../../components/Student/Homework/HomeworkHeader";
import SubmissionImageViewer from "../../components/Teacher/Homework/TeacherSubmissionView/SubmissionImageViewer";
import SubmissionInfoCard from "../../components/Teacher/Homework/TeacherSubmissionView/SubmissionInfoCard";
import { useSubmissionDetail } from "../../hooks/useSubmissionDetails";

const SIDEBAR_WIDTH = 360;

const TeacherSubmissionView = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fire the hook!
  const { data, loading, error, saving, submitGrade } =
    useSubmissionDetail(submissionId);

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />

      {/* Main content */}
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

        {/* Dynamic State Handling */}
        {error ? (
          <div className="flex-1 flex items-center justify-center bg-white rounded-[20px] border border-red-200 text-red-500 shadow-sm">
            <p>{error}</p>
          </div>
        ) : loading || !data ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#4D8DFF]" />
            <p className="text-[14px] font-medium text-gray-500">
              Loading submission data...
            </p>
          </div>
        ) : (
          <div className="flex-1 min-h-0">
            {/* Pass the images array down to the viewer */}
            <SubmissionImageViewer
              images={data.attachments || []}
              sidebarOpen={sidebarOpen}
              onOpenSidebar={() => setSidebarOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div
        className="fixed top-0 right-0 h-screen z-40 transition-transform duration-300 ease-in-out bg-white overflow-hidden shadow-2xl"
        style={{
          width: `${SIDEBAR_WIDTH}px`,
          transform: sidebarOpen
            ? "translateX(0)"
            : `translateX(${SIDEBAR_WIDTH}px)`,
        }}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-5 left-4 z-50 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-800 text-base leading-none transition-all cursor-pointer"
        >
          ×
        </button>

        <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Pass the data and the save function down to the sidebar */}
          {!loading && data && (
            <SubmissionInfoCard
              data={data}
              saving={saving}
              onSubmitGrade={submitGrade}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherSubmissionView;
