import { useState } from "react";
import sigmaIcon from "../../../assets/Student/Homework/physics.svg";
import biologyIcon from "../../../assets/Student/Homework/biology.svg";
import chemistryIcon from "../../../assets/Student/Homework/chemistry.svg";
import attachment from "../../../assets/Student/Homework/attachment.svg";

// 🎯 Tip: Import your Java or general computer science SVG asset here
// import javaIcon from "../../../assets/Student/Homework/java.svg"; 

import ViewDetailSidebar from "./ViewDetailSidebar";
import type { HomeworkTask } from "./ViewDetailSidebar";

// Dynamic Icon Registry Map based on normalized subject names from your database
const iconMap: Record<string, string> = {
  Physics: sigmaIcon,
  Biology: biologyIcon,
  Chemistry: chemistryIcon,
  Java: sigmaIcon, // Temporary fallback to sigmaIcon until you link a custom Java icon!
};

interface HomeworkTaskListProps {
  tasks: HomeworkTask[];
}

const HomeworkTaskList = ({ tasks }: HomeworkTaskListProps) => {
  const [selectedTask, setSelectedTask] = useState<HomeworkTask | null>(null);

  if (tasks.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center rounded-[26px] bg-white p-10 text-center shadow-[0px_4px_12px_rgba(0,0,0,0.04)]">
        <p className="text-gray-500 font-medium">No homework or tasks found for your section.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-3 flex w-full flex-col gap-5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="
              flex h-[96px] items-center justify-between
              rounded-[26px] bg-white px-6
              shadow-[0px_4px_12px_rgba(0,0,0,0.04)]
            "
          >
            {/* LEFT */}
            <div className="flex items-center gap-5">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#F4EFFB]">
                <img
                  src={iconMap[task.subject] || sigmaIcon} // Dynamic lookup or fallback
                  alt={task.subject}
                  className="h-[22px] w-[22px]"
                />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-[14px] font-bold text-gray-800">
                    {task.title}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-[4px] text-[11px] font-semibold tracking-[0.5px] ${task.statusClass}`}
                  >
                    {task.status}
                  </span>
                </div>
                <p className="mt-[4px] text-zinc-600 text-sm flex items-center gap-1">
                  {task.subject} •
                  <img src={attachment} alt="" className="h-[14px] w-[14px]" />
                  {task.attachments}
                </p>
              </div>
            </div>
            

            {/* RIGHT — View Details button */}
            <button
              onClick={() => setSelectedTask(task)}
              className="text-[14px] font-semibold text-[#090958] hover:text-[#4F52A3] transition-colors cursor-pointer"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      <ViewDetailSidebar
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </>
  );
};

export default HomeworkTaskList;