import React from "react";
import { Bell, HelpCircle, Settings, FileText, Download } from "lucide-react";

const ResultSidebar: React.FC = () => {
  // Calendar dates mapping for August 2026
  // Mo Tu We Th Fr Sa Su
  // 28 29 30  1  2  3  4
  //  5  6  7  8  9 10 11
  // 12 13 14 15 16 17 18
  // 19 20 21 22 23 24 25
  const calendarDays = [
    { day: 28, isCurrentMonth: false },
    { day: 29, isCurrentMonth: false },
    { day: 30, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true, isExamWeek: true },
    { day: 6, isCurrentMonth: true, isExamWeek: true },
    { day: 7, isCurrentMonth: true, isExamWeek: true },
    { day: 8, isCurrentMonth: true, isExamWeek: true },
    { day: 9, isCurrentMonth: true, isExamWeek: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true, isExamWeek: true },
    { day: 13, isCurrentMonth: true, isExamWeek: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true, isActive: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Header Control Icons */}
      <div className="flex items-center justify-end gap-4 text-gray-400">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-[#8A92A6]" />
          <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-bold text-white leading-none">
            2
          </span>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <HelpCircle className="w-5 h-5 text-[#8A92A6]" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Settings className="w-5 h-5 text-[#8A92A6]" />
        </button>
      </div>

      {/* 2. Custom Calendar Card */}
      <div className="bg-white rounded-[24px] border border-[#EAECF0] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[15px] font-bold text-gray-800">August 2026</span>
          <div className="flex gap-3 text-gray-400">
            <button className="hover:text-gray-600 font-bold text-sm">{"<"}</button>
            <button className="hover:text-gray-600 font-bold text-sm">{">"}</button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center text-[10px] font-bold text-[#8A92A6] mb-3 uppercase tracking-wider">
          <span>MO</span>
          <span>TU</span>
          <span>WE</span>
          <span>TH</span>
          <span>FR</span>
          <span>SA</span>
          <span>SU</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-2 text-center text-[13px]">
          {calendarDays.map((d, i) => {
            let cellStyle = "text-gray-700 font-medium";
            if (!d.isCurrentMonth) {
              cellStyle = "text-gray-300";
            }

            if (d.isActive) {
              cellStyle = "bg-[#4D8DFF] text-white rounded-full font-bold";
            } else if (d.isExamWeek) {
              cellStyle = "bg-[#EEF3FF] text-[#4D8DFF] rounded-full font-semibold";
            }

            return (
              <div 
                key={i} 
                className="aspect-square flex items-center justify-center"
              >
                <span className={`w-8 h-8 flex items-center justify-center text-[13px] ${cellStyle}`}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>

        {/* Exam Week Indicator */}
        <div className="flex items-center justify-center gap-2 mt-4 text-[11px] font-semibold text-gray-500">
          <div className="w-2.5 h-2.5 rounded-full bg-[#B2CCFF]" />
          <span>Exam Week</span>
        </div>
      </div>

      {/* 3. Action Block: Wanna see your result? */}
      <div className="border-2 border-dashed border-[#B2CCFF] bg-white rounded-[24px] p-5 shadow-sm text-center">
        <h4 className="text-[15px] font-bold text-gray-800 mb-4">
          Wanna see your result?
        </h4>
        <div className="flex flex-col gap-3">
          <button className="w-full h-12 rounded-full bg-[#4D8DFF] text-white font-bold text-[14px] flex items-center justify-center gap-2.5 hover:bg-[#3B82F6] active:scale-[0.98] transition-all shadow-md">
            <FileText className="w-4.5 h-4.5" />
            View Report Card
          </button>
          <button className="w-full h-12 rounded-full bg-[#4D8DFF] text-white font-bold text-[14px] flex items-center justify-center gap-2.5 hover:bg-[#3B82F6] active:scale-[0.98] transition-all shadow-md">
            <Download className="w-4.5 h-4.5" />
            Download Report Card
          </button>
        </div>
      </div>

      {/* 4. Past Performance Chart Card */}
      <div className="bg-white rounded-[24px] border border-[#EAECF0] p-5 shadow-sm">
        <h4 className="text-[13px] font-bold text-gray-800 mb-4">
          Performance in Past Months
        </h4>

        {/* SVG Line Graph */}
        <div className="relative w-full h-[80px]">
          {/* Shaded Area Under Line */}
          <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
            <defs>
              <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4D8DFF" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#4D8DFF" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Shaded path */}
            <path
              d="M 0 25 C 15 25, 30 20, 45 23 C 60 26, 75 10, 90 12 C 95 13, 100 15, 100 15 L 100 30 L 0 30 Z"
              fill="url(#area-grad)"
            />
            {/* Smooth Spline Curve */}
            <path
              d="M 0 25 C 15 25, 30 20, 45 23 C 60 26, 75 10, 90 12 C 95 13, 100 15, 100 15"
              fill="none"
              stroke="#4D8DFF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Dots */}
            <circle cx="90" cy="12" r="1.5" fill="#4D8DFF" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        {/* X-Axis labels */}
        <div className="flex justify-between text-[9px] font-bold text-gray-400 mt-2 px-1 uppercase tracking-wider">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
        </div>
      </div>
    </div>
  );
};

export default ResultSidebar;
