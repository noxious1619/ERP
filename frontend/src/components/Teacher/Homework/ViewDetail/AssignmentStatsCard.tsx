const AssignmentStatsCard = () => {
  const submitted = 43;
  const late = 5;
  const missing = 2;
  const total = 50;
  // Gauge arc calculations
  // semicircle = 180deg, split proportionally
  const submittedDeg = (submitted / total) * 180;
  const lateDeg = (late / total) * 180;
  // missing fills the rest
  return (
    <div className="w-[320px] shrink-0 bg-white rounded-[18px] border border-[#EAECF0] px-5  shadow-sm">
      {/* Stat boxes */}
      <div className="grid grid-cols-3 gap-2 mb-4 mt-0">
        <div className="bg-[#EEF3FF] rounded-[10px]  py-2 text-center">
          <p className="text-[10px]  text-[#4285F4] uppercase tracking-wider">
            Submitted
          </p>
          <p className="text-[24px] text-[#0E0E8A] leading-tight">
            {submitted}
          </p>
        </div>
        <div className="bg-[#FFF8EC] rounded-[10px]  py-2 text-center">
          <p className="text-[10px]  text-[#FAAB00] uppercase tracking-wider">
            Late
          </p>
          <p className="text-[24px]  text-[#FAAB00] leading-tight">{late}</p>
        </div>
        <div className="bg-[#FFF0F0] rounded-[10px]  py-2 text-center">
          <p className="text-[10px]  text-[#D8072E] uppercase tracking-wider">
            Missing
          </p>
          <p className="text-[24px]  text-[#D8072E] leading-tight">{missing}</p>
        </div>
      </div>

      {/* Semicircle gauge */}
      <div className="flex justify-center">
        <div className="relative w-[160px] h-[85px] overflow-hidden">
          <svg
            viewBox="0 0 160 85"
            className="w-full h-full"
            style={{ overflow: "visible" }}
          >
            {/* Background arc */}
            <path
              d="M 10 80 A 70 70 0 0 1 150 80"
              fill="none"
              stroke="#F2F4F7"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Submitted arc (blue) — largest, starts from left */}
            <path
              d="M 10 80 A 70 70 0 0 1 150 80"
              fill="none"
              stroke="#4D8DFF"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${(submitted / total) * 220} 220`}
              strokeDashoffset="0"
            />
            {/* Late arc (yellow) — after submitted */}
            <path
              d="M 10 80 A 70 70 0 0 1 150 80"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${(late / total) * 220} 220`}
              strokeDashoffset={`${-((submitted / total) * 220)}`}
            />
            {/* Missing arc (red) — after late */}
            <path
              d="M 10 80 A 70 70 0 0 1 150 80"
              fill="none"
              stroke="#EF4444"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${(missing / total) * 220} 220`}
              strokeDashoffset={`${-(((submitted + late) / total) * 220)}`}
            />
          </svg>

          {/* Center text */}
          <div className="absolute bottom-3 left-0 right-0 flex flex-col items-center">
            <p className="text-[10px] text-[#888889]  font-medium">
              Total Students
            </p>
            <p className="text-[20px] text-[#0E0E8A] leading-none">{total}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentStatsCard;
