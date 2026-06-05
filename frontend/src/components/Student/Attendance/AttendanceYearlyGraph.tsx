import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MonthlyDataPoint {
  month: string;
  present: number;
  totalDays: number;
  percentage: number;
}

interface AttendanceYearlyGraphProps {
  data: MonthlyDataPoint[];
  loading?: boolean;
}

const AttendanceYearlyGraph: React.FC<AttendanceYearlyGraphProps> = ({
  data = [],
  loading = false,
}) => {
  if (loading || data.length === 0) {
    return (
      <div className="w-full rounded-[30px] bg-white p-6 shadow-[0px_15px_25px_10px_rgba(0,0,0,0.04)] animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
        <div className="w-full h-[260px] bg-gray-100 rounded-xl" />
      </div>
    );
  }

  // Format the raw backend metrics into a clean percentage track for the bars
  const structuredChartData = data.map((item) => ({
    name: item.month,
    "Attendance Rate": item.totalDays > 0 ? Math.round(item.percentage) : 0,
    rawRatio: `${item.present}/${item.totalDays}`,
  }));

  return (
    <div className="w-full rounded-[30px] bg-white p-6 shadow-[0px_15px_25px_10px_rgba(0,0,0,0.04)]">
      <div className="mb-4">
        <h3 className="text-[18px] font-semibold text-[#222222]">
          Detailed Academic Term Performance
        </h3>
      </div>

      {/* CRITICAL FIX: Giving this outer container an explicit height profile 
        so Recharts' ResponsiveContainer can calculate its boundary matrix cleanly!
      */}
      <div className="w-full h-[260px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={structuredChartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#808080", fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#808080", fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              cursor={{ fill: "#F8F9FE" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg bg-[#1F1F1F] px-3 py-2 text-xs font-medium text-white shadow-md">
                      <p className="font-semibold mb-0.5">{payload[0].payload.name}</p>
                      <p className="text-blue-300">
                        Rate: {payload[0].value}% ({payload[0].payload.rawRatio})
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="Attendance Rate"
              fill="#5E8AFC"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceYearlyGraph;