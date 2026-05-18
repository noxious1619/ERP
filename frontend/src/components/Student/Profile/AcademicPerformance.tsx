const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const AcademicPerformance = () => {
  return (
    <div>
      {/* Card */}
      <div className="mt-6 h-[250px] w-full overflow-hidden  bg-white/40 rounded-3xl shadow-[0px_4px_88px_0px_rgba(0,0,0,0.05)] px-8 py-5">
        {/* Top */}
        <div className="flex items-start justify-between">
          <h3 className="text-[24px] font-semibold text-[#060202] ">
            Performance Trend
          </h3>

          {/* Legend */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center gap-2">
              <div className="h-[10px] w-[22px] rounded-xl bg-pink-800/40" />

              <span className="text-[13px] font-medium text-[#1F1F1F]">
                Whole Class
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-[10px] w-[22px] rounded-xl bg-indigo-950" />

              <span className="text-[13px] font-medium text-[#1F1F1F]">
                You
              </span>
            </div>
          </div>
        </div>

        {/* Graph */}
        <div className="relative mt-2 h-[145px] w-full">
          {/* Pink Curve */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 620 145"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="
      M0 102
      C55 78, 95 48, 145 60
      C205 75, 245 28, 300 40
      C350 52, 385 82, 435 58
      C485 34, 545 12, 620 22
    "
              stroke="#D9A8B8"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {/* Blue Curve */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 620 145"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="
      M0 88
      C45 38, 100 25, 145 78
      C190 132, 275 122, 350 28
      C390 -5, 445 42, 495 58
      C535 72, 575 38, 620 58
    "
              stroke="#151A6A"
              strokeWidth="2.3"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Months */}
        <div className="mt-1 flex items-center justify-between  gap-2">
          {months.map((month) => (
            <span
              key={month}
              className="text-[13px] font-medium text-[#787878]"
            >
              {month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademicPerformance;
