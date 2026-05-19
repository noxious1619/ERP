import { useState } from "react";
import Navbar from "../../components/Student/Dashboard/Navbar";
import HomeworkHeader from "../../components/Student/Homework/HomeworkHeader";
import StatusCard from "../../components/Student/Homework/StatusCard";
import HomeworkFilters from "../../components/Student/Homework/HomeworkFilters";
import HomeworkTaskList from "../../components/Student/Homework/HomeworkTaskList";
import WeeklyProgressCard from "../../components/Student/Homework/WeeklyProgressCard";
import UpcomingDeadlinesCard from "../../components/Student/Homework/DeadlinesCard";

const Homework = () => {
  const [showDeadlines, setShowDeadlines] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="sticky top-0 h-screen shrink-0">
        <Navbar />
      </div>
      {/* MAIN CONTENT + SIDEBAR WRAPPER */}
      <div className="flex flex-1 min-w-0  ">
        {/* LEFT CONTENT AREA — natural page scroll, no inner scrollbar */}
        <div className="flex-1 px-10 py-10 min-w-0">
          <HomeworkHeader />
          <div className="mt-10">
            <HomeworkFilters />
            <HomeworkTaskList />
          </div>
        </div>
        {/* RIGHT SIDEBAR — fixed to viewport, scrollable only if content overflows, no scrollbar visible */}
        <div
          className="w-[360px] shrink-0 bg-gray-100 "
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          <style>{`
            .sidebar-hidden-scroll::-webkit-scrollbar { display: none; }
          `}</style>

          <div className="sidebar-hidden-scroll h-full overflow-y-auto py-4 px-6">
            <div className="flex flex-col gap-6 ">
              <WeeklyProgressCard />

              {!showDeadlines ? (
                <StatusCard onOpenDeadlines={() => setShowDeadlines(true)} />
              ) : (
                <UpcomingDeadlinesCard onBack={() => setShowDeadlines(false)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homework;
