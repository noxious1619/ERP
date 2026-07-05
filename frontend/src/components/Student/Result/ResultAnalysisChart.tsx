import React from "react";

interface BarGroup {
  label: string;
  max: number;
  classAvg: number;
  userVal: number;
  isFail?: boolean;
  isAbsent?: boolean;
}

const dataGroups: BarGroup[] = [
  { label: "MATH", max: 20, classAvg: 15, userVal: 18 },
  { label: "GEO", max: 20, classAvg: 13, userVal: 20 },
  { label: "PHY", max: 20, classAvg: 14, userVal: 16 },
  { label: "CHEM", max: 20, classAvg: 12, userVal: 0, isAbsent: true },
  { label: "ENG", max: 20, classAvg: 11, userVal: 3, isFail: true },
  { label: "BIO", max: 20, classAvg: 16, userVal: 17 },
];

const ResultAnalysisChart: React.FC = () => {
  const chartHeightPx = 180; // height of chart grid

  return (
    <div className="bg-white rounded-[24px] border border-[#EAECF0] p-6 shadow-sm w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[16px] font-bold text-[#1D2939]">
          Mid Term Exam Analysis
        </h3>
        <span className="text-[12px] font-bold text-[#4D8DFF] bg-[#EEF3FF] px-4 py-2 rounded-full shadow-sm">
          8 Jun - 15 Jun
        </span>
      </div>

      {/* Grid & Bars Container */}
      <div className="relative mb-6">
        {/* Horizontal background grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="border-b border-dashed border-[#EAECF0] w-full h-0" />
          ))}
        </div>

        {/* Bars Wrapper */}
        <div 
          className="flex justify-between items-end relative px-4" 
          style={{ height: `${chartHeightPx}px` }}
        >
          {dataGroups.map((group, idx) => {
            // Percent heights relative to max (20 points scale)
            const maxPct = 100;
            const avgPct = (group.classAvg / 20) * 100;
            const userPct = (group.userVal / 20) * 100;

            // Bar colors
            let userBarColor = "bg-[#4D8DFF]"; // Default dark blue
            if (group.isFail) {
              userBarColor = "bg-[#D92D20]"; // Dark red
            }

            return (
              <div key={idx} className="flex flex-col items-center justify-end flex-1 mx-2 h-full">
                {/* Bars group */}
                <div className="flex items-end gap-[6px] h-[140px] w-full justify-center">
                  {/* Max Marks Bar (Gray) */}
                  <div 
                    style={{ height: `${maxPct}%` }}
                    className="w-[10px] bg-[#F2F4F7] rounded-full transition-all duration-500 hover:opacity-80"
                    title={`Max Marks: ${group.max}`}
                  />
                  {/* Class Average Bar (Light Blue) */}
                  <div 
                    style={{ height: `${avgPct}%` }}
                    className="w-[10px] bg-[#B2CCFF] rounded-full transition-all duration-500 hover:opacity-80"
                    title={`Class Avg: ${group.classAvg}`}
                  />
                  {/* Your Performance Bar (Dark Blue / Red / Empty) */}
                  {!group.isAbsent ? (
                    <div 
                      style={{ height: `${userPct}%` }}
                      className={`w-[10px] ${userBarColor} rounded-full transition-all duration-500 hover:opacity-80`}
                      title={`Your Score: ${group.userVal}`}
                    />
                  ) : (
                    // Absent placeholder (empty bar or 0 height)
                    <div className="w-[10px] h-0 bg-transparent" />
                  )}
                </div>

                {/* X-Axis Label */}
                <span className="text-[11px] font-bold text-[#667085] mt-4 tracking-wider">
                  {group.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 border-t border-[#F2F4F7] pt-5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F2F4F7]" />
          <span className="text-[11px] font-bold text-[#667085] tracking-widest uppercase">
            MAX MARKS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#B2CCFF]" />
          <span className="text-[11px] font-bold text-[#667085] tracking-widest uppercase">
            CLASS AVERAGE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#4D8DFF]" />
          <span className="text-[11px] font-bold text-[#667085] tracking-widest uppercase">
            YOUR PERFORMANCE
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResultAnalysisChart;
