"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// --- Types ---
interface WeekData {
  label: string;
  percentage: number;
}
interface MonthData {
  month: string;
  year: number;
  weeks: WeekData[];
}
// --- Sample Data ---
const monthsData: MonthData[] = [
  {
    month: "August",
    year: 2026,
    weeks: [
      { label: "Week 1", percentage: 80 },
      { label: "Week 2", percentage: 68 },
      { label: "Week 3", percentage: 95 },
      { label: "Week 4", percentage: 60 },
    ],
  },
  {
    month: "September",
    year: 2026,
    weeks: [
      { label: "Week 1", percentage: 85 },
      { label: "Week 2", percentage: 73 },
      { label: "Week 3", percentage: 90 },
      { label: "Week 4", percentage: 75 },
    ],
  },
  {
    month: "October",
    year: 2026,
    weeks: [
      { label: "Week 1", percentage: 70 },
      { label: "Week 2", percentage: 88 },
      { label: "Week 3", percentage: 65 },
      { label: "Week 4", percentage: 92 },
    ],
  },
];
// --- Lollipop Bar ---
const CHART_HEIGHT = 200;
const DOT_SIZE = 16;
const LABEL_HEIGHT = 20;

function LollipopBar({ percentage }: { percentage: number }) {
  // Total usable height for the stem+dot portion (leave top for label)
  const usable = CHART_HEIGHT - LABEL_HEIGHT;
  // Stem+dot combined height based on percentage
  const barHeightPx = (percentage / 100) * usable;
  // Stem height = bar height minus the dot
  const stemHeight = Math.max(barHeightPx - DOT_SIZE, 0);
  // Bottom of dot from bottom of container
  const dotBottom = stemHeight;
  // Bottom of label from bottom of container
  const labelBottom = dotBottom + DOT_SIZE + 2;

  return (
    // Relative container — everything positioned inside
    <div
      className="relative flex-shrink-0"
      style={{ width: "24px", height: `${CHART_HEIGHT}px` }}
    >
      {/* Percentage label */}
      <span
        className="absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold text-gray-700 whitespace-nowrap leading-none"
        style={{ bottom: `${labelBottom}px` }}
      >
        {percentage}%
      </span>

      {/* Dot */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full z-10"
        style={{
          width: `${DOT_SIZE}px`,
          height: `${DOT_SIZE}px`,
          bottom: `${dotBottom}px`,
          background: "radial-gradient(circle at 40% 35%, #6baeff, #3B82F6)",
          boxShadow: "0 2px 8px rgba(59,130,246,0.5)",
        }}
      />

      {/* Stem */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          width: "6px",
          height: `${stemHeight}px`,
          bottom: 0,
          background:
            "linear-gradient(to bottom, rgba(59,130,246,0.80), rgba(59,130,246,0.04))",
          borderRadius: "2px",
        }}
      />
    </div>
  );
}
// --- Main Component ---
export default function AttendanceWeekly() {
  const [currentIndex, setCurrentIndex] = useState(1); // default → September 2026
  const current = monthsData[currentIndex];
  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };
  const goNext = () => {
    if (currentIndex < monthsData.length - 1) setCurrentIndex((i) => i + 1);
  };
  return (
    <div className="rounded-[30px] bg-white  shadow-[0px_15px_25px_10px_rgba(0,0,0,0.04)] p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">
          {current.month} {current.year}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
          <button
            onClick={goNext}
            disabled={currentIndex === monthsData.length - 1}
            className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-around">
        {current.weeks.map((week) => (
          <LollipopBar key={week.label} percentage={week.percentage} />
        ))}
      </div>

      {/* Baseline */}
      <div className="border-t border-gray-200 mt-1" />

      {/* Week labels */}
      <div className="flex justify-around mt-2">
        {current.weeks.map((week) => (
          <span
            key={week.label}
            className="text-[13px] text-gray-500 font-medium"
          >
            {week.label}
          </span>
        ))}
      </div>

      {/* Bottom label */}
      <p className="text-center text-[13px] text-gray-500 font-medium mt-4">
        Attendance per Week
      </p>
    </div>
  );
}
