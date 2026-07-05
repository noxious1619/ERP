import React from "react";
import Navbar from "../../components/Student/Dashboard/Navbar";
import ResultTable from "../../components/Student/Result/ResultTable";
import ResultAnalysisChart from "../../components/Student/Result/ResultAnalysisChart";
import ResultSidebar from "../../components/Student/Result/ResultSidebar";

const StudentResults: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      {/* 1. Main Student Sidebar Navigation */}
      <Navbar />

      {/* 2. Main Page Content wrapper */}
      <div className="flex flex-1 h-screen overflow-hidden">
        
        {/* Left Column (Main Result Sheets and Graphs) */}
        <div className="flex-1 flex flex-col px-10 pt-8 pb-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[44px] font-bold leading-[64px] tracking-[-2px] text-[#2D3335]">
              Results
            </h1>
            <p className="text-sm font-semibold text-gray-400 mt-1">
              Today is Thursday, 22nd Aug
            </p>
          </div>

          {/* Result Widgets */}
          <div className="flex flex-col gap-8">
            {/* Table Box */}
            <ResultTable />

            {/* Analysis Chart Box */}
            <ResultAnalysisChart />
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="w-[360px] border-l border-[#EAECF0] bg-white shrink-0 h-screen overflow-y-auto px-6 py-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ResultSidebar />
        </div>

      </div>
    </div>
  );
};

export default StudentResults;
