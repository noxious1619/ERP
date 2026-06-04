import { useState } from "react";
import { Sigma } from "lucide-react";
import ViewDetailSidebar from "../../../Student/Homework/ViewDetailSidebar";
import type { HomeworkTask } from "../../../Student/Homework/ViewDetailSidebar";
const teacherTask: HomeworkTask = {
  id: 1,
  title: "Vertices and Edges",
  subject: "Mathematics",
  status: "DUE TODAY",
  dueDate: "Thursday, May 22",
  dueTime: "10:00 PM",
  givenBy: "Miss. Archana Shah",
  description:
    "Get your graph theory homework done quickly by focusing on these key graph concepts. These are very important questions for the upcoming unit exams.",
  teacherImages: [], // add image URLs if available
};

const AssignmentInfoCard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex-1 bg-white rounded-[18px] border border-[#EAECF0] px-8 py-5 shadow-sm relative">
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-5 right-6 text-[14px] font-semibold text-[#4D8DFF] hover:underline cursor-pointer"
        >
          View Details
        </button>

        {/* rest of the card unchanged */}
        <div className="flex items-center justify-between pr-4 mt-5">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#EEEDF8] flex items-center justify-center shrink-0">
              <Sigma className="w-10 h-10 text-[#2D2F7E]" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[14px] text-gray-400 font-medium mb-1">
                Class - X (A)
              </p>
              <h2 className="text-[26px] font-bold text-gray-900 leading-tight">
                Vertices and Edges
              </h2>
              <p className="text-[15px] text-gray-500 mt-1">Graph theory</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 ">
            <div className="flex items-center gap-3 bg-[#EEF3FF] rounded-[12px] px-4 py-3">
              <div className="flex flex-col items-center leading-none min-w-[28px]">
                <span className="text-[10px] font-bold text-[#4D8DFF] uppercase tracking-widest">
                  MAY
                </span>
                <span className="text-[18px] font-bold text-[#1D2939] leading-tight">
                  20
                </span>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium leading-none mb-1">
                  Start Date
                </p>
                <p className="text-[14px] font-semibold text-gray-800 whitespace-nowrap">
                  20 May, 2026
                </p>
              </div>
            </div>

            <span className="text-[14px] text-gray-400 font-medium">to</span>

            <div className="flex items-center gap-3 bg-[#EEF3FF] rounded-[12px] px-4 py-3">
              <div className="flex flex-col items-center leading-none min-w-[28px]">
                <span className="text-[10px] font-bold text-[#4D8DFF] uppercase tracking-widest">
                  MAY
                </span>
                <span className="text-[18px] font-bold text-[#1D2939] leading-tight">
                  22
                </span>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium leading-none mb-1">
                  Due Date
                </p>
                <p className="text-[14px] font-semibold text-gray-800 whitespace-nowrap">
                  22 May, 2026
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
