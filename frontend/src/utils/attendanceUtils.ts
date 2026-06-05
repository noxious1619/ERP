// src/utils/attendanceUtils.ts

export interface WeekData {
  label: string;
  percentage: number;
}

export interface MonthData {
  month: string;
  year: number;
  weeks: WeekData[];
}

/**
 * Transforms a daily heatmap dictionary into grouped weekly percentages.
 * @param heatmapData - Record of daily status tokens (e.g., { "2026-09-01": "P" })
 * @param year - The calendar year to process
 * @returns Processed array of monthly data and the index of the most recently active month
 */
export function processWeeklyAttendance(
  heatmapData: Record<string, any> = {},
  year: number = 2026
): { data: MonthData[]; defaultIndex: number } {
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const processed: MonthData[] = [];
  let lastActiveMonthIndex = 0;

  for (let m = 0; m < 12; m++) {
    const monthStr = String(m + 1).padStart(2, "0");
    const weeks = [
      { label: "Week 1", p: 0, total: 0 },
      { label: "Week 2", p: 0, total: 0 },
      { label: "Week 3", p: 0, total: 0 },
      { label: "Week 4", p: 0, total: 0 },
    ];

    const daysInMonth = new Date(year, m + 1, 0).getDate();
    let hasData = false;

    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = String(d).padStart(2, "0");
      const dateKey = `${year}-${monthStr}-${dayStr}`;
      const status = heatmapData[dateKey];

      // Only calculate days where the student was marked Present or Absent
      if (status === "P" || status === "A") {
        hasData = true;
        
        // Group days into 4 calendar chunks
        let weekIndex = 0;
        if (d > 7 && d <= 14) weekIndex = 1;
        else if (d > 14 && d <= 21) weekIndex = 2;
        else if (d > 21) weekIndex = 3;

        weeks[weekIndex].total += 1;
        if (status === "P") weeks[weekIndex].p += 1;
      }
    }

    if (hasData) lastActiveMonthIndex = m;

    processed.push({
      month: monthNames[m],
      year: year,
      weeks: weeks.map(w => ({
        label: w.label,
        percentage: w.total > 0 ? Math.round((w.p / w.total) * 100) : 0
      }))
    });
  }

  return { data: processed, defaultIndex: lastActiveMonthIndex };
}