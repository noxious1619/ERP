import React, { useState } from "react";
import {
  ArrowRight,
  Sigma,
  Microscope,
  Languages,
  Book,
  Code,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  subject: string;
  attachments?: string;
  dueDate: string;
  dueTime: string;
  fileUrl?: string;
  givenBy?: string;
  status: string;
  statusClass?: string;
}

interface HomeworkProps {
  assignments: Assignment[];
  loading?: boolean;
  tab1Label?: string;
  tab2Label?: string;
  tab2StatusKey?: string;
}

const getSubjectStyling = (subjectName: string = "") => {
  const lowerSub = subjectName.toLowerCase();

  if (lowerSub.includes("bio") || lowerSub.includes("science")) {
    return {
      icon: <Microscope size={18} className="text-pink-600" />,
      bg: "bg-pink-100",
    };
  }

  if (lowerSub.includes("math")) {
    return {
      icon: <Sigma size={18} className="text-indigo-700" />,
      bg: "bg-indigo-100",
    };
  }

  if (lowerSub.includes("eng") || lowerSub.includes("lang")) {
    return {
      icon: <Languages size={18} className="text-blue-600" />,
      bg: "bg-blue-100",
    };
  }

  if (
    lowerSub.includes("comp") ||
    lowerSub.includes("code") ||
    lowerSub.includes("java")
  ) {
    return {
      icon: <Code size={18} className="text-emerald-600" />,
      bg: "bg-emerald-100",
    };
  }

  return {
    icon: <Book size={18} className="text-gray-600" />,
    bg: "bg-gray-100",
  };
};

const Homework: React.FC<HomeworkProps> = ({
  assignments = [],
  loading,
  tab1Label = "Pending",
  tab2Label = "Overdue",
  tab2StatusKey = "OVERDUE",
}) => {
  const [activeTab, setActiveTab] = useState<string>(tab1Label);
  const navigate = useNavigate();

  // Split into two buckets using the configurable status key
  const tab2Assignments = assignments.filter(
    (a) => a.status?.toUpperCase() === tab2StatusKey.toUpperCase(),
  );

  const tab1Assignments = assignments.filter(
    (a) => a.status?.toUpperCase() !== tab2StatusKey.toUpperCase(),
  );

  const displayData =
    activeTab === tab1Label ? tab1Assignments : tab2Assignments;

  return (
    <div className="w-full rounded-3xl bg-white px-5 py-5 shadow-[0px_15px_25px_10px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex items-center">
        <h2 className="mx-auto text-[20px] font-bold text-black">
          Homework
        </h2>

        <div className="flex items-end rounded-full bg-pink-800/10 px-2 py-[2px]">
          <span className="text-[11px] font-semibold text-[#AC3149]">
            {tab1Assignments.length} New
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex items-center justify-center gap-10 border-b border-[#ECECEC]">
        {[tab1Label, tab2Label].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer pb-2 text-[14px] transition-colors ${
              activeTab === tab
                ? "border-b-2 border-[#141B7A] font-semibold text-[#141B7A]"
                : "border-b-2 border-transparent font-medium text-[#8B8B8B]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Homework Cards */}
      <div className="mt-2 flex h-[240px] flex-col gap-2 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {loading ? (
          <div className="mt-4 p-4 text-center text-sm text-gray-500">
            Loading assignments...
          </div>
        ) : displayData.length > 0 ? (
          displayData.map((item) => {
            const subjectName = item.title || "Subject";
            const styling = getSubjectStyling(subjectName);

            return (
              <div
                key={item.id}
                onClick={() => navigate("/student/homework")}
                className="mt-2 flex h-[70px] shrink-0 cursor-pointer items-center justify-between rounded-[20px] bg-[#F8F9FE] px-6 transition-colors hover:bg-gray-100"
              >
                {/* Left Content */}
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full ${styling.bg}`}
                  >
                    {styling.icon}
                  </div>

                  <div className="flex min-w-0 flex-col">
                    <h3 className="max-w-[140px] truncate text-[14px] font-semibold leading-[20px] text-[#1E1E1E]">
                      {subjectName}
                    </h3>

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
                  <ArrowRight
                    size={22}
                    strokeWidth={1.8}
                    className="text-[#4A4A4A]"
                  />
                </button>
              </div>
            );
          })
        ) : (
          <div className="mb-4 mt-6 text-center text-sm text-gray-500">
            No {activeTab.toLowerCase()} assignments!
          </div>
        )}
      </div>
    </div>
  );
};

export default Homework;