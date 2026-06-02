import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth"; 
import Navbar from "../../components/Student/Dashboard/Navbar";
import AttendanceHeader from "../../components/Student/Attendance/AttendanceHeader";
import CurrentStatusCard from "../../components/Student/Attendance/CurrentStatusCard";
import Calendar from "../../components/Student/Dashboard/Calendar";
import AttendanceYearlyGraph from "../../components/Student/Attendance/AttendanceYearlyGraph";
import AttendanceWeekly from "../../components/Student/Attendance/AttendanceWeekly";
import AttendanceYearlyChart from "../../components/Student/Attendance/AttendanceYearly/AttendanceYearlyChart ";

// Define explicit type structures for complete dashboard safety
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

const AttendanceTracker = () => {
  const currentYear = 2026;

  // Extract auth state cleanly from your global context provider
  const { studentData, loading: authLoading } = useAuth();
  
  // Extract studentId dynamically from profile fields
  const studentId = studentData?.id;

  // State Management
  const [aggregates, setAggregates] = useState<AttendanceAggregates | null>(null);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyDataPoint[]>([]);
  const [heatmapData, setHeatmapData] = useState<Record<string, 'P' | 'A'>>({});
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Guard Clause: Don't execute calls if auth context hasn't resolved or profile is missing
    if (authLoading || !studentId) return;

    const fetchDashboardData = async () => {
      try {
        setLoadingData(true);
        setError(null);
        
        // Grab token securely from your local storage engine
        const token = localStorage.getItem("token"); 
        
        // Fire api tracking routes together concurrently to prevent layout waterfall blocks
        const [aggResponse, trendResponse, heatmapResponse] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/attendance/attendanceData/student/${studentId}/totalPercetage`,
            {
              params: { year: currentYear },
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(
            `http://localhost:5000/api/attendance/attendanceData/student/${studentId}/monthly-trends`,
            {
              params: { year: currentYear },
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(`http://localhost:5000/api/attendance/attendanceData/student/${studentId}/heatmap`, {
            params: { year: currentYear },
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        if (aggResponse.data.success) {
          setAggregates(aggResponse.data.aggregates);
        }
        if (trendResponse.data.success) {
          // console.log("Monthly Trends Raw Data:", trendResponse.data.monthlyOverview);
          setMonthlyTrends(trendResponse.data.monthlyOverview);
        }
        if (heatmapResponse.data.success){
          console.log("Heatmap Data:", heatmapResponse.data.heatmapMap);
          setHeatmapData(heatmapResponse.data.heatmapMap);
        }
      } catch (err: any) {
        console.error("Dashboard data aggregation failed:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [studentId, authLoading]);

  // Unified unified loading screen driver condition
  const showSkeleton = authLoading || loadingData;

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />

      {/* Main Wrapper */}
      <div className="flex flex-1 h-screen overflow-hidden">
        {/* LEFT CONTENT */}
        <div className="flex-1 flex flex-col px-5">
          {/* Static Header — never scrolls */}
          <div className="flex-shrink-0 pt-8 bg-white z-10">
            <AttendanceHeader />
          </div>

          {/* Scrollable content below header */}
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
                {/* Dynamically pass down data and tracking states directly to the card */}
                <CurrentStatusCard 
                  daysPresent={aggregates?.daysPresent || 0}
                  daysAbsent={aggregates?.daysAbsent || 0}
                  attendancePercentage={aggregates?.attendancePercentage || 0}
                  loading={showSkeleton}
                />
                
                {/* Weekly breakdown dashboard card display component */}
                <AttendanceWeekly />
                
                <div className="shrink-0">
                  <Calendar />
                </div>
              </div>
              
              <AttendanceYearlyGraph 
                data={monthlyTrends} 
                loading={showSkeleton} 
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR — fully independent, never affected by left scroll */}
        <div
          className="w-[340px] bg-gray-100 shrink-0 h-screen overflow-y-auto flex flex-col items-center px-2 "
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="mt-8 w-full">
            {/* Dynamic CSS Custom Column Bar Chart Widget with data links attached */}
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