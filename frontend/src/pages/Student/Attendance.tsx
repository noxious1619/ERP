import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Navbar from "../../components/Student/Dashboard/Navbar";
import AttendanceHeader from "../../components/Student/Attendance/AttendanceHeader";
import CurrentStatusCard from "../../components/Student/Attendance/CurrentStatusCard";
import Calendar from "../../components/Student/Dashboard/Calendar";
import AttendanceYearlyGraph from "../../components/Student/Attendance/AttendanceYearlyGraph";
import AttendanceWeekly from "../../components/Student/Attendance/AttendanceWeekly";
import AttendanceYearlyChart from "../../components/Student/Attendance/AttendanceYearly/AttendanceYearlyChart ";
import { API_BASE_URL } from "../../lib/api";

interface AttendanceAggregates {
  daysPresent: number;
  daysAbsent: number;
  totalTrackedDays: number;
  attendancePercentage: number;
}

interface MonthlyDataPoint {
  month: string;
  present: number;
  totalDays: number;
  percentage: number;
}

interface WeeklyTrend {
  week: string;
  present: number;
  totalDays: number;
  percentage: number;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Derive week-by-week attendance stats for a given month from the flat heatmap map.
// Weeks are simple calendar chunks: 1-7, 8-14, 15-21, 22-end.
function getWeeklyTrends(
  heatmapData: Record<string, "P" | "A">,
  year: number,
  monthIndex: number, // 0-based
): WeeklyTrend[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const weeks: WeeklyTrend[] = [];

  for (let start = 1; start <= daysInMonth; start += 7) {
    const end = Math.min(start + 6, daysInMonth);
    let present = 0;
    let totalDays = 0;

    for (let day = start; day <= end; day++) {
      const mm = String(monthIndex + 1).padStart(2, "0");
      const dd = String(day).padStart(2, "0");
      const key = `${year}-${mm}-${dd}`;
      const status = heatmapData[key];

      if (status === "P" || status === "A") {
        totalDays++;
        if (status === "P") present++;
      }
    }

    weeks.push({
      week: `W${weeks.length + 1}`,
      present,
      totalDays,
      percentage: totalDays > 0 ? Math.round((present / totalDays) * 100) : 0,
    });
  }

  return weeks;
}

const AttendanceTracker = () => {
  const currentYear = 2026;

  const { studentData, loading: authLoading } = useAuth();
  const studentId = studentData?.id;

  const [aggregates, setAggregates] = useState<AttendanceAggregates | null>(
    null,
  );
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyDataPoint[]>([]);
  const [heatmapData, setHeatmapData] = useState<Record<string, "P" | "A">>({});
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Track which month is being viewed in the weekly breakdown widget
  const [weeklyMonthIndex, setWeeklyMonthIndex] = useState<number>(
    new Date().getMonth(),
  );

  useEffect(() => {
    if (authLoading || !studentId) return;

    const fetchDashboardData = async () => {
      try {
        setLoadingData(true);
        setError(null);
        const token = localStorage.getItem("token");

        const [aggResponse, trendResponse, heatmapResponse] = await Promise.all(
          [
            axios.get(
              `${API_BASE_URL}/api/attendance/attendanceData/student/${studentId}/totalPercentage`,
              {
                params: { year: currentYear },
                headers: { Authorization: `Bearer ${token}` },
              },
            ),
            axios.get(
              `${API_BASE_URL}/api/attendance/attendanceData/student/${studentId}/monthly-trends`,
              {
                params: { year: currentYear },
                headers: { Authorization: `Bearer ${token}` },
              },
            ),
            axios.get(
              `${API_BASE_URL}/api/attendance/attendanceData/student/${studentId}/heatmap`,
              {
                params: { year: currentYear },
                headers: { Authorization: `Bearer ${token}` },
              },
            ),
          ],
        );

        if (aggResponse.data.success)
          setAggregates(aggResponse.data.aggregates);
        if (trendResponse.data.success)
          setMonthlyTrends(trendResponse.data.monthlyOverview);
        if (heatmapResponse.data.success)
          setHeatmapData(heatmapResponse.data.heatmapMap);
      } catch (err: any) {
        console.error("Dashboard data aggregation failed:", err);
        setError(
          err.response?.data?.message || "Failed to load dashboard data.",
        );
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [studentId, authLoading]);

  const showSkeleton = authLoading || loadingData;

  const weeklyTrends = useMemo(
    () => getWeeklyTrends(heatmapData, currentYear, weeklyMonthIndex),
    [heatmapData, weeklyMonthIndex],
  );

  const handlePrevMonth = () => setWeeklyMonthIndex((m) => Math.max(0, m - 1));
  const handleNextMonth = () => setWeeklyMonthIndex((m) => Math.min(11, m + 1));

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />

      <div className="flex flex-1 h-screen overflow-hidden">
        <div className="flex-1 flex flex-col px-5">
          <div className="flex-shrink-0 pt-8 bg-white z-10">
            <AttendanceHeader title="Attendance Tracker" />
          </div>

          <div
            className="flex-1 overflow-y-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl font-medium">
                {error}
              </div>
            )}

            <div className="mt-12 flex flex-col gap-8 py-10 px-2">
              <div className="flex items-start gap-8">
                <CurrentStatusCard
                  daysPresent={aggregates?.daysPresent || 0}
                  daysAbsent={aggregates?.daysAbsent || 0}
                  attendancePercentage={aggregates?.attendancePercentage || 0}
                  loading={showSkeleton}
                />

                <AttendanceWeekly
                  trends={weeklyTrends}
                  loading={showSkeleton}
                  // heatmapData={heatmapData}
                  monthLabel={MONTH_NAMES[weeklyMonthIndex]}
                  yearLabel={currentYear}
                  onPrev={handlePrevMonth}
                  onNext={handleNextMonth}
                  isNextDisabled={weeklyMonthIndex >= 11}
                />

                <div className="shrink-0">
                  <Calendar heatmapData={heatmapData} />
                </div>
              </div>

              <AttendanceYearlyGraph
                data={monthlyTrends}
                loading={showSkeleton}
              />
            </div>
          </div>
        </div>

        <div
          className="w-[340px] bg-gray-100 shrink-0 h-screen overflow-y-auto flex flex-col items-center px-2 "
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="mt-8 w-full">
            <AttendanceYearlyChart
              heatmapData={heatmapData}
              loading={showSkeleton}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
