import React, { useState } from "react";
import AdminSidebar from "../../../components/Admin/sidebar";
import AdminNavbar from "../../../components/Admin/Navbar";
import AdminMarksTableCard from "../../../components/Admin/Academics/Results/AdminMarksTableCard";
import AdminLargeGraphCard from "../../../components/Admin/Academics/Results/AdminLargeGraphCard";
import AdminResultStatsCard from "../../../components/Admin/Academics/Results/AdminResultStatsCard";
import AdminFailedAbsentCard from "../../../components/Admin/Academics/Results/AdminFailedAbsentCard";
import AdminTopPerformersCard from "../../../components/Admin/Academics/Results/AdminTopPerformersCard";
import AdminGraphCardSidebar from "../../../components/Admin/Academics/Results/AdminGraphCardSidebar";

const AdminResults: React.FC = () => {
  const [viewMode, setViewMode] = useState<"table" | "graph">("table");
  const [selectedSubject, setSelectedSubject] = useState<string>("English");

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    if (subject === "All Subjects") {
      setViewMode("graph");
    } else {
      setViewMode("table");
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* 1. Sidebar navigation */}
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 2. Top Navbar */}
        <AdminNavbar />

        {/* 3. Main Work Area */}
        <main className="flex-1 flex flex-col overflow-hidden p-6">
          <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full h-full">
            
            {/* Header */}
            <div className="shrink-0 flex items-start justify-between">
              <div>
                <h1 className="text-[28px] font-bold text-gray-800 leading-tight">
                  Results Management
                </h1>
                <p className="text-sm font-semibold text-gray-400 mt-1">
                  Today is 3rd June, 2026
                </p>
              </div>
              {viewMode === "graph" && (
                <button
                  onClick={() => {
                    setViewMode("table");
                    setSelectedSubject("English");
                  }}
                  className="px-4 py-2 bg-[#4285F4] text-white hover:bg-[#357AE8] text-[13px] font-bold rounded-full shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer"
                >
                  &larr; View Table
                </button>
              )}
            </div>

            {/* Split Columns Section (Scrollable Columns) */}
            <div className="flex-1 flex gap-8 items-start w-full overflow-hidden">
              {/* Left Column (Table / Large Graph) */}
              <div className="flex-1 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6">
                {viewMode === "table" ? (
                  <AdminMarksTableCard 
                    selectedSubject={selectedSubject}
                    onSubjectChange={handleSubjectChange}
                  />
                ) : (
                  <AdminLargeGraphCard 
                    selectedSubject={selectedSubject}
                    onSubjectChange={handleSubjectChange}
                  />
                )}
              </div>

              {/* Right Column (Floating Cards) */}
              <div className="w-[360px] shrink-0 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6 flex flex-col gap-6">
                <AdminResultStatsCard />
                <AdminFailedAbsentCard viewMode={viewMode} />
                <AdminTopPerformersCard viewMode={viewMode} />
                
                {viewMode === "table" && (
                  <AdminGraphCardSidebar onClick={() => {
                    setViewMode("graph");
                    setSelectedSubject("All Subjects");
                  }} />
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminResults;
