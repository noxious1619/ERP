import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Navbar from "../../components/Student/Dashboard/Navbar";
import HomeworkHeader from "../../components/Student/Homework/HomeworkHeader";
// import StatusCard from "../../components/Student/Homework/StatusCard";
import HomeworkFilters from "../../components/Student/Homework/HomeworkFilters";
import HomeworkTaskList from "../../components/Student/Homework/HomeworkTaskList";
// import WeeklyProgressCard from "../../components/Student/Homework/WeeklyProgressCard";
// import DeadlinesCard from "../../components/Student/Homework/DeadlinesCard";

const Homework = () => {
  const { studentData, } = useAuth();
  // const [showDeadlines, setShowDeadlines] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. New State for Filters & Pagination
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  console.log("Current user:", studentData);

  useEffect(() => {
    const fetchHomeworkFeed = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); 
        
        // 2. Format the status filter (skip sending if "All")
        const statusQuery = activeTab === "All" ? "" : `&status=${activeTab.toUpperCase()}`;
        
        // 3. Dynamic API URL with pagination and filters
        const response = await axios.get(
          `http://localhost:5000/api/assignments/my-feed?page=${currentPage}&limit=10${statusQuery}`, 
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.data.success) {
          // console.log("Fetched student homework feed:", response.data);
          setTasks(response.data.data);
          // 4. Save the total pages from your new backend pagination object
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.totalPages);
          }
        }
      } catch (error) {
        console.error("Error fetching student homework feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeworkFeed();
  }, [activeTab, currentPage]); // Re-run whenever tab or page changes

  // 5. Handler for when a user clicks a tab
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // Always reset to page 1 when switching tabs!
  };

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
              {/* Pass the state and handler to the filter component */}
              <HomeworkFilters 
                activeTab={activeTab} 
                onTabChange={handleTabChange} 
              />
            </div>
          </div>

          {/* SCROLLABLE TASK LIST ONLY */}
          <div className="flex-1 overflow-y-auto px-10 pb-10" style={{ scrollbarWidth: "none" }}>
            <style>{`.task-scroll::-webkit-scrollbar { display: none; }`}</style>
            <div className="task-scroll pb-10">
              {loading ? (
                <div className="flex items-center justify-center h-40 text-gray-500 font-medium">
                  Loading assignments...
                </div>
              ) : tasks.length === 0 ? (
                 <div className="flex items-center justify-center h-40 text-gray-500 font-medium bg-white rounded-[24px] border border-dashed border-gray-300">
                  No {activeTab !== "All" ? activeTab.toLowerCase() : ""} assignments found.
                </div>
              ) : (
                <>
                  <HomeworkTaskList tasks={tasks} />
                  
                  {/* PAGINATION CONTROLS */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-5 py-2 text-sm font-medium text-[#171B7A] bg-[#EEF0FF] rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Previous
                      </button>
                      <span className="text-sm font-medium text-gray-500">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-5 py-2 text-sm font-medium text-[#171B7A] bg-[#EEF0FF] rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        {/* <div
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
              <StatusCard onOpenDeadlines={() => setShowDeadlines(true)} />              
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Homework;