import React from "react";
import { UserCheck, BookOpen, ClipboardList, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Each action: icon (with its accent color), label, and where it navigates
interface QuickAction {
  icon: React.ReactNode;
  label: string;
  href: string;
  Bg: string;
}

const ACTIONS: QuickAction[] = [
  {
    icon: <UserCheck size={18} className="text-blue-600" />,
    label: "Mark Attendance",
    href: "/teacher/attendance",
    Bg: "bg-blue-50",
  },
  {
    icon: <BookOpen size={18} className="text-green-600" />,
    label: "Assign Homework",
    href: "/teacher/homework",
    Bg: "bg-green-600/5",
  },
  {
    icon: <ClipboardList size={18} className="text-red-500" />,
    label: "View Datesheet",
    href: "/teacher/exams",
    Bg: "bg-pink-800/5",
  },
  {
    icon: <Bell size={18} className="text-purple-600" />,
    label: "Create Notice",
    href: "/teacher/notices",
    Bg: "bg-neutral-500/5 ",
  },
];

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl bg-white border-2 border-dashed border-blue-200 px-5 py-5 w-full flex flex-col gap-4">
      {/* Header */}
      <p className="text-[11px] font-bold tracking-[0.12em] text-gray-400 uppercase text-center">
        Quick Actions
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.href)}
            className={`flex items-center justify-between rounded-2xl ${action.Bg} px-4 py-3 hover:bg-gray-100 active:scale-[0.98] transition-all duration-150 cursor-pointer group`}
          >
            {/* Left: icon + label */}
            <div className="flex items-center gap-3">
              <div
                className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full `}
              >
                {action.icon}
              </div>
              <span className="text-[14px] font-semibold text-[#1E1E1E]">
                {action.label}
              </span>
            </div>

            {/* Right: plus button */}
            <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white group-hover:border-blue-300 transition-colors">
              <span className="text-gray-400 text-[14px] leading-none group-hover:text-blue-500 transition-colors mt-2 mb-3 ml-2 mr-2">
                +
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
