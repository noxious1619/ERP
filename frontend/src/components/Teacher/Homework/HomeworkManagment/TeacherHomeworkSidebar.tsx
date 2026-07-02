import { Plus } from "lucide-react";
// import TeacherStatsCard from "../../Homework/HomeworkManagment/TeacherStatsCard";
// import DailyAssignmentUpdates from "../../Homework/HomeworkManagment/DailyAssignmentUpdates";
interface TeacherHomeworkSidebarProps {
  onCreateAssignment: () => void;
}
const TeacherHomeworkSidebar = ({
  onCreateAssignment,
}: TeacherHomeworkSidebarProps) => {
  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={onCreateAssignment}
        className="
          h-[56px]
          rounded-full
          bg-[#4D8DFF]
          text-white
          text-[16px]
          font-semibold
          flex items-center
          justify-center
          gap-3
          shadow-md
          w-full
          mt-6
          cursor-pointer
        "
      >
        Create Assignment
        <div className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center">
          <Plus size={14} />
        </div>
      </button>

      {/* <TeacherStatsCard /> */}
      {/* <DailyAssignmentUpdates /> */}
    </div>
  );
};

export default TeacherHomeworkSidebar;
