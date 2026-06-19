
export default function AttendanceAnalyticsSidebar() {
  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* 1. Class Breakdown (Donut Chart) */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-3xs flex flex-col gap-4">
        <div>
          <h4 className="font-bold text-gray-900 text-[13px] leading-tight">Class Breakdown</h4>
          <span className="text-[10px] font-semibold text-gray-400">Avg P / A / L - Class 10</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Custom SVG Donut Chart */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {/* Radius = 40, Circumference = 2 * Math.PI * 40 = 251.32 */}
              {/* Background circle */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F3F4F6" strokeWidth="11" />
              
              {/* Segment 1: Present (76%) -> length = 251.32 * 0.76 = 191.0 -> offset = 0 */}
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="transparent" 
                stroke="#10B981" 
                strokeWidth="11" 
                strokeDasharray="191 251.3" 
                strokeDashoffset="0"
                strokeLinecap="round"
              />

              {/* Segment 2: Absent (13%) -> length = 251.32 * 0.13 = 32.7 -> offset = -191.0 */}
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="transparent" 
                stroke="#EF4444" 
                strokeWidth="11" 
                strokeDasharray="32.7 251.3" 
                strokeDashoffset="-191.0"
                strokeLinecap="round"
              />

              {/* Segment 3: Late (11%) -> length = 251.32 * 0.11 = 27.6 -> offset = -(191.0 + 32.7) = -223.7 */}
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="transparent" 
                stroke="#F59E0B" 
                strokeWidth="11" 
                strokeDasharray="27.6 251.3" 
                strokeDashoffset="-223.7"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Avg</span>
              <span className="text-sm font-black text-gray-900 leading-none">78%</span>
            </div>
          </div>

          {/* Legend Details */}
          <div className="flex flex-col gap-2.5 text-[11px] font-bold text-gray-700">
            <div className="flex items-center justify-between gap-6 w-32">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-gray-400 font-semibold">Present</span>
              </div>
              <span>76%</span>
            </div>
            <div className="flex items-center justify-between gap-6 w-32">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                <span className="text-gray-400 font-semibold">Absent</span>
              </div>
              <span>13%</span>
            </div>
            <div className="flex items-center justify-between gap-6 w-32">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="text-gray-400 font-semibold">Late</span>
              </div>
              <span>11%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Weekly Trend (Line Chart) */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-3xs flex flex-col gap-4">
        <div>
          <h4 className="font-bold text-gray-900 text-[13px] leading-tight">Weekly Trend</h4>
          <span className="text-[10px] font-semibold text-gray-400">Section comparison - 6 weeks</span>
        </div>

        {/* SVG Line Chart */}
        <div className="h-44 w-full relative">
          <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="20" y1="20" x2="280" y2="20" stroke="#F3F4F6" strokeWidth="1" />
            <line x1="20" y1="45" x2="280" y2="45" stroke="#F3F4F6" strokeWidth="1" />
            <line x1="20" y1="70" x2="280" y2="70" stroke="#F3F4F6" strokeWidth="1" />
            <line x1="20" y1="95" x2="280" y2="95" stroke="#F3F4F6" strokeWidth="1" />

            {/* Threshold dashed line */}
            <line x1="20" y1="80" x2="280" y2="80" stroke="#EF4444" strokeWidth="1" strokeDasharray="3,3" strokeOpacity="0.4" />

            {/* 10A (Blue Curve) */}
            <path 
              d="M20,75 L72,82 L124,72 L176,60 L228,70 L280,65" 
              fill="none" 
              stroke="#4285F4" 
              strokeWidth="2"
            />
            {/* 10A dots */}
            <circle cx="20" cy="75" r="3" fill="#4285F4" />
            <circle cx="72" cy="82" r="3" fill="#4285F4" />
            <circle cx="124" cy="72" r="3" fill="#4285F4" />
            <circle cx="176" cy="60" r="3" fill="#4285F4" />
            <circle cx="228" cy="70" r="3" fill="#4285F4" />
            <circle cx="280" cy="65" r="3" fill="#4285F4" />

            {/* 10B (Green Curve) */}
            <path 
              d="M20,60 L72,68 L124,55 L176,45 L228,38 L280,45" 
              fill="none" 
              stroke="#10B981" 
              strokeWidth="2"
            />
            {/* 10B dots */}
            <circle cx="20" cy="60" r="3" fill="#10B981" />
            <circle cx="72" cy="68" r="3" fill="#10B981" />
            <circle cx="124" cy="55" r="3" fill="#10B981" />
            <circle cx="176" cy="45" r="3" fill="#10B981" />
            <circle cx="228" cy="38" r="3" fill="#10B981" />
            <circle cx="280" cy="45" r="3" fill="#10B981" />

            {/* 10C (Yellow Curve) */}
            <path 
              d="M20,40 L72,55 L124,68 L176,68 L228,50 L280,40" 
              fill="none" 
              stroke="#F59E0B" 
              strokeWidth="2"
            />
            {/* 10C dots */}
            <circle cx="20" cy="40" r="3" fill="#F59E0B" />
            <circle cx="72" cy="55" r="3" fill="#F59E0B" />
            <circle cx="124" cy="68" r="3" fill="#F59E0B" />
            <circle cx="176" cy="68" r="3" fill="#F59E0B" />
            <circle cx="228" cy="50" r="3" fill="#F59E0B" />
            <circle cx="280" cy="40" r="3" fill="#F59E0B" />
          </svg>

          {/* SVG Labels */}
          <div className="flex justify-between text-[9px] font-bold text-gray-400 mt-2 px-1">
            <span>Wk1</span>
            <span>Wk2</span>
            <span>Wk3</span>
            <span>Wk4</span>
            <span>Wk5</span>
            <span>Wk6</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-4 text-[10px] font-bold mt-1">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
            <span className="text-gray-500 font-semibold">10A</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-gray-500 font-semibold">10B</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span className="text-gray-500 font-semibold">10C</span>
          </div>
        </div>
      </div>

      {/* 3. Section Attendance % (Bar Chart) */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-3xs flex flex-col gap-4">
        <div>
          <h4 className="font-bold text-gray-900 text-[13px] leading-tight">Section Attendance %</h4>
          <span className="text-[10px] font-semibold text-gray-400">Present rate per section</span>
        </div>

        {/* SVG Bar Chart */}
        <div className="h-40 w-full relative">
          <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
            {/* Grid Line levels */}
            <line x1="20" y1="20" x2="180" y2="20" stroke="#F3F4F6" strokeWidth="1" />
            <line x1="20" y1="50" x2="180" y2="50" stroke="#F3F4F6" strokeWidth="1" />
            <line x1="20" y1="80" x2="180" y2="80" stroke="#F3F4F6" strokeWidth="1" />

            {/* Threshold dashed indicator at 75% (approx height 25 inside chart coordinates) */}
            <line x1="20" y1="28" x2="180" y2="28" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3,3" />

            {/* Bars */}
            {/* 10A (65%) -> height = 55 (bottom 80, top 25) */}
            <rect x="40" y="38" width="16" height="42" rx="4" fill="#4285F4" />

            {/* 10B (80%) -> height = 65 (bottom 80, top 15) */}
            <rect x="92" y="20" width="16" height="60" rx="4" fill="#10B981" />

            {/* 10C (72%) -> height = 58 (bottom 80, top 22) */}
            <rect x="144" y="26" width="16" height="54" rx="4" fill="#F59E0B" />
          </svg>

          {/* Bar Labels */}
          <div className="flex justify-between text-[10px] font-bold text-gray-500 mt-2 px-10">
            <span>10A</span>
            <span>10B</span>
            <span>10C</span>
          </div>
        </div>
      </div>

      {/* 4. Defaulters by Section (Progress bars list) */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-3xs flex flex-col gap-4">
        <div>
          <h4 className="font-bold text-gray-900 text-[13px] leading-tight">Defaulters by Section</h4>
          <span className="text-[10px] font-semibold text-gray-400">Students below 75%</span>
        </div>

        <div className="flex flex-col gap-4">
          {/* Section 10A */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-800">
              <span>10A</span>
              <span className="text-red-500">3 students</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-[#4285F4] h-1.5 rounded-full" style={{ width: "60%" }} />
            </div>
          </div>

          {/* Section 10B */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-800">
              <span>10B</span>
              <span className="text-red-500">1 student</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-[#10B981] h-1.5 rounded-full" style={{ width: "25%" }} />
            </div>
          </div>

          {/* Section 10C */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-800">
              <span>10C</span>
              <span className="text-red-500">2 students</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-[#F59E0B] h-1.5 rounded-full" style={{ width: "45%" }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
