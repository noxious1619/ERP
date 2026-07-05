import React from "react";
import { Search, Bell } from "lucide-react";
import TeacherNavbar from "../../components/Teacher/Dashboard/Navbar";
import TeacherMarksEntryCard from "../../components/Teacher/Result/TeacherMarksEntryCard";
import TeacherResultStatsCard from "../../components/Teacher/Result/TeacherResultStatsCard";
import TeacherTopPerformersCard from "../../components/Teacher/Result/TeacherTopPerformersCard";
import TeacherFailedAbsentCard from "../../components/Teacher/Result/TeacherFailedAbsentCard";
import TeacherSubjectComparisonCard from "../../components/Teacher/Result/TeacherSubjectComparisonCard";
import defaultProfile from "../../assets/Student/Timetable/Header/profile.png";

const TeacherResults: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      {/* 1. Sidebar Navigation */}
      <TeacherNavbar />

      {/* 2. Main Page Content Non-Scrollable Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Unified Top Header (Fixed/Shrink-0) */}
        <div className="flex items-start justify-between px-10 pt-8 pb-4 shrink-0">
          <div>
            <h1 className="text-[44px] font-bold leading-[64px] tracking-[-2px] text-[#2D3335]">
              Result & Marks Entry
            </h1>
            <p className="text-sm font-semibold text-gray-400 mt-1">
              Today is 30th May, 2026
            </p>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-10 pt-3">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Search className="w-6 h-6 text-[#8A92A6]" />
            </button>
            
            <div className="relative">
              <button className="relative flex items-center justify-center cursor-pointer">
                <Bell className="w-6 h-6 text-[#8A92A6]" />
                <span className="absolute right-[1px] top-[2px] h-[9px] w-[9px] rounded-full bg-[#E54866]" />
              </button>
            </div>

            {/* Profile Avatar */}
            <div className="h-[52px] w-[52px] overflow-hidden rounded-full border-[3px] border-white shadow-[0px_4px_14px_rgba(0,0,0,0.12)]">
              <img 
                src={defaultProfile} 
                alt="Teacher Profile" 
                className="h-full w-full object-cover" 
              />
            </div>
          </div>
        </div>

        {/* Split Columns Section (Scrollable Columns) */}
        <div className="flex-1 flex gap-8 items-start w-full px-10 pb-10 overflow-hidden">
          {/* Left Column (Table) */}
          <div className="flex-1 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6">
            <TeacherMarksEntryCard />
          </div>

          {/* Right Column (Floating Cards) */}
          <div className="w-[360px] shrink-0 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6 flex flex-col gap-6">
            <TeacherResultStatsCard />
            <TeacherTopPerformersCard />
            <TeacherFailedAbsentCard />
            <TeacherSubjectComparisonCard />
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherResults;
