import { MoveUpRight } from "lucide-react";
import arrow from "../../../assets/Student/Attendance/arrow.svg";
const attendanceData = [
  { month: "Jan", present: 25, total: 30 },
  { month: "Feb", present: 21, total: 28 },
  { month: "Mar", present: 26, total: 30 },
  { month: "Apr", present: 16, total: 30 },
  { month: "May", present: 20, total: 30 },
  { month: "Jun", present: 29, total: 30 },
  { month: "Jul", present: 22, total: 30 },
  { month: "Aug", present: 18, total: 30 },
  { month: "Sep", present: 26, total: 30 },
  { month: "Oct", present: 22, total: 30 },
  { month: "Nov", present: 27, total: 30 },
  { month: "Dec", present: 21, total: 30 },
];

const BAR_WIDTH = 46;
const GAP = 20;

const AttendanceYearlyChart = () => {
  return (
    <div className="w-full rounded-[30px] bg-white px-[20px] pt-[34px] pb-[28px] shadow-[0px_15px_25px_10px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="mb-[34px] flex items-start justify-between">
        <h2 className="text-[18px] font-semibold tracking-[-0.3px] text-[#222222]">
          Attendance throughout the year
        </h2>
        <img src={arrow} alt="arrow" className="h-[20px] w-[20px]" />
      </div>

      {/* Chart Area */}
      <div className="flex flex-col items-center">
        {/* Bars */}
        <div className="flex items-end" style={{ gap: `${GAP}px` }}>
          {attendanceData.map((item, index) => {
            const percentage = (item.present / item.total) * 100;
            return (
              <div
                key={index}
                className="group flex flex-col items-center"
                style={{ width: `${BAR_WIDTH}px` }}
              >
                {/* Tooltip */}
                <div className="mb-3 scale-95 rounded-md bg-[#1F1F1F] px-3 py-[5px] text-[11px] font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap">
                  {item.present}/{item.total}
                </div>
                {/* Bar */}
                <div className="relative flex h-[128px] w-full items-end overflow-hidden rounded-t-[14px] bg-[#F2F2F2]">
                  <div
                    className="w-full rounded-t-[14px] bg-[#5E8AFC] transition-all duration-300"
                    style={{ height: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Border line — exactly as wide as the bars+gaps */}
        <div
          className="border-t border-[#6D6D6D]"
          style={{
            width: `${attendanceData.length * BAR_WIDTH + (attendanceData.length - 1) * GAP}px`,
          }}
        />

        {/* Month Labels — each centered under its bar */}
        <div className="flex mt-[10px]" style={{ gap: `${GAP}px` }}>
          {attendanceData.map((item, index) => (
            <div
              key={index}
              className="flex justify-center"
              style={{ width: `${BAR_WIDTH}px` }}
            >
              <span className="text-[13px] font-medium text-[#808080]">
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-[34px] text-center ">
        <p className="text-[16px] font-medium text-[#8B8B8B]">
          Your attendance has increased by
        </p>
        <p className="text-[16px] font-medium text-[#8B8B8B]">
          <span className="font-semibold text-[#5E82ED]">4.2%</span> compared to
          last month.
        </p>
      </div>
    </div>
  );
};

export default AttendanceYearlyChart;
