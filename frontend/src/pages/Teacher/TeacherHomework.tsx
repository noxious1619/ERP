import { useState } from "react";
import Navbar from "../../components/Teacher/Dashboard/Navbar";
import HomeworkHeader from "../../components/Student/Homework/HomeworkHeader";
import TeacherHomeworkFilters from "../../components/Teacher/Homework/HomeworkManagment/TeacherHomeworkFilters";
import TeacherHomeworkTaskList from "../../components/Teacher/Homework/HomeworkManagment/TeacherHomeworkTaskList";
import TeacherHomeworkSidebar from "../../components/Teacher/Homework/HomeworkManagment/TeacherHomeworkSidebar";
import CreateAssignmentForm from "../../components/Teacher/Homework/HomeworkManagment/CreateAssignmentForm";
import useAuth from "../../hooks/useAuth";
import useAssignmentList from "../../hooks/useAssignmentList";

// ─── Filter state shape (Updated) ─────────────────────────────────────────────
interface Filters {
  classId: string;
  sectionId: string;
  subjectId: string; // Added subject filtering
  date: "today" | "all";
}

const TeacherHomework = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<AssignmentCard | null>(null);
  const { teacherData, loading: authLoading } = useAuth();

  const [filters, setFilters] = useState<Filters>({
    classId: "",
    sectionId: "",
    subjectId: "",
    date: "today",
  });

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // ── Fetch assignments whenever filters or page change ─────────────────────
  // Make sure your useAssignmentList hook can accept the new subjectId parameter
  const { assignments, pagination, loading, error, refetch } = useAssignmentList({
    classId: filters.classId,
    sectionId: filters.sectionId,
    subjectId: filters.subjectId, 
    date: filters.date,
    page,
    pageSize: PAGE_SIZE,
  });

  const handleFilterChange = (newFilters: Filters) => {
    setPage(1); // reset to first page on filter change
    setFilters(newFilters);
  };

  return (
    <>
      <div className="flex min-h-screen bg-[#F8F9FE]">
        <Navbar />

        <div className="flex flex-1 min-w-0 overflow-hidden">
          {/* Left Content */}
          <div
            className="
              flex flex-col flex-1 min-w-0 h-screen overflow-y-auto
              [&::-webkit-scrollbar]:hidden
              [-ms-overflow-style:none]
              [scrollbar-width:none]
            "
          >
            {/* Header + Filters */}
            <div
              className={`
                bg-[#F8F9FE] px-10 pt-4
                ${!openModal && !editingAssignment ? "sticky top-0 z-20" : ""}
              `}
            >
              <HomeworkHeader
                title="Homework &nbsp;Management"
                profileRoute="/teacher/profile"
              />

              <div className="mt-8">
                {/* Pass teachingAssignments to drive the dropdowns dynamically */}
                {!authLoading && (
                  <TeacherHomeworkFilters
                    teachingAssignments={teacherData?.teachingAssignments ?? []}
                    onFilterChange={handleFilterChange}
                  />
                )}
              </div>
            </div>

            {/* Task List */}
            <div className="px-10 pb-10 mt-6">
              <TeacherHomeworkTaskList
                assignments={assignments}
                loading={loading || authLoading}
                error={error}
                onEditClick={(task) => setEditingAssignment(task)}
              />

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-full border border-[#EAECF0] text-[13px] font-medium text-[#344054] disabled:opacity-40 hover:bg-gray-50 cursor-pointer"
                  >
                    Previous
                  </button>

                  <span className="text-[13px] text-gray-500">
                    Page {page} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 rounded-full border border-[#EAECF0] text-[13px] font-medium text-[#344054] disabled:opacity-40 hover:bg-gray-50 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div
            className="
              w-[380px] shrink-0 h-screen sticky top-0
              overflow-y-auto px-6 pt-4 pb-10
              [&::-webkit-scrollbar]:hidden
              [-ms-overflow-style:none]
              [scrollbar-width:none]
            "
          >
            <TeacherHomeworkSidebar
              onCreateAssignment={() => setOpenModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <CreateAssignmentForm
        open={openModal || !!editingAssignment}
        editingAssignment={editingAssignment}
        teachingAssignments={teacherData?.teachingAssignments ?? []}
        onClose={() => {
          setOpenModal(false);
          setEditingAssignment(null);
          refetch();
        }}
      />
    </>
  );
};

export default TeacherHomework;