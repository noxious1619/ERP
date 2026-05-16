import Navbar from "../../components/Student/Dashboard/Navbar";
import HomeworkHeader from "../../components/Student/Homework/HomeworkHeader";
import StatusCards from "../../components/Student/Homework/StatusCard";
import HomeworkFilters from "../../components/Student/Homework/HomeworkFilters";
import HomeworkTaskList from "../../components/Student/Homework/HomeworkTaskList";
import WeeklyProgressCard from "../../components/Student/Homework/WeeklyProgressCard";
import UpcomingDeadlinesCard from "../../components/Student/Homework/DeadlinesCard";

const Homework = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />

      {/* FULL PAGE CONTENT */}
      <div className="flex-1 px-10 py-10 min-w-0 h-screen overflow-y-auto">
        {/* HEADER */}
        <HomeworkHeader />

        {/* CONTENT AREA */}
        <div className="mt-10 flex gap-10">
          {/* LEFT SECTION */}
          <div className="flex-1">
            <StatusCards />

            <HomeworkFilters />

            <HomeworkTaskList />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-[390px] shrink-0 bg-gray-100 py-10 px-6 ">
            <div className="flex flex-col gap-8">
              <WeeklyProgressCard />
              <UpcomingDeadlinesCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homework;
