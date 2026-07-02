import { useNavigate } from "react-router-dom";
import sigmaIcon from "../../../../assets/Student/Homework/physics.svg";
import attachmentIcon from "../../../../assets/Student/Homework/attachment.svg";
import type { AssignmentCard } from "../../../../hooks/useAssignmentList";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDueDate = (
  dateStr: string,
): { label: string; colorClass: string } => {
  const due = new Date(dateStr);
  const now = new Date();

  // Strip time for day comparison
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = dueDay.getTime() - today.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays === 0) {
    return { label: "TODAY", colorClass: "bg-[#FEE3E7] text-[#A8364B]" };
  }
  if (diffDays < 0) {
    return { label: "OVERDUE", colorClass: "bg-[#FEE3E7] text-[#A8364B]" };
  }

  const label = due
    .toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    .toUpperCase(); // e.g. "27 MAY"

  if (diffDays <= 2) {
    return { label, colorClass: "bg-[#FFF3CD] text-[#A07000]" };
  }
  if (diffDays <= 7) {
    return { label, colorClass: "bg-[#ECF5FC] text-[#4285F4]" };
  }
  return { label, colorClass: "bg-[#E1FFD0] text-[#44A80D]" };
};

const attachmentLabel = (count: number): string => {
  if (count === 0) return "No attachments";
  if (count === 1) return "1 attachment";
  return `${count} attachments`;
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="flex min-h-[88px] items-center justify-between rounded-[22px] bg-white px-6 shadow-[0px_2px_10px_rgba(0,0,0,0.05)] animate-pulse">
    <div className="flex items-center gap-4">
      <div className="h-[46px] w-[46px] rounded-full bg-gray-200" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-48 rounded bg-gray-200" />
        <div className="h-3 w-32 rounded bg-gray-100" />
      </div>
    </div>
    <div className="flex items-center gap-12">
      <div className="h-4 w-20 rounded bg-gray-200" />
      <div className="h-9 w-16 rounded-full bg-gray-200" />
    </div>
  </div>
);

// ─── Props ────────────────────────────────────────────────────────────────────

interface TeacherHomeworkTaskListProps {
  assignments: AssignmentCard[];
  loading: boolean;
  error: string | null;
  onEditClick: (task: AssignmentCard) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const TeacherHomeworkTaskList = ({
  assignments,
  loading,
  error,
  onEditClick,
}: TeacherHomeworkTaskListProps) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="mt-3 flex w-full flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-3 flex items-center justify-center rounded-[22px] bg-white py-16 shadow-[0px_2px_10px_rgba(0,0,0,0.05)]">
        <p className="text-[14px] text-red-400">{error}</p>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="mt-3 flex items-center justify-center rounded-[22px] bg-white py-16 shadow-[0px_2px_10px_rgba(0,0,0,0.05)]">
        <p className="text-[14px] text-gray-400">No assignments found.</p>
      </div>
    );
  }

  return (
    <div className="mt-3 flex w-full flex-col gap-4">
      {assignments.map((task) => {
        const { label, colorClass } = formatDueDate(task.dueDate);

        return (
          <div
            key={task.id}
            className="
              flex min-h-[88px] items-center justify-between
              rounded-[22px] bg-white px-6
              shadow-[0px_2px_10px_rgba(0,0,0,0.05)]
            "
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#F4EFFB]">
                <img
                  src={sigmaIcon}
                  alt={task.subject.name}
                  className="h-[20px] w-[20px]"
                />
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-[14px] font-bold text-gray-800">
                    {task.title}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-[3px] text-[11px] font-semibold tracking-[0.4px] ${colorClass}`}
                  >
                    {label}
                  </span>
                </div>
                <p className="mt-[3px] text-zinc-500 text-[13px] flex items-center gap-1">
                  {task.class.name}
                  {task.section ? ` · ${task.section.name}` : ""} •
                  <img
                    src={attachmentIcon}
                    alt=""
                    className="h-[13px] w-[13px]"
                  />
                  {attachmentLabel(task.attachmentCount)}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-12 shrink-0">
              <button
                onClick={() => navigate(`/teacher/homework/${task.id}`)}
                className="text-[13px] font-semibold text-[#090958] hover:text-[#4F52A3] transition-colors cursor-pointer whitespace-nowrap"
              >
                View Details
              </button>

              <button
                onClick={() => onEditClick(task)}
                className="
                  rounded-full px-6 py-[8px] text-[13px] font-semibold
                  transition-all duration-150 cursor-pointer
                  bg-[#4285F4] text-white hover:bg-[#3a3d8a]
                "
              >
                Edit
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TeacherHomeworkTaskList;
