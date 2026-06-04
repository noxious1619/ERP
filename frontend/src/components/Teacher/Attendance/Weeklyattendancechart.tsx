import React from "react";

interface WeeklyAttendanceChartProps {
  classLabel: string;
  section: string;
  weeklyData: { date: string; count: number }[];
}

const WeeklyAttendanceChart: React.FC<WeeklyAttendanceChartProps> = ({
  classLabel,
  section,
  weeklyData,
}) => {
  const maxBar = Math.max(...weeklyData.map((d) => d.count), 1);
  const todayIdx = weeklyData.length - 1;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-base font-bold text-black">CLASS - {classLabel}</p>
          <p className="text-xs text-blackmt-0.5">Section - {section}</p>
        </div>
        <p className="text-xs text-black text-right leading-snug">
          Weekly
          <br />
          Attendance
        </p>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-3 h-32 px-1 mt-10">
        {weeklyData.map((d, i) => {
          const heightPct = (d.count / maxBar) * 100;
          const isToday = i === todayIdx;
          return (
            <div
              key={d.date}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <div
                className="w-full flex items-end"
                style={{ height: "112px" }}
              >
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    isToday ? "bg-blue-500" : "bg-blue-200"
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-[10px] text-black font-medium">
                {d.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyAttendanceChart;
