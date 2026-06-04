import { useState } from "react";
import Navbar from "../../components/Teacher/Dashboard/Navbar";
import HomeworkHeader from "../../components/Student/Homework/HomeworkHeader";
import TeacherHomeworkFilters from "../../components/Teacher/Homework/HomeworkManagment/TeacherHomeworkFilters";
import TeacherHomeworkTaskList from "../../components/Teacher/Homework/HomeworkManagment/TeacherHomeworkTaskList";
import TeacherHomeworkSidebar from "../../components/Teacher/Homework/HomeworkManagment/TeacherHomeworkSidebar";
import CreateAssignmentForm from "../../components/Teacher/Homework/HomeworkManagment/CreateAssignmentForm";

const TeacherHomework = () => {
  const [openModal, setOpenModal] = useState(false);

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
                ${!openModal ? "sticky top-0 z-20" : ""}
              `}
            >
              <HomeworkHeader
                title="Homework &nbsp;Management"
                profileRoute="/teacher/profile"
              />

              <div className="mt-8">
                <TeacherHomeworkFilters />
              </div>
            </div>

            {/* Task List */}
            <div className="px-10 pb-10 mt-6">
              <TeacherHomeworkTaskList />
            </div>
          </div>

          {/* Sidebar */}
          <div
            className="
              w-[380px]
              shrink-0
              h-screen
              sticky
              top-0
              overflow-y-auto
              px-6
              pt-4
              pb-10
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
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
};

export default TeacherHomework;
