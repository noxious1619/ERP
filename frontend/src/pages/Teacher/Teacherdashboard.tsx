import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth"; 
import WelcomeBanner from "../../components/Student/Dashboard/WelcomeBanner";
import Topbar from "../../components/Student/Dashboard/TopBar";
import CalendarSection from "../../components/Student/Dashboard/Calendar";
import NoticeBoard from "../../components/Student/Dashboard/NoticeBoard";
import type { Notice } from "../../components/Student/Dashboard/NoticeBoard";
import AttendanceWeekly from "../../components/Student/Attendance/AttendanceWeekly";
import Homework from "../../components/Student/Dashboard/Homework";
import type { Assignment } from "../../components/Student/Dashboard/Homework";
import TeacherNavbar from "../../components/Teacher/Dashboard/Navbar";
import TeacherTimetableSection from "../../components/Teacher/Dashboard/Teachertimetablesection";
import type { TeacherTimetableItem } from "../../components/Teacher/Dashboard/Teachertimetablesection";
import QuickActions from "../../components/Teacher/Dashboard/Quickactions";

const TeacherDashboard: React.FC = () => {
  // ── Auth Data ─────────────────────────────────────────────────────────────
  const { token, teacherData } = useAuth();
  const teacherFirstName = teacherData?.firstName || "Teacher";

  // ── States ────────────────────────────────────────────────────────────────
  const [noticeData, setNoticeData] = useState<Notice[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(true);

  const [schedule, setSchedule] = useState<TeacherTimetableItem[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  const [currentAttendanceDate, setCurrentAttendanceDate] = useState(new Date());
  const [attendanceTrends, setAttendanceTrends] = useState<any[]>([]);
  const [attendanceMonth, setAttendanceMonth] = useState("");
  const [attendanceYear, setAttendanceYear] = useState("");
  const [attendanceLoading, setAttendanceLoading] = useState(true);

  // New Homework States
  const [homeworkList, setHomeworkList] = useState<Assignment[]>([]);
  const [homeworkLoading, setHomeworkLoading] = useState(true);

  // ── Data Fetching ──────────────────────────────
  useEffect(() => {
    if (!token) return;

    // 1. Fetch Notices
    const fetchNotices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/notices/teacher", { headers: { Authorization: `Bearer ${token}` } });
        const raw = res.data?.data ?? res.data?.notices ?? res.data ?? [];
        setNoticeData(Array.isArray(raw) ? raw.slice(0, 6) : []);
      } catch (err) {
        console.error("Failed to load teacher notices:", err);
      } finally {
        setNoticesLoading(false);
      }
    };

    // 2. Fetch Timetable
    const fetchTimetable = async () => {
      if (!teacherData?.id) return;
      try {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let today = daysOfWeek[new Date().getDay()];
        if (today === "Sunday") today = "Monday"; // Fallback to Monday schedule on Sunday
        const res = await axios.get(
          `http://localhost:5000/api/timetable/teacher/${teacherData.id}/daily?day=${today}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const rawData = res.data?.data || [];
        const formattedSchedule = rawData.map((item: any) => ({
          id: item.id,
          className: item.sectionLabel || item.className || "Class", 
          startTime: item.time,
          endTime: item.endTime,
          subject: item.subject,
          room: item.room || "TBD",
          isActive: item.isActive,
        }));
        setSchedule(formattedSchedule);
      } catch (err) {
        console.error("Failed to load timetable:", err);
      } finally {
        setScheduleLoading(false);
      }
    };

    // 3. Fetch Homework
    const fetchHomework = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/assignments/list",
          { 
            headers: { Authorization: `Bearer ${token}` },
            params: {
              pageSize: 5,
              classId: teacherData?.classTeacherOf?.academicClass?.id || "",
              sectionId: teacherData?.classTeacherOf?.id || "",
            }
          }
        );

        const rawData = res.data?.data || [];
        // console.log("Raw homework data fetched:", rawData);

        // Helper to format dates like "9th May" or "Today"
        const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          const today = new Date();
          if (date.toDateString() === today.toDateString()) return "Today";
          
          const day = date.getDate();
          const suffix = ["th", "st", "nd", "rd"][((day % 100) - 20) % 10] || ["th", "st", "nd", "rd"][day % 100] || "th";
          const month = date.toLocaleString("en-US", { month: "short" });
          return `${day}${suffix} ${month}`;
        };

        // Helper to format time like "10:00 AM"
        const formatTime = (dateString: string) => {
          return new Date(dateString).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        };

        // Map backend data to UI
        const formattedHomework = rawData.map((item: any) => {
          const isPastOrToday = new Date(item.dueDate) <= new Date();
          return {
            id: item.id,
            title: item.title,
            subject: `${item.class.name} - ${item.section.name}`, // Output: "Class 10 - A"
            dueDate: formatDate(item.dueDate),
            dueTime: formatTime(item.dueDate),
            status: isPastOrToday ? "OVERDUE" : "PENDING"
          };
        });

        setHomeworkList(formattedHomework);
      } catch (err) {
        console.error("Failed to load homework:", err);
      } finally {
        setHomeworkLoading(false);
      }
    };

    fetchNotices();
    fetchTimetable();
    fetchHomework();
  }, [token, teacherData?.id]); 

  // ── Dependent Data Fetch (Attendance Calendar) ────────────────────────────
  useEffect(() => {
    if (!token) return;
    const sectionId = teacherData?.classTeacherOf?.id || teacherData?.teachingAssignments?.[0]?.section?.id;
    if (!sectionId) {
      setAttendanceLoading(false);
      return;
    }

    const fetchAttendance = async () => {
      setAttendanceLoading(true);
      try {
        const month = currentAttendanceDate.getMonth() + 1;
        const year = currentAttendanceDate.getFullYear();

        const res = await axios.get(
          `http://localhost:5000/api/attendance/attendanceData/section/${sectionId}/weekly-trends`,
          { 
            headers: { Authorization: `Bearer ${token}` },
            params: { month, year }
          }
        );
        
        setAttendanceTrends(res.data.weeklyTrends || []);
        setAttendanceMonth(res.data.monthName);
        setAttendanceYear(res.data.year);
      } catch (err) {
        console.error("Failed to fetch attendance trends", err);
        setAttendanceTrends([]);
      } finally {
        setAttendanceLoading(false);
      }
    };

    fetchAttendance();
  }, [token, currentAttendanceDate, teacherData]);

  // ── Navigation Handlers ──────────────────────────────────────
  const handlePrevMonth = () => {
    setCurrentAttendanceDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentAttendanceDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const isNextDisabled = 
    currentAttendanceDate.getMonth() === new Date().getMonth() && 
    currentAttendanceDate.getFullYear() === new Date().getFullYear();

  const classNameLabel = teacherData?.classTeacherOf 
    ? `${teacherData.classTeacherOf.academicClass.name} - ${teacherData.classTeacherOf.name}`
    : teacherData?.teachingAssignments?.[0]?.section
      ? `${teacherData.teachingAssignments[0].section.academicClass.name} - ${teacherData.teachingAssignments[0].section.name}`
      : "No Class Assigned";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F2F5]">
      <TeacherNavbar />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Topbar profilePath="/teacher/profile" />

        <div className="flex flex-1 min-w-0 pl-6 pr-6 pt-3 pb-6 gap-5 overflow-hidden">
          <div className="flex flex-1 flex-col min-w-0 gap-5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-1">
            <div className="shrink-0">
              <WelcomeBanner studentName={teacherFirstName} schedulePath="/teacher/timetable" showSubtitle={false} />
            </div>

            <TeacherTimetableSection schedule={schedule} loading={scheduleLoading} />

            <div className="flex gap-5 items-start pb-2">
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-700 px-1">
                  Class - {classNameLabel}
                </p>
                <AttendanceWeekly 
                  trends={attendanceTrends}
                  loading={attendanceLoading}
                  monthLabel={attendanceMonth}
                  yearLabel={attendanceYear}
                  onPrev={handlePrevMonth}
                  onNext={handleNextMonth}
                  isNextDisabled={isNextDisabled}
                />
              </div>

              <div className="flex-1 min-w-0 mt-8">
                {/* Dynamically pass the homework list here */}
                {homeworkLoading ? (
                   <div className="bg-white rounded-[18px] p-6 h-[250px] animate-pulse flex flex-col gap-4">
                     <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                     <div className="h-16 bg-gray-100 rounded w-full"></div>
                     <div className="h-16 bg-gray-100 rounded w-full"></div>
                   </div>
                ) : (
                  <Homework 
                    assignments={homeworkList} 
                    tab1Label="Pending" 
                    tab2Label="Overdue" 
                    tab2StatusKey="OVERDUE" 
                  />
                )}
              </div>

              <div className="flex-1 min-w-0 mt-8">
                <NoticeBoard notices={noticeData} loading={noticesLoading} noticeBoardPath="/teacher/notices" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-[320px] shrink-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <CalendarSection variant="timetable" className="w-full" />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;