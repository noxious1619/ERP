import React from "react";

const AdminResultStatsCard: React.FC = () => {
  return (
    <div className="bg-white rounded-[24px] border border-[#EAECF0] p-5 shadow-sm flex items-center justify-between w-full">
      {/* Metrics Labels */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#4D8DFF]" />
          <span className="text-[14px] font-bold text-[#4D8DFF]">37 Pass</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D92D20]" />
          <span className="text-[14px] font-bold text-[#D92D20]">3 Fail</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#181D27]" />
          <span className="text-[14px] font-bold text-[#181D27]">2 Absent</span>
        </div>
      </div>

      {/* SVG Donut Chart */}
      <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
          {/* Base circle background */}
          <circle
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke="#F2F4F7"
            strokeWidth="3"
          />

          {/* Pass Section (80%) - Blue */}
          <circle
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke="#4D8DFF"
            strokeWidth="3"
            strokeDasharray="80 20"
            strokeDashoffset="0"
          />

          {/* Fail Section (10%) - Red */}
          <circle
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke="#D92D20"
            strokeWidth="3"
            strokeDasharray="10 90"
            strokeDashoffset="-80"
          />

          {/* Absent Section (10%) - Black */}
          <circle
            cx="21"
            cy="21"
            r="15.91549430918954"
            fill="transparent"
            stroke="#181D27"
            strokeWidth="3"
            strokeDasharray="10 90"
            strokeDashoffset="-90"
          />
        </svg>

        {/* Centered text in donut hole */}
        <div className="absolute flex flex-col items-center justify-center leading-none text-center">
          <span className="text-[20px] font-extrabold text-gray-800">80%</span>
          <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Result</span>
        </div>
      </div>
    </div>
  );
};

export default AdminResultStatsCard;
