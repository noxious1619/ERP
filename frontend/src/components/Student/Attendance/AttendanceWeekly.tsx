"use client";
import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { processWeeklyAttendance } from "../../../utils/attendanceUtils"; // Adjust path if needed

interface AttendanceWeeklyProps {
  heatmapData?: Record<string, "P" | "A" | "H">;
  loading?: boolean;
}

// --- Lollipop Bar Sub-Component ---
const CHART_HEIGHT = 200;
const DOT_SIZE = 16;
const LABEL_HEIGHT = 20;

function LollipopBar({ percentage }: { percentage: number }) {
  const usable = CHART_HEIGHT - LABEL_HEIGHT;
  const barHeightPx = (percentage / 100) * usable;
  const stemHeight = Math.max(barHeightPx - DOT_SIZE, 0);
  const isEmpty = percentage === 0;

  return (
    <div className="relative flex-shrink-0 transition-all duration-500" style={{ width: "24px", height: `${CHART_HEIGHT}px` }}>
      <span
        className={`absolute left-1/2 -translate-x-1/2 text-[13px] font-semibold whitespace-nowrap leading-none transition-colors duration-500 ${isEmpty ? "text-gray-300" : "text-gray-700"}`}
        style={{ bottom: `${stemHeight + DOT_SIZE + 2}px` }}
      >
        {percentage}%
      </span>

      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full z-10 transition-all duration-500"
        style={{
          width: `${DOT_SIZE}px`, height: `${DOT_SIZE}px`, bottom: `${stemHeight}px`,
          background: isEmpty ? "#E5E7EB" : "radial-gradient(circle at 40% 35%, #6baeff, #3B82F6)",
          boxShadow: isEmpty ? "none" : "0 2px 8px rgba(59,130,246,0.5)",
        }}
      />

      <div
        className="absolute left-1/2 -translate-x-1/2 transition-all duration-500"
        style={{
          width: "6px", height: `${stemHeight}px`, bottom: 0, borderRadius: "2px",
          background: isEmpty ? "#F3F4F6" : "linear-gradient(to bottom, rgba(59,130,246,0.80), rgba(59,130,246,0.04))",
        }}
      />
    </div>
  );
}

// --- Main UI Component ---
export default function AttendanceWeekly({ heatmapData = {}, loading = false }: AttendanceWeeklyProps) {
  
  // 1. Offload the heavy lifting to our imported utility function
  const { data: monthsData, defaultIndex } = useMemo(() => {
    return processWeeklyAttendance(heatmapData, 2026);
  }, [heatmapData]);

  const [currentIndex, setCurrentIndex] = useState(defaultIndex);

  // 2. Auto-jump to the latest active month when data finishes loading
  useEffect(() => {
    setCurrentIndex(defaultIndex);
  }, [defaultIndex]);

  const goPrev = () => currentIndex > 0 && setCurrentIndex((i) => i - 1);
  const goNext = () => currentIndex < monthsData.length - 1 && setCurrentIndex((i) => i + 1);

  // 3. Render Skeleton Loader while data is fetching
  if (loading || !monthsData.length) {
    return (
      <div className="rounded-[30px] bg-white shadow-[0px_15px_25px_10px_rgba(0,0,0,0.04)] p-6 w-full min-h-[350px] animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
        <div className="flex items-end justify-around h-[200px] gap-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="w-6 h-3/4 bg-gray-100 rounded-t-full" />)}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-around">
           {[1, 2, 3, 4].map(i => <div key={i} className="h-3 w-12 bg-gray-200 rounded" />)}
        </div>
      </div>
    );
  }

  const current = monthsData[currentIndex];

  // 4. Render Actual UI
  return (
    <div className="rounded-[30px] bg-white shadow-[0px_15px_25px_10px_rgba(0,0,0,0.04)] p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">
          {current.month} {current.year}
        </h2>
        <div className="flex items-center gap-1">
          <button onClick={goPrev} disabled={currentIndex === 0} className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
          <button onClick={goNext} disabled={currentIndex === monthsData.length - 1} className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex items-end justify-around">
        {current.weeks.map((week) => (
          <LollipopBar key={week.label} percentage={week.percentage} />
        ))}
      </div>

      <div className="border-t border-gray-200 mt-1" />

      <div className="flex justify-around mt-2">
        {current.weeks.map((week) => (
          <span key={week.label} className="text-[13px] text-gray-500 font-medium">
            {week.label}
          </span>
        ))}
      </div>

      <p className="text-center text-[13px] text-gray-500 font-medium mt-4">
        Attendance per Week
      </p>
    </div>
  );
}