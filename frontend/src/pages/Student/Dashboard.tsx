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
// import CalendarMessageCard from "../../components/Student/Dashboard/CalendarMessageCard";
import Calendar from "../../components/Student/Dashboard/Calendar";
import YourSubjects from "../../components/Student/Dashboard/YourSubjects";
import Attendance from "../../components/Student/Dashboard/Attendance";

const Dashboard = () => {
  const currentYear = 2026;
  const { studentData, loading: authLoading } = useAuth();
  const studentId = studentData?.id;

  // 1. Setup the state for our dynamic calendar
  const [heatmapData, setHeatmapData] = useState<Record<string, "P" | "A" | "H">>({});
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // 2. Fetch the data when the dashboard loads
  useEffect(() => {
    if (authLoading || !studentId) return;

    const fetchDashboardHeatmap = async () => {
      try {
        setLoadingData(true);
        const token = localStorage.getItem("token"); 

        const heatmapResponse = await axios.get(
          `http://localhost:5000/api/attendance/attendanceData/student/${studentId}/heatmap`,
          {
            params: { year: currentYear },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (heatmapResponse.data.success) {
          setHeatmapData(heatmapResponse.data.heatmapMap);
        }
      } catch (err) {
        console.error("Failed to load dashboard calendar data:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardHeatmap();
  }, [studentId, authLoading]);

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
                <Attendance />
              </div>
            </div>
            
            {/* <YourSubjects /> */}
          </div>
          
          {/* RIGHT COLUMN */}
          <div className="w-[290px] shrink-0 flex flex-col gap-5 mr-16 mt-8">
            
            {/* 3. Pass the fetched data directly into the Calendar */}
            <div className={`transition-opacity duration-300 ${loadingData ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
              <Calendar heatmapData={heatmapData} />
            </div>
            
            {/* <CalendarMessageCard /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;