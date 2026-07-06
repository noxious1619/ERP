import React from "react";
import { ChevronDown } from "lucide-react";

interface SubjectData {
  label: string;
  pct: number;
}

const subjectsPerformance: SubjectData[] = [
  { label: "Math", pct: 75 },
  { label: "Geo", pct: 90 },
  { label: "Bio", pct: 65 },
  { label: "Chem", pct: 48 },
  { label: "Phy", pct: 60 },
  { label: "Eng", pct: 75 },
];

interface AdminLargeGraphCardProps {
  selectedSubject: string;
  onSubjectChange: (subj: string) => void;
}

const AdminLargeGraphCard: React.FC<AdminLargeGraphCardProps> = ({ selectedSubject, onSubjectChange }) => {
  const chartHeightPx = 280;

  return (
    <div className="bg-white rounded-[24px] border border-[#EAECF0] p-6 shadow-sm w-full">
      {/* 1. Filter Row */}
      <div className="flex flex-wrap items-center justify-center gap-3 pb-6 border-b border-[#F2F4F7] mb-6">
        {/* Exam Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#EAECF0] rounded-full text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors bg-white">
            Mid Term Exam
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Class Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#EAECF0] rounded-full text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors bg-white">
            Class X
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Section Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#EAECF0] rounded-full text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors bg-white">
            Section A
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Date Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#EAECF0] rounded-full text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors bg-white">
            30/05/2026
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Subject Dropdown (Custom Interactive Selection) */}
        <div className="relative">
          <select 
            value={selectedSubject} 
            onChange={(e) => onSubjectChange(e.target.value)}
            className="flex items-center gap-2 px-4 py-2 border border-[#EAECF0] rounded-full text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors bg-white appearance-none cursor-pointer pr-8 focus:outline-none"
            style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundPosition: 'right 8px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="All Subjects">All Subjects</option>
            <option value="English">English</option>
          </select>
        </div>
      </div>

      {/* 2. Sub-Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[20px] font-bold text-gray-800 leading-tight">English</h2>
          <span className="text-[12px] text-gray-400 font-semibold">30th May, 2026</span>
        </div>

        <div className="text-center">
          <h3 className="text-[16px] font-bold text-gray-800">Mid-Term Examination</h3>
          <span className="text-[12px] text-[#4D8DFF] font-semibold">Class X-A • 35 Students</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-2 bg-[#4285F4] text-white rounded-full text-[13px] font-bold shadow-sm hover:bg-[#357AE8] active:scale-[0.98] transition-all">
            Edit
          </button>
          <button className="px-6 py-2 border border-[#4285F4] text-[#4285F4] bg-white rounded-full text-[13px] font-bold shadow-sm hover:bg-blue-50 active:scale-[0.98] transition-all">
            Save
          </button>
        </div>
      </div>

      {/* 3. Large Bar Chart Visualisation */}
      <div className="flex gap-4 relative mb-12">
        {/* Y-Axis scale labels */}
        <div className="flex flex-col justify-between items-end text-[11px] font-bold text-gray-400 w-8 select-none py-1 relative" style={{ height: `${chartHeightPx}px` }}>
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>

        {/* Chart Area with Gridlines */}
        <div className="flex-1 relative border-l border-b border-gray-200" style={{ height: `${chartHeightPx}px` }}>
          {/* Dashed Horizontal Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="border-b border-dashed border-gray-200 w-full h-0" />
            ))}
          </div>

          {/* Ticks on Y-axis (pointing left) */}
          <div className="absolute left-[-6px] top-[1px] w-[6px] h-full pointer-events-none z-10">
            <div className="absolute right-0 w-[6px] h-[1px] bg-gray-300" style={{ top: "0%" }} />
            <div className="absolute right-0 w-[6px] h-[1px] bg-gray-300" style={{ top: "25%" }} />
            <div className="absolute right-0 w-[6px] h-[1px] bg-gray-300" style={{ top: "50%" }} />
            <div className="absolute right-0 w-[6px] h-[1px] bg-gray-300" style={{ top: "75%" }} />
            <div className="absolute right-0 w-[6px] h-[1px] bg-gray-300" style={{ top: "100%" }} />
          </div>

          {/* Bar Columns Container */}
          <div className="absolute inset-0 flex justify-around items-end px-6">
            {subjectsPerformance.map((sub, idx) => (
              <div key={idx} className="flex flex-col items-center justify-end h-full flex-1 relative">
                {/* Visual Bar */}
                <div 
                  style={{ height: `${sub.pct}%` }}
                  className="w-[32px] bg-[#4285F4] rounded-t-[8px] hover:bg-[#357AE8] transition-all duration-300 shadow-sm"
                  title={`${sub.label}: ${sub.pct}%`}
                />

                {/* X-Axis Label (absolute below chart border) */}
                <span className="absolute text-[12px] font-bold text-gray-500 select-none" style={{ bottom: "-24px" }}>
                  {sub.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLargeGraphCard;
