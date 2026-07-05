import { useState } from "react";
import { Sigma } from "lucide-react";
import ViewDetailSidebar from "../../../Student/Homework/ViewDetailSidebar";
import type { HomeworkTask } from "../../../Student/Homework/ViewDetailSidebar";

interface AssignmentInfoProps {
  info?: {
    title: string;
    subject: string;
    class: string;
    section: string;
    dueDate: string;
    createdAt: string;
    maxScore: number;
  };
}

// Helper to extract date components (e.g., "MAY", "20", "20 May, 2026")
const parseDateString = (isoString?: string) => {
  if (!isoString) return { month: "—", day: "—", full: "—" };
  const d = new Date(isoString);
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = d.getDate().toString();
  const full = d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return { month, day, full };
};

const AssignmentInfoCard = ({ info }: AssignmentInfoProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fallbacks if data is still loading
  const currentTitle = info?.title || "Loading Assignment...";
  const currentSubject = info?.subject || "—";
  const currentClass = info?.class && info?.section ? `Class - ${info.class} (${info.section})` : "—";
  
  const startParsed = parseDateString(info?.createdAt);
  const dueParsed = parseDateString(info?.dueDate);

  // Map backend details cleanly into your existing sidebar structure
  const teacherTask: HomeworkTask = {
    id: 1, // Static placeholder identifier required by the type
    title: currentTitle,
    subject: currentSubject,
    status: "PENDING",
    dueDate: info?.dueDate ? new Date(info.dueDate).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' }) : "—",
    dueTime: info?.dueDate ? new Date(info.dueDate).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }) : "—",
    givenBy: "Teacher Session", 
    description: `Maximum points achievable for this assignment: ${info?.maxScore || 0} marks. Detailed analytics regarding sections and individual completions are displayed below.`,
    teacherImages: [], 
  };

  return (
    <>
      <div className="flex-1 bg-white rounded-[18px] border border-[#EAECF0] px-8 py-5 shadow-sm relative">
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-5 right-6 text-[14px] font-semibold text-[#4D8DFF] hover:underline cursor-pointer"
        >
          View Details
        </button>

        <div className="flex items-center justify-between pr-4 mt-5">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#EEEDF8] flex items-center justify-center shrink-0">
              <Sigma className="w-10 h-10 text-[#2D2F7E]" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[14px] text-gray-400 font-medium mb-1">
                {currentClass}
              </p>
              <h2 className="text-[26px] font-bold text-gray-900 leading-tight">
                {currentTitle}
              </h2>
              <p className="text-[15px] text-gray-500 mt-1">{currentSubject}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            {/* Start Date Box */}
            <div className="flex items-center gap-3 bg-[#EEF3FF] rounded-[12px] px-4 py-3">
              <div className="flex flex-col items-center leading-none min-w-[28px]">
                <span className="text-[10px] font-bold text-[#4D8DFF] uppercase tracking-widest">
                  {startParsed.month}
                </span>
                <span className="text-[18px] font-bold text-[#1D2939] leading-tight">
                  {startParsed.day}
                </span>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium leading-none mb-1">
                  Start Date
                </p>
                <p className="text-[14px] font-semibold text-gray-800 whitespace-nowrap">
                  {startParsed.full}
                </p>
              </div>
            </div>

            <span className="text-[14px] text-gray-400 font-medium">to</span>

            {/* Due Date Box */}
            <div className="flex items-center gap-3 bg-[#EEF3FF] rounded-[12px] px-4 py-3">
              <div className="flex flex-col items-center leading-none min-w-[28px]">
                <span className="text-[10px] font-bold text-[#4D8DFF] uppercase tracking-widest">
                  {dueParsed.month}
                </span>
                <span className="text-[18px] font-bold text-[#1D2939] leading-tight">
                  {dueParsed.day}
                </span>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium leading-none mb-1">
                  Due Date
                </p>
                <p className="text-[14px] font-semibold text-gray-800 whitespace-nowrap">
                  {dueParsed.full}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar — teacher mode: no attachment, EDIT button */}
      <ViewDetailSidebar
        task={sidebarOpen ? teacherTask : null}
        onClose={() => setSidebarOpen(false)}
        isTeacherView={true}
      />
    </>
  );
};

export default AssignmentInfoCard;