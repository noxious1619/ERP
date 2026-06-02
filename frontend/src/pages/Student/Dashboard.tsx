import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth"; 

import Navbar from "../../components/Student/Dashboard/Navbar";
import TopBar from "../../components/Student/Dashboard/TopBar";
import WelcomeBanner from "../../components/Student/Dashboard/WelcomeBanner";
import StudentProfileCard from "../../components/Student/Dashboard/StudentprofileCard";
import TimetableSection from "../../components/Student/Dashboard/TimetableSection";
import Homework from "../../components/Student/Dashboard/Homework";
import NoticeBoard from "../../components/Student/Dashboard/NoticeBoard";
import Calendar from "../../components/Student/Dashboard/Calendar";
import CurrentStatusCard from "../../components/Student/Attendance/CurrentStatusCard";

// Define the interface for the aggregates data
interface AttendanceAggregates {
  daysPresent: number;
  daysAbsent: number;
  totalTrackedDays: number;
  attendancePercentage: number;
}

const Dashboard = () => {
  const currentYear = 2026;
  const { studentData, loading: authLoading } = useAuth();
  const studentId = studentData?.id;

  // 1. Setup states for BOTH the calendar and the status card
  const [heatmapData, setHeatmapData] = useState<Record<string, "P" | "A" | "H">>({});
  const [aggregates, setAggregates] = useState<AttendanceAggregates | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // 2. Fetch all required dashboard data concurrently
  useEffect(() => {
    if (authLoading || !studentId) return;

    const fetchDashboardData = async () => {
      try {
        setLoadingData(true);
        const token = localStorage.getItem("token"); 
        
        // Fire both API calls at the exact same time
        const [heatmapResponse, aggResponse] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/attendance/attendanceData/student/${studentId}/heatmap`,
            { params: { year: currentYear }, headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `http://localhost:5000/api/attendance/attendanceData/student/${studentId}/totalPercetage`,
            { params: { year: currentYear }, headers: { Authorization: `Bearer ${token}` } }
          )
        ]);

        if (heatmapResponse.data.success) {
          setHeatmapData(heatmapResponse.data.heatmapMap);
        }
        if (aggResponse.data.success) {
          setAggregates(aggResponse.data.aggregates);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [studentId, authLoading]);

  // Unified loading state
  const showSkeleton = authLoading || loadingData;

  return (
    <div className="flex gap-4 bg-[#F8F9FE]">
      <Navbar />
      <div className="flex-1 min-w-0 flex flex-col gap-6 h-screen overflow-y-auto px-8 pb-8">
        <TopBar />
        
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <WelcomeBanner />
          </div>

          <div className="w-[330px] shrink-0 mr-6">
            <StudentProfileCard />
          </div>
        </div>
        
        {/* Bottom Content */}
        <div className="flex gap-5 items-start">
          
          {/* Left Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            <TimetableSection />

            <div className="flex gap-5 items-start">
              <div className="flex-1 min-w-0">
                <Homework />
              </div>

              <div className="flex-1 min-w-0">
                <NoticeBoard />
              </div>
              
              <div className="flex-1 min-w-0">
                {/* 3. Status Card now has real data passed to it! */}
                <CurrentStatusCard 
                  daysPresent={aggregates?.daysPresent || 0}
                  daysAbsent={aggregates?.daysAbsent || 0}
                  attendancePercentage={aggregates?.attendancePercentage || 0}
                  loading={showSkeleton}
                />
              </div>
            </div>
          </div>
          
          {/* RIGHT COLUMN */}
          <div className="w-[290px] shrink-0 flex flex-col gap-5 mr-16 mt-8">
            
            {/* 4. Calendar gets its heatmap data */}
            <div className={`transition-opacity duration-300 ${loadingData ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
              <Calendar heatmapData={heatmapData} />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;