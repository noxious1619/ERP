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

interface AttendanceAggregates {
  daysPresent: number;
  daysAbsent: number;
  totalTrackedDays: number;
  attendancePercentage: number;
}

const Dashboard = () => {
  const currentYear = 2026;
  const { studentData, loading: authLoading } = useAuth();
  
  // Data Extraction
  const studentId = studentData?.id;
  const firstName = studentData?.firstName || "Dishant";
  const lastName = studentData?.lastName || null;
  const displayId = studentData?.admissionNumber || "ADM-2026-001";
  const classValue = studentData?.class?.name || studentData?.class || "11";
  const sectionValue = studentData?.section?.name || studentData?.section || "A";
  const grade = `${classValue}${sectionValue}`;
  const profileImage = studentData?.profileImage || undefined;
  
  // Extract Section ID for the timetable
  const targetSectionId = studentData?.section?.id || studentData?.sectionId;

  // States
  const [heatmapData, setHeatmapData] = useState<Record<string, "P" | "A" | "H">>({});
  const [aggregates, setAggregates] = useState<AttendanceAggregates | null>(null);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]); // New state for Timetable
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [homeworkData, setHomeworkData] = useState<any[]>([]);
  const [noticeData, setNoticeData] = useState<any[]>([]);

  useEffect(() => {
    if (authLoading || !studentId) return;

    const fetchDashboardData = async () => {
      try {
        setLoadingData(true);
        const token = localStorage.getItem("token"); 
        
        // Fire ALL THREE API calls at the exact same time
        const [heatmapResponse, aggResponse, timetableResponse, homeworkResponse, noticeResponse] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/attendance/attendanceData/student/${studentId}/heatmap`,
            { params: { year: currentYear }, headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `http://localhost:5000/api/attendance/attendanceData/student/${studentId}/totalPercetage`,
            { params: { year: currentYear }, headers: { Authorization: `Bearer ${token}` } }
          ),
          targetSectionId 
            ? axios.get(`http://localhost:5000/api/academic/timetable/section/${targetSectionId}`, 
            { headers: { Authorization: `Bearer ${token}` } }) 
            : Promise.resolve(null),
          axios.get(`http://localhost:5000/api/assignments/my-feed`, 
            { headers: { Authorization: `Bearer ${token}` } }
            ),
          axios.get(`http://localhost:5000/api/notices/my`, 
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ]);
        
        console.log("Heatmap API response:", heatmapResponse?.data || "No data");
        console.log("Aggregates API response:", aggResponse?.data || "No data");
        console.log("Timetable API response:", timetableResponse?.data || "No data");
        console.log("Homework API response:", homeworkResponse?.data || "No data");
        console.log("Notice API response:", noticeResponse?.data || "No data");

        if (heatmapResponse?.data?.success) {
          setHeatmapData(heatmapResponse.data.heatmapMap);
        }
        if (aggResponse?.data?.success) {
          setAggregates(aggResponse.data.aggregates);
        }

        console.log("Raw timetable data for the week:", timetableResponse?.data?.data || "No timetable data fetched.");
        if (timetableResponse?.data?.success) {
          // 1. Change to ALL CAPS to match your database exactly
          const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
          const currentDayString = days[new Date().getDay()]; 
          
          const filteredForToday = timetableResponse.data.data.filter(
            // 2. Change `item.dayOfWeek` to `item.day`
            (item: any) => item.day === currentDayString
          );
          
          // Sort by start time so classes appear in chronological order
          const sortedSchedule = filteredForToday.sort((a: any, b: any) => 
            a.startTime.localeCompare(b.startTime)
          );
          
          setTodaySchedule(sortedSchedule);
        }
        if (homeworkResponse?.data?.success) {
          // console.log("Homework data fetched:", homeworkResponse.data.data || "No homework data found.");
          setHomeworkData(homeworkResponse.data.data || homeworkResponse.data.assignments || []);
        }
        
        if (noticeResponse?.data) {
          const fetchedNotices = noticeResponse.data.data || noticeResponse.data.notices || noticeRes.data || [];
          setNoticeData(Array.isArray(fetchedNotices) ? fetchedNotices : []);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardData();
  }, [studentId, authLoading, targetSectionId]);

  const showSkeleton = authLoading || loadingData;

  return (
    <div className="flex gap-4 bg-[#F8F9FE]">
      <Navbar />
      <div className="flex-1 min-w-0 flex flex-col gap-6 h-screen overflow-y-auto px-8 pb-8">
        <TopBar />
        
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            <WelcomeBanner studentName={firstName} />
          </div>

          <div className="w-[330px] shrink-0 mr-6">
            <StudentProfileCard 
              firstName={firstName}
              lastName={lastName || ""}
              studentId={displayId}
              grade={grade}
              profileImageUrl={profileImage}
            />
          </div>
        </div>
        
        {/* Bottom Content */}
        <div className="flex gap-5 items-start">
          
          {/* Left Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            
            {/* 1. PASS THE SCHEDULE DOWN TO THE COMPONENT */}
            <TimetableSection 
              schedule={todaySchedule}  
              loading={showSkeleton} 
            />

            <div className="flex gap-5 items-start">
              <div className="flex-1 min-w-0">
                <Homework 
                  assignments={homeworkData}
                  loading={showSkeleton}/>
              </div>

              <div className="flex-1 min-w-0">
                <NoticeBoard 
                  notices={noticeData} 
                  loading={showSkeleton} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
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