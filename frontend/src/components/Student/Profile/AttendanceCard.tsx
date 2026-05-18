const AttendanceCard = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl  bg-white/40 px-8 pt-7 pb-4  mt-4 shadow-[0px_4px_88px_0px_rgba(0,0,0,0.05)]">
      {/* Title */}
      <h2 className="text-[24px] font-semibold text-[#060202]">Attendance</h2>

      {/* Top Section */}
      <div className="mt-7 flex items-start ">
        {/* Legend */}
        <div className="flex flex-col  pl-6">
          <div className="flex items-center gap-4">
            <div className="h-[12px] w-[30px] rounded-full bg-[#0C0CC1]" />
            <span className="text-[16px] font-medium text-[#060202]">
              Present
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-[12px] w-[30px] rounded-full bg-[#BB0060]" />
            <span className="text-[16px] font-medium text-[#060202]">
              Absent
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-[12px] w-[30px] rounded-full bg-[#9C9C9C]" />
            <span className="text-[16px] font-medium text-[#060202]">
              Holiday
            </span>
          </div>
        </div>

        {/* Percentage Bars */}
        <div className="absolute right-[20px] top-0 flex items-start gap-2">
          {/* Present */}
          <div className="flex h-38 w-16 items-end justify-center rounded-b-[42px] rounded-t-[2px] bg-[#0C0CC1] pb-7 shadow-[0_10px_25px_rgba(12,12,193,0.18)]">
            <span className="text-[22px] font-bold text-white">75%</span>
          </div>

          {/* Absent */}
          <div className="top-0 flex w-16 h-28 items-end justify-center rounded-b-[38px] rounded-t-[2px] bg-[#BB0060] pb-7 shadow-[0_10px_25px_rgba(187,0,96,0.18)]">
            <span className="text-[20px] font-bold text-white">15%</span>
          </div>

          {/* Holiday */}
          <div className="top-0 flex w-16 h-20  items-end justify-center rounded-b-[34px] rounded-t-[2px] bg-[#9C9C9C] pb-7 shadow-[0_10px_20px_rgba(182,182,182,0.18)]">
            <span className="text-[18px] font-bold text-white">10%</span>
          </div>
        </div>
      </div>

      {/* Graph Area */}
      <div className="relative  h-[160px] w-full">
        {/* SVG Curve */}
        <svg
          viewBox="0 0 1200 260"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0C0CC1" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0C0CC1" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Fill */}
          <path
            d="
              M0,180
              C80,210 150,195 230,170
              C320,145 430,175 560,85
              C650,70 760,115 900,135
              C1020,145 1090,115 1200,95
              L1200,260
              L0,260
              Z
            "
            fill="url(#attendanceGradient)"
          />

          {/* Main Line */}
          <path
            d="
              M0,180
              C80,210 150,195 230,170
              C320,145 430,175 560,85
              C650,70 760,115 900,135
              C1020,145 1090,115 1200,95
            "
            fill="none"
            stroke="#0C0CC1"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>

        {/* Month Indicators */}
        <div className="absolute bottom-[6px] left-0 flex w-full items-end justify-between px-[14px]">
          {["Jan", "May", "Aug"].map((month) => (
            <div key={month} className="flex flex-col items-center gap-2">
              <div className="h-[32px] w-[2px] rounded-full bg-[#0C0CC1]/60" />

              <span className="text-[18px] font-medium text-[#060202]">
                {month}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;
