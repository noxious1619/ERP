import { useState } from "react";
import sigmaIcon from "../../../../assets/Student/Homework/physics.svg";
import attachmentIcon from "../../../../assets/Student/Homework/attachment.svg";
import { useNavigate } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TeacherHomeworkTask {
  id: number;
  icon: string;
  title: string;
  subject: string;
  classLabel: string;
  attachments: string;
  dueBadge: string;
  dueBadgeClass: string;
  isFirstCard?: boolean; // first card gets "Check" label instead of "View Details"
}

// ─── Task data ────────────────────────────────────────────────────────────────

const tasks: TeacherHomeworkTask[] = [
  {
    id: 1,
    icon: sigmaIcon,
    title: "Quantum Mechanics Problem Set",
    subject: "Physics",
    classLabel: "Class X",
    attachments: "2 attachments",
    dueBadge: "27TH MAY",
    dueBadgeClass: "bg-[#E1FFD0] text-[#44A80D]",
    isFirstCard: true,
  },
  {
    id: 2,
    icon: sigmaIcon,
    title: "Motion of Objects",
    subject: "Physics",
    classLabel: "Class X",
    attachments: "1 attachment",
    dueBadge: "TODAY",
    dueBadgeClass: "bg-[#FEE3E7] text-[#A8364B]",
  },
  {
    id: 3,
    icon: sigmaIcon,
    title: "Force and Newton's Laws",
    subject: "Physics",
    classLabel: "Class X",
    attachments: "No attachments",
    dueBadge: "29TH MAY",
    dueBadgeClass: "bg-[#ECF5FC] text-[#4285F4]",
  },
  {
    id: 4,
    icon: sigmaIcon,
    title: "Heat and Temperature",
    subject: "Physics",
    classLabel: "Class X",
    attachments: "1 attachment",
    dueBadge: "30TH MAY",
    dueBadgeClass: "bg-[#F1F4F5] text-[#5A6062]",
  },
  {
    id: 5,
    icon: sigmaIcon,
    title: "Heat and Temperature",
    subject: "Physics",
    classLabel: "Class X",
    attachments: "1 attachment",
    dueBadge: "30TH MAY",
    dueBadgeClass: "bg-[#F1F4F5] text-[#5A6062]",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const TeacherHomeworkTaskList = () => {
  const [activeEdit, setActiveEdit] = useState<number | null>(null);
  const navigate = useNavigate();
  return (
    <div className="mt-3 flex w-full flex-col gap-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`
            flex min-h-[88px] items-center justify-between
            rounded-[22px] bg-white px-6
            shadow-[0px_2px_10px_rgba(0,0,0,0.05)]
            ${task.isFirstCard ? "border border-blue-200" : ""}
          `}
        >
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#F4EFFB]">
              <img
                src={task.icon}
                alt={task.subject}
                className="h-[20px] w-[20px]"
              />
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-[14px] font-bold text-gray-800">
                  {task.title}
                </h3>
                <span
                  className={`rounded-full px-3 py-[3px] text-[11px] font-semibold tracking-[0.4px] ${task.dueBadgeClass}`}
                >
                  {task.dueBadge}
                </span>
              </div>
              <p className="mt-[3px] text-zinc-500 text-[13px] flex items-center gap-1">
                {task.classLabel} •
                <img
                  src={attachmentIcon}
                  alt=""
                  className="h-[13px] w-[13px]"
                />
                {task.attachments}
              </p>
            </div>
          </div>

          {/* RIGHT — View Details / Check + Edit */}
          <div className="flex items-center gap-12 shrink-0">
            <button
              onClick={() => navigate("/teacher/homework/viewdetail")}
              className="text-[13px] font-semibold text-[#090958] hover:text-[#4F52A3] transition-colors cursor-pointer whitespace-nowrap"
            >
              {task.isFirstCard ? "Check" : "View Details"}
            </button>

            <button
              onClick={() =>
                setActiveEdit(activeEdit === task.id ? null : task.id)
              }
              className={`
                rounded-full px-6 py-[8px] text-[13px] font-semibold
                transition-all duration-150 cursor-pointer
                ${
                  task.isFirstCard
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#4285F4] text-white hover:bg-[#3a3d8a]"
                }
              `}
              disabled={task.isFirstCard}
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeacherHomeworkTaskList;
