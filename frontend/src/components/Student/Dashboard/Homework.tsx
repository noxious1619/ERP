import React, { useState } from "react";
import { ArrowRight, Sigma, Microscope, Languages, Book, Code } from "lucide-react";

// 1. Updated interface to match your EXACT backend JSON response
export interface Assignment {
  id: string;
  title: string;
  description?: string;
  subject: string; // The backend sends this as a direct string now!
  attachments?: string;
  dueDate: string; // e.g., "Wednesday, May 27"
  dueTime: string; // e.g., "12:30 PM"
  fileUrl?: string;
  givenBy?: string;
  status: string;  // e.g., "OVERDUE" or "PENDING"
  statusClass?: string;
}

interface HomeworkProps {
  assignments: Assignment[];
  loading?: boolean;
}

// 2. Helper to assign icons/colors dynamically based on the subject name
const getSubjectStyling = (subjectName: string = "") => {
  const lowerSub = subjectName.toLowerCase();
  if (lowerSub.includes("bio") || lowerSub.includes("science")) {
    return { icon: <Microscope size={18} className="text-pink-600" />, bg: "bg-pink-100" };
  }
  if (lowerSub.includes("math")) {
    return { icon: <Sigma size={18} className="text-indigo-700" />, bg: "bg-indigo-100" };
  }
  if (lowerSub.includes("eng") || lowerSub.includes("lang")) {
    return { icon: <Languages size={18} className="text-blue-600" />, bg: "bg-blue-100" };
  }
  // Added "java" to trigger the coding icon based on your data!
  if (lowerSub.includes("comp") || lowerSub.includes("code") || lowerSub.includes("java")) {
    return { icon: <Code size={18} className="text-emerald-600" />, bg: "bg-emerald-100" };
  }
  // Default fallback style
  return { icon: <Book size={18} className="text-gray-600" />, bg: "bg-gray-100" };
};

const Homework: React.FC<HomeworkProps> = ({ assignments = [], loading }) => {
  const [activeTab, setActiveTab] = useState<"Pending" | "Overdue">("Pending");

  // 3. Filter using the backend's 'status' field! 
  // Assuming anything not explicitly "OVERDUE" belongs in the pending tab.
  const pendingAssignments = assignments.filter(a => a.status?.toUpperCase() !== "OVERDUE");
  const overdueAssignments = assignments.filter(a => a.status?.toUpperCase() === "OVERDUE");

  const displayData = activeTab === "Pending" ? pendingAssignments : overdueAssignments;

  return (
    <div className="w-full rounded-3xl bg-white px-5 py-5 shadow-[0px_15px_25px_10px_rgba(0,0,0,0.08)]">
      
      {/* Header */}
      <div className="flex items-center">
        <h2 className="text-[20px] mx-auto font-bold text-black">Homework</h2>
        <div className="rounded-full bg-pink-800/10 px-2 py-[2px] flex items-end">
          <span className="text-[11px] font-semibold text-[#AC3149]">
            {pendingAssignments.length} New
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex items-center justify-center gap-10 border-b border-[#ECECEC]">
        <button 
          onClick={() => setActiveTab("Pending")}
          className={`pb-2 text-[14px] transition-colors cursor-pointer ${activeTab === "Pending" ? "border-b-2 border-[#141B7A] font-semibold text-[#141B7A]" : "font-medium text-[#8B8B8B] border-b-2 border-transparent"}`}
        >
          Pending
        </button>
        <button 
          onClick={() => setActiveTab("Overdue")}
          className={`pb-2 text-[14px] transition-colors cursor-pointer ${activeTab === "Overdue" ? "border-b-2 border-[#141B7A] font-semibold text-[#141B7A]" : "font-medium text-[#8B8B8B] border-b-2 border-transparent"}`}
        >
          Overdue
        </button>
      </div>

      {/* Homework Cards */}
      <div className="mt-2 flex flex-col gap-2 overflow-y-auto h-[240px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-1">
        {loading ? (
          <div className="text-sm text-gray-500 text-center mt-4 p-4">Loading assignments...</div>
        ) : displayData.length > 0 ? (
          displayData.map((item) => {
            const subjectName = item.subject || "Subject";
            const styling = getSubjectStyling(subjectName);

            return (
              <div
                key={item.id}
                className="flex h-[70px] shrink-0 items-center justify-between rounded-[20px] bg-[#F7F7FA] px-6 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                {/* Left Content */}
                <div className="flex items-center gap-4">
                  {/* Dynamic Icon */}
                  <div className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full ${styling.bg}`}>
                    {styling.icon}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-[14px] font-semibold leading-[20px] text-[#1E1E1E] truncate max-w-[140px]">
                      {subjectName}
                    </h3>
                    
                    {/* Directly render the beautifully formatted backend dates */}
                    <p className="text-[10px] leading-[16px] text-[#7A7A7A]">
                      Due: {item.dueDate},
                    </p>
                    <p className="text-[10px] leading-[16px] text-[#7A7A7A]">
                      {item.dueTime}
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <button className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border border-[#D8D8D8] bg-white">
                  <ArrowRight size={22} strokeWidth={1.8} className="text-[#4A4A4A]" />
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-gray-500 text-center mt-6 mb-4">
            No {activeTab.toLowerCase()} assignments!
          </div>
        )}
      </div>
    </div>
  );
};

export default Homework;