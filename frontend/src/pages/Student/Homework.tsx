import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Student/Dashboard/Navbar";
import HomeworkHeader from "../../components/Student/Homework/HomeworkHeader";
import StatusCard from "../../components/Student/Homework/StatusCard";
import HomeworkFilters from "../../components/Student/Homework/HomeworkFilters";
import HomeworkTaskList from "../../components/Student/Homework/HomeworkTaskList";
import WeeklyProgressCard from "../../components/Student/Homework/WeeklyProgressCard";
import DeadlinesCard from "../../components/Student/Homework/DeadlinesCard";

const Homework = () => {
  const [showDeadlines, setShowDeadlines] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeworkFeed = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await axios.get("http://localhost:5000/api/assignments/my-feed", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setTasks(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching student homework feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworkFeed();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="sticky top-0 h-screen shrink-0">
        <Navbar />
      </div>

      {/* MAIN CONTENT + SIDEBAR WRAPPER */}
      <div className="flex flex-1 min-w-0">
        {/* LEFT CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          
          {/* STICKY HEADER + FILTERS */}
          <div className="sticky top-0 z-10 bg-gray-50 px-10 pt-10 pb-4">
            <HomeworkHeader />
            <div className="mt-6">
              <HomeworkFilters />
            </div>
          </div>

          {/* SCROLLABLE TASK LIST ONLY */}
          <div className="flex-1 overflow-y-auto px-10 pb-10" style={{ scrollbarWidth: "none" }}>
            <style>{`.task-scroll::-webkit-scrollbar { display: none; }`}</style>
            <div className="task-scroll">
              {loading ? (
                <div className="flex items-center justify-center h-40 text-gray-500 font-medium">
                  Loading assignments...
                </div>
              ) : (
                <HomeworkTaskList tasks={tasks} />
              )}
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div
          className="w-[360px] shrink-0 bg-gray-100"
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          <style>{`.sidebar-hidden-scroll::-webkit-scrollbar { display: none; }`}</style>
          <div className="sidebar-hidden-scroll h-full overflow-y-auto py-4 px-6">
            <div className="flex flex-col gap-6">
              <WeeklyProgressCard />
              {!showDeadlines ? (
                <StatusCard onOpenDeadlines={() => setShowDeadlines(true)} />
              ) : (
                <DeadlinesCard onBack={() => setShowDeadlines(false)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homework;