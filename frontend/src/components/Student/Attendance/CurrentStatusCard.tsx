import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface CurrentStatusCardProps {
  daysPresent: number;
  daysAbsent: number;
  attendancePercentage: number;
  loading?: boolean;
}

const CurrentStatusCard: React.FC<CurrentStatusCardProps> = ({
  daysPresent,
  daysAbsent,
  attendancePercentage,
  loading = false,
}) => {
  // Format data specifically to feed Recharts slice layout mapping
  const chartData = [
    { name: "Present", value: daysPresent },
    { name: "Absent", value: daysAbsent },
  ];

  // Colors matching your UI style specs exactly
  const COLORS = ["#3A71FF", "#B70828"];

  if (loading) {
    return (
      <div className="relative w-full rounded-3xl bg-white px-8 py-12 shadow-[0px_15px_25px_10px_rgba(0,0,0,0.04)] animate-pulse">
        <div className="absolute right-4 top-4 bg-gray-200 h-7 w-32 rounded-full" />
        <div className="mt-10 flex justify-center">
          <div className="h-[128px] w-[128px] rounded-full bg-gray-200 flex items-center justify-center">
            <div className="h-[92px] w-[92px] rounded-full bg-white" />
          </div>
        </div>
        <div className="mt-12 flex gap-4 w-full">
          <div className="h-16 bg-gray-200 rounded-2xl flex-1" />
          <div className="h-16 bg-gray-200 rounded-2xl flex-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-3xl bg-white px-8 py-12 shadow-[0px_15px_25px_10px_rgba(0,0,0,0.04)]">
      {/* Status Badge */}
      <div className="absolute right-4 top-4 bg-violet-700/10 rounded-full px-4 py-1">
        <p className="text-[14px] font-semibold uppercase tracking-wide text-[#090958]">
          CURRENT STATUS
        </p>
      </div>

      {/* Recharts Circular Progress Donut */}
      <div className="mt-10 flex h-[128px] w-full items-center justify-center">
        {daysPresent === 0 && daysAbsent === 0 ? (
          // Empty State fallback placeholder if student has zero recorded logs
          <div className="relative flex h-[128px] w-[128px] items-center justify-center rounded-full bg-gray-100">
            <span className="text-sm font-semibold text-gray-400">No Data</span>
          </div>
        ) : (
          <div className="relative h-[128px] w-[128px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46} // Creates the internal donut cutout mask
                  outerRadius={64} // Controls thickness shape boundaries
                  paddingAngle={0}
                  dataKey="value"
                  startAngle={90} // Forces layout sweep to drop from the top center vertical line
                  endAngle={-270}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Percentage Center Float Text Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[26px] font-bold text-black leading-none">
                {attendancePercentage}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Stats Grid Segment */}
      <div className="mt-12 flex items-center justify-between gap-4">
        {/* Present Box */}
        <div className="flex h-16 px-4 py-4 flex-1 flex-col items-center justify-center rounded-2xl bg-[#3A71FF]">
          <h3 className="text-xl font-bold leading-none text-white">
            {daysPresent}
          </h3>
          <p className="mt-2 text-[10px] font-semibold tracking-wide text-white/90">
            DAYS PRESENT
          </p>
        </div>

        {/* Absent Box */}
        <div className="flex h-16 px-4 py-4 flex-1 flex-col items-center justify-center rounded-2xl bg-[#B70828]">
          <h3 className="text-xl font-bold leading-none text-white">
            {daysAbsent}
          </h3>
          <p className="mt-2 text-[10px] font-semibold tracking-wide text-white/90">
            DAYS ABSENT
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentStatusCard;
