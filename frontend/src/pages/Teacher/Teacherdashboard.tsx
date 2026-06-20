import React, { useEffect, useState } from "react";
import axios from "axios";
import useTeacherProfile from "../../hooks/useteacherprofile";
import WelcomeBanner from "../../components/Student/Dashboard/WelcomeBanner";
import Topbar from "../../components/Student/Dashboard/TopBar";
import CalendarSection from "../../components/Student/Dashboard/Calendar";
import CalendarMessageCard from "../../components/Student/Dashboard/CalendarMessageCard";
import NoticeBoard from "../../components/Student/Dashboard/NoticeBoard";
import type { Notice } from "../../components/Student/Dashboard/NoticeBoard";
import AttendanceWeekly from "../../components/Student/Attendance/AttendanceWeekly";
import Homework from "../../components/Student/Dashboard/Homework";
import type { Assignment } from "../../components/Student/Dashboard/Homework";
import TeacherNavbar from "../../components/Teacher/Dashboard/Navbar";
import TeacherTimetableSection from "../../components/Teacher/Dashboard/Teachertimetablesection";
import type { TeacherTimetableItem } from "../../components/Teacher/Dashboard/Teachertimetablesection";
import QuickActions from "../../components/Teacher/Dashboard/Quickactions";

const STATIC_TIMETABLE: TeacherTimetableItem[] = [
  {
    id: "1",
    className: "Class – X(A)",
    startTime: "9:00 AM",
    endTime: "10:00 AM",
    subject: "English",
    room: "ROOM-101",
    isActive: true,
  },
  {
    id: "2",
    className: "Class – XI(B)",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    subject: "English",
    room: "ROOM-102",
  },
  {
    id: "3",
    className: "Class – XII(C)",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    subject: "English",
    room: "ROOM-103",
  },
  {
    id: "4",
    className: "Class – XI(A)",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    subject: "English",
    room: "ROOM-105",
  },
];

const STATIC_HOMEWORK: Assignment[] = [
  {
    id: "1",
    title: "Chapter 3 Review",
    subject: "Class – X(A)",
    dueDate: "Today",
    dueTime: "12:00 AM",
    status: "PENDING",
  },
  {
    id: "2",
    title: "Essay Writing",
    subject: "Class – X(A)",
    dueDate: "9th May",
    dueTime: "10:00 AM",
    status: "PENDING",
  },
  {
    id: "3",
    title: "Grammar Test",
    subject: "Class – X(A)",
    dueDate: "9th May",
    dueTime: "11:00 AM",
    status: "ONGOING",
  },
];

const STATIC_ATTENDANCE_HEATMAP: Record<string, "P" | "A" | "H"> = {
  "2026-09-01": "P",
  "2026-09-02": "P",
  "2026-09-03": "P",
  "2026-09-04": "A",
  "2026-09-05": "P",
  "2026-09-08": "P",
  "2026-09-09": "A",
  "2026-09-10": "P",
  "2026-09-11": "P",
  "2026-09-12": "A",
  "2026-09-15": "P",
  "2026-09-16": "P",
  "2026-09-17": "P",
  "2026-09-18": "P",
  "2026-09-19": "A",
  "2026-09-22": "P",
  "2026-09-23": "A",
  "2026-09-24": "P",
  "2026-09-25": "P",
  "2026-09-26": "A",
};

const TeacherDashboard: React.FC = () => {
  // ── Teacher profile (name for banner) ──────────────────────────────────────
  // GET /api/teachers/me — same endpoint as TeacherProfilePage
  const { teacher, isLoading: profileLoading } = useTeacherProfile();
  const teacherFirstName =
    teacher?.firstName ?? (profileLoading ? "" : "Teacher");

  // ── Notices ────────────────────────────────────────────────────────────────
  // GET /api/notices/teacher — returns notices relevant to the logged-in teacher
  // We slice to the first 3 for the dashboard card.
  const [noticeData, setNoticeData] = useState<Notice[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/notices/teacher",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        // Backend may return: res.data.data / res.data.notices / res.data directly
        const raw = res.data?.data ?? res.data?.notices ?? res.data ?? [];
        const notices: Notice[] = Array.isArray(raw) ? raw : [];

        // Only show the first 3 on the dashboard
        setNoticeData(notices.slice(0, 3));
      } catch (err) {
        console.error("Failed to load teacher notices:", err);
        setNoticeData([]);
      } finally {
        setNoticesLoading(false);
      }
    };

    fetchNotices();
  }, []); // runs once on mount — teacher notices don't depend on any id

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F2F5]">
      <TeacherNavbar />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Topbar profilePath="/teacher/profile" />

        <div className="flex flex-1 min-w-0 pl-6 pr-6 pt-3 pb-6 gap-5 overflow-hidden">
          <div
            className="flex flex-1 flex-col min-w-0 gap-5 overflow-y-auto
                          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-1"
          >
            <div className="shrink-0">
              <WelcomeBanner
                studentName={teacherFirstName}
                schedulePath="/teacher/timetable"
                showSubtitle={false}
              />
            </div>

            <TeacherTimetableSection schedule={STATIC_TIMETABLE} />

            <div className="flex gap-5 items-start pb-2">
              {/* When dynamic: fetch GET /api/teacher/attendance/heatmap */}
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-700 px-1">
                  Class - X (A)
                </p>
                <AttendanceWeekly heatmapData={STATIC_ATTENDANCE_HEATMAP} />
              </div>

              {/* When dynamic: fetch GET /api/teacher/homework?classId=... */}
              <div className="flex-1 min-w-0 mt-8">
                <Homework
                  assignments={STATIC_HOMEWORK}
                  tab1Label="Pending"
                  tab2Label="Ongoing"
                  tab2StatusKey="ONGOING"
                />
              </div>

              {/* Live data: GET /api/notices/teacher, first 3 notices */}
              {/* noticeBoardPath: clicking a notice navigates to /teacher/notices?highlight=<id> */}
              <div className="flex-1 min-w-0 mt-8">
                <NoticeBoard
                  notices={noticeData}
                  loading={noticesLoading}
                  noticeBoardPath="/teacher/notices"
                />
              </div>
            </div>
          </div>

          <div
            className="flex flex-col gap-4 w-[320px] shrink-0 overflow-y-auto
                          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <CalendarSection variant="timetable" className="w-full" />
            <CalendarMessageCard className="w-full" />

            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
