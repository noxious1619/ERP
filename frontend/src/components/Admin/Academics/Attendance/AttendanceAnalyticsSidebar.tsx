interface ChartsData {
  breakdown: {
    present: number;
    absent: number;
    late: number;
    average: number;
  };
  trends: {
    labels: string[];
    sections: {
      name: string;
      data: (number | null)[];
    }[];
  };
  sections: {
    name: string;
    percentage: number;
  }[];
  defaulters: {
    name: string;
    count: number;
  }[];
}

interface AttendanceAnalyticsSidebarProps {
  chartsData: ChartsData | null;
  isLoading?: boolean;
}

const LINE_COLORS = ["#4285F4", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];
const BG_COLORS = [
  "bg-[#4285F4]",
  "bg-[#10B981]",
  "bg-[#F59E0B]",
  "bg-[#8B5CF6]",
  "bg-[#EC4899]",
];

export default function AttendanceAnalyticsSidebar({
  chartsData,
  isLoading = false,
}: AttendanceAnalyticsSidebarProps) {
  // 1. Donut values
  const presentPct = chartsData?.breakdown.present ?? 76;
  const absentPct = chartsData?.breakdown.absent ?? 13;
  const latePct = chartsData?.breakdown.late ?? 11;
  const avgPct = chartsData?.breakdown.average ?? 78;

  // Donut SVG Calculations
  const circ = 251.32;
  const presLen = (presentPct / 100) * circ;
  const absLen = (absentPct / 100) * circ;
  const lateLen = (latePct / 100) * circ;

  const presOffset = 0;
  const absOffset = -presLen;
  const lateOffset = -(presLen + absLen);

  // 2. Line Chart Trends
  const trendLabels = chartsData?.trends.labels ?? [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];
  const trendSections = chartsData?.trends.sections ?? [];

  // 3. Section Bar Chart
  const barSections = chartsData?.sections ?? [];

  // 4. Defaulters List
  const defaulterList = chartsData?.defaulters ?? [];

  return (
    <div className="flex flex-col gap-6 w-full relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-xs flex items-center justify-center z-20 rounded-xl">
          <span className="w-6 h-6 border-2 border-[#4285F4] border-t-transparent rounded-full animate-spin"></span>
        </div>
      )}

      {/* 1. Class Breakdown (Donut Chart) */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-3xs flex flex-col gap-4">
        <div>
          <h4 className="font-bold text-gray-900 text-[13px] leading-tight">
            Class Breakdown
          </h4>
          <span className="text-[10px] font-semibold text-gray-400">
            Current average rates
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Custom SVG Donut Chart */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full transform -rotate-90"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#F3F4F6"
                strokeWidth="11"
              />

              {/* Segment 1: Present */}
              {presLen > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="11"
                  strokeDasharray={`${presLen} ${circ}`}
                  strokeDashoffset={presOffset}
                  strokeLinecap="round"
                />
              )}

              {/* Segment 2: Absent */}
              {absLen > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#EF4444"
                  strokeWidth="11"
                  strokeDasharray={`${absLen} ${circ}`}
                  strokeDashoffset={absOffset}
                  strokeLinecap="round"
                />
              )}

              {/* Segment 3: Late */}
              {lateLen > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="11"
                  strokeDasharray={`${lateLen} ${circ}`}
                  strokeDashoffset={lateOffset}
                  strokeLinecap="round"
                />
              )}
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                Avg
              </span>
              <span className="text-sm font-black text-gray-900 leading-none">
                {avgPct}%
              </span>
            </div>
          </div>

          {/* Legend Details */}
          <div className="flex flex-col gap-2.5 text-[11px] font-bold text-gray-700 w-full">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-gray-400 font-semibold">Present</span>
              </div>
              <span>{presentPct}%</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                <span className="text-gray-400 font-semibold">Absent</span>
              </div>
              <span>{absentPct}%</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="text-gray-400 font-semibold">
                  Late/Partial
                </span>
              </div>
              <span>{latePct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Weekly Trend (Line Chart) */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-3xs flex flex-col gap-4">
        <div>
          <h4 className="font-bold text-gray-900 text-[13px] leading-tight">
            Weekly/Daily Trend
          </h4>
          <span className="text-[10px] font-semibold text-gray-400">
            Section comparison chart
          </span>
        </div>

        {/* SVG Line Chart */}
        <div className="h-44 w-full relative">
          <svg
            className="w-full h-full"
            viewBox="0 0 300 130"
            preserveAspectRatio="none"
          >
            {/* Grid Lines */}
            <line
              x1="20"
              y1="20"
              x2="280"
              y2="20"
              stroke="#F3F4F6"
              strokeWidth="1"
            />
            <line
              x1="20"
              y1="45"
              x2="280"
              y2="45"
              stroke="#F3F4F6"
              strokeWidth="1"
            />
            <line
              x1="20"
              y1="70"
              x2="280"
              y2="70"
              stroke="#F3F4F6"
              strokeWidth="1"
            />
            <line
              x1="20"
              y1="95"
              x2="280"
              y2="95"
              stroke="#F3F4F6"
              strokeWidth="1"
            />

            {/* Y Axis labels */}
            <text
              x="15"
              y="23"
              fill="#94A3B8"
              fontSize="8"
              fontWeight="600"
              textAnchor="end"
            >
              100
            </text>
            <text
              x="15"
              y="48"
              fill="#94A3B8"
              fontSize="8"
              fontWeight="600"
              textAnchor="end"
            >
              75
            </text>
            <text
              x="15"
              y="73"
              fill="#94A3B8"
              fontSize="8"
              fontWeight="600"
              textAnchor="end"
            >
              50
            </text>
            <text
              x="15"
              y="98"
              fill="#94A3B8"
              fontSize="8"
              fontWeight="600"
              textAnchor="end"
            >
              25
            </text>

            {/* Threshold dashed line */}
            <line
              x1="20"
              y1="80"
              x2="280"
              y2="80"
              stroke="#EF4444"
              strokeWidth="1"
              strokeDasharray="3,3"
              strokeOpacity="0.4"
            />

            {/* X Axis labels — aligned to the same x formula as data points */}
            {trendLabels.map((lbl, idx) => {
              const pointsCount = trendLabels.length;
              const x = 20 + (idx / Math.max(1, pointsCount - 1)) * 260;
              return (
                <text
                  key={idx}
                  x={x}
                  y="115"
                  fill="#94A3B8"
                  fontSize="7"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {lbl}
                </text>
              );
            })}

            {/* Plot dynamic curves */}
            {trendSections.map((sec, secIdx) => {
              const color = LINE_COLORS[secIdx % LINE_COLORS.length];
              const dataPoints = sec.data;
              if (dataPoints.length === 0) return null;

              const pointsCount = dataPoints.length;

              // Build coordinate list, marking nulls
              const coords = dataPoints.map((pct, idx) => {
                const x = 20 + (idx / Math.max(1, pointsCount - 1)) * 260;
                if (pct === null) return null;
                const y = 95 - (pct / 100) * 75;
                return { x, y };
              });

              // Group into contiguous segments (skip gaps where pct was null)
              const segments: { x: number; y: number }[][] = [];
              let current: { x: number; y: number }[] = [];
              coords.forEach((c) => {
                if (c === null) {
                  if (current.length) segments.push(current);
                  current = [];
                } else {
                  current.push(c);
                }
              });
              if (current.length) segments.push(current);

              return (
                <g key={sec.name}>
                  {segments.map((seg, segIdx) => (
                    <path
                      key={segIdx}
                      d={`M ${seg.map((p) => `${p.x},${p.y}`).join(" L ")}`}
                      fill="none"
                      stroke={color}
                      strokeWidth="2"
                    />
                  ))}
                  {coords.map(
                    (c, idx) =>
                      c && (
                        <circle
                          key={idx}
                          cx={c.x}
                          cy={c.y}
                          r="3"
                          fill={color}
                        />
                      ),
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-[10px] font-bold mt-1">
          {trendSections.map((sec, secIdx) => {
            const color = LINE_COLORS[secIdx % LINE_COLORS.length];
            return (
              <div key={sec.name} className="flex items-center gap-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-gray-500 font-semibold">{sec.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Section Attendance % (Bar Chart) */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-3xs flex flex-col gap-4">
        <div>
          <h4 className="font-bold text-gray-900 text-[13px] leading-tight">
            Section Attendance %
          </h4>
          <span className="text-[10px] font-semibold text-gray-400">
            Present rate per section
          </span>
        </div>

        {/* SVG Bar Chart */}
        {barSections.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-xs text-gray-400 font-semibold">
            No section data available
          </div>
        ) : (
          <div className="h-40 w-full relative">
            <div className="h-40 w-full relative">
              <svg
                className="w-full h-full"
                viewBox="0 0 200 110"
                preserveAspectRatio="none"
              >
                {/* Axis lines */}
                <line
                  x1="28"
                  y1="10"
                  x2="28"
                  y2="80"
                  stroke="#9CA3AF"
                  strokeWidth="1"
                />
                <line
                  x1="28"
                  y1="80"
                  x2="180"
                  y2="80"
                  stroke="#9CA3AF"
                  strokeWidth="1"
                />

                {/* Grid Line levels */}
                <line
                  x1="28"
                  y1="20"
                  x2="180"
                  y2="20"
                  stroke="#F3F4F6"
                  strokeWidth="1"
                />
                <line
                  x1="28"
                  y1="35"
                  x2="180"
                  y2="35"
                  stroke="#F3F4F6"
                  strokeWidth="1"
                />
                <line
                  x1="28"
                  y1="50"
                  x2="180"
                  y2="50"
                  stroke="#F3F4F6"
                  strokeWidth="1"
                />
                <line
                  x1="28"
                  y1="65"
                  x2="180"
                  y2="65"
                  stroke="#F3F4F6"
                  strokeWidth="1"
                />

                {/* Y Axis labels */}
                <text
                  x="24"
                  y="23"
                  fill="#94A3B8"
                  fontSize="7"
                  fontWeight="600"
                  textAnchor="end"
                >
                  100%
                </text>
                <text
                  x="24"
                  y="38"
                  fill="#94A3B8"
                  fontSize="7"
                  fontWeight="600"
                  textAnchor="end"
                >
                  75%
                </text>
                <text
                  x="24"
                  y="53"
                  fill="#94A3B8"
                  fontSize="7"
                  fontWeight="600"
                  textAnchor="end"
                >
                  50%
                </text>
                <text
                  x="24"
                  y="68"
                  fill="#94A3B8"
                  fontSize="7"
                  fontWeight="600"
                  textAnchor="end"
                >
                  25%
                </text>
                <text
                  x="24"
                  y="83"
                  fill="#94A3B8"
                  fontSize="7"
                  fontWeight="600"
                  textAnchor="end"
                >
                  0%
                </text>

                {/* Threshold dashed indicator at 75% */}
                <line
                  x1="28"
                  y1="35"
                  x2="180"
                  y2="35"
                  stroke="#EF4444"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />

                {/* Bars + their X labels, computed from the SAME x position */}
                {(() => {
                  const sectionsWithData = barSections.filter(
                    (sec) => sec.percentage !== null,
                  );

                  if (sectionsWithData.length === 0) {
                    return (
                      <text
                        x="100"
                        y="50"
                        fill="#9CA3AF"
                        fontSize="8"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        No attendance data recorded
                      </text>
                    );
                  }

                  return sectionsWithData.map((sec, idx) => {
                    const count = sectionsWithData.length;
                    const space = 140 / Math.max(1, count);
                    const barWidth = 16;
                    const x = 35 + idx * space;
                    const labelX = x + barWidth / 2;
                    const color = LINE_COLORS[idx % LINE_COLORS.length];
                    const height = (sec.percentage! / 100) * 60;
                    const y = 80 - height;

                    return (
                      <g key={sec.name}>
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={height}
                          rx="3"
                          fill={color}
                        />
                        <text
                          x={labelX}
                          y="95"
                          fill="#6B7280"
                          fontSize="6"
                          fontWeight="700"
                          textAnchor="middle"
                        >
                          {sec.name}
                        </text>
                      </g>
                    );
                  });
                })()}
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* 4. Defaulters by Section (Progress bars list) */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-3xs flex flex-col gap-4">
        <div>
          <h4 className="font-bold text-gray-900 text-[13px] leading-tight">
            Defaulters by Section
          </h4>
          <span className="text-[10px] font-semibold text-gray-400">
            Students below 75%
          </span>
        </div>

        {defaulterList.length === 0 ? (
          <div className="text-xs text-gray-400 font-semibold text-center py-4">
            No defaulters records found
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {defaulterList.map((sec, idx) => {
              const bg = BG_COLORS[idx % BG_COLORS.length];
              const maxDef = Math.max(...defaulterList.map((d) => d.count), 1);
              const widthPct =
                sec.count === 0
                  ? "0%"
                  : `${Math.max(15, (sec.count / maxDef) * 100)}%`;

              return (
                <div key={sec.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                    <span>{sec.name}</span>
                    <span
                      className={
                        sec.count === 0 ? "text-gray-400" : "text-red-500"
                      }
                    >
                      {sec.count} student{sec.count === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`${bg} h-1.5 rounded-full`}
                      style={{ width: widthPct }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
