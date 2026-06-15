import React, { useEffect, useState } from "react";
import axios from "axios";
import useTeacherProfile from "../../hooks/useteacherprofile";

// ─── Shared / Reused from Student module ──────────────────────────────────────
import WelcomeBanner from "../../components/Student/Dashboard/WelcomeBanner";
import Topbar from "../../components/Student/Dashboard/TopBar";
import CalendarSection from "../../components/Student/Dashboard/Calendar";
import CalendarMessageCard from "../../components/Student/Dashboard/CalendarMessageCard";
import NoticeBoard from "../../components/Student/Dashboard/NoticeBoard";
import type { Notice } from "../../components/Student/Dashboard/NoticeBoard";
import AttendanceWeekly from "../../components/Student/Attendance/AttendanceWeekly";
import Homework from "../../components/Student/Dashboard/Homework";
import type { Assignment } from "../../components/Student/Dashboard/Homework";

// ─── Teacher-specific components ─────────────────────────────────────────────
import TeacherNavbar from "../../components/Teacher/Dashboard/Navbar";
import TeacherTimetableSection from "../../components/Teacher/Dashboard/Teachertimetablesection";
import type { TeacherTimetableItem } from "../../components/Teacher/Dashboard/Teachertimetablesection";
import QuickActions from "../../components/Teacher/Dashboard/Quickactions";

import { getCurrentAPIDay } from "../../utils/dateHelpers";

// ─── Static data ──────────────────────────────────────────────────────────────
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

// ─── API response shape ───────────────────────────────────────────────────────
interface MySubjectApiItem {
  id: string;
  time: string;
  isBreak: boolean;
  breakLabel: string | null;
  room: string | null;
  subject: string | null;
  professor: string | null;
  duration?: string;
}

// ─── Time helpers ─────────────────────────────────────────────────────────────
const formatTo12h = (time24: string): string => {
  const [hStr, mStr] = time24.split(":");
  const h = parseInt(hStr, 10);
  const m = mStr || "00";
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${period}`;
};

const getEndTime24 = (startTime: string, duration?: string): string => {
  if (!duration) return startTime;
  const minutes = parseInt(duration, 10);
  if (isNaN(minutes)) return startTime;
  const [hStr, mStr] = startTime.split(":");
  const totalMins = parseInt(hStr, 10) * 60 + parseInt(mStr, 10) + minutes;
  const endH = Math.floor(totalMins / 60) % 24;
  const endM = String(totalMins % 60).padStart(2, "0");
  return `${String(endH).padStart(2, "0")}:${endM}`;
};

const getEndTime12h = (startTime: string, duration?: string): string =>
  formatTo12h(getEndTime24(startTime, duration));

const isNowActive = (startTime24: string, endTime24: string): boolean => {
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = startTime24.split(":").map(Number);
  const [eh, em] = endTime24.split(":").map(Number);
  return (
    currentMins >= sh * 60 + (sm || 0) && currentMins <= eh * 60 + (em || 0)
  );
};

// ─── Helper: compute minutes until a 24h time string ─────────────────────────
const minutesUntil = (time24: string): number => {
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const [h, m] = time24.split(":").map(Number);
  return h * 60 + (m || 0) - currentMins;
};

// ─── Helper: build the banner subtitle from fetched periods ───────────────────
const buildBannerSubtitle = (periods: MySubjectApiItem[]): string => {
  const totalClasses = periods.length;

  if (totalClasses === 0) {
    return "No classes scheduled for today. Enjoy your free day!";
  }

  const first = periods[0];
  const minsUntilFirst = minutesUntil(first.time);

  // Class name e.g. "Class 10 - Section A" → shorten to "Class 10 - Section A"
  const className = first.subject || "your first class";
  const room = first.room ? `Room ${first.room}` : "your classroom";

  if (minsUntilFirst > 0) {
    // First class hasn't started yet
    if (minsUntilFirst < 60) {
      return `You have ${totalClasses} ${totalClasses === 1 ? "class" : "classes"} today. Your first lecture starts in ${minsUntilFirst} ${minsUntilFirst === 1 ? "minute" : "minutes"} in ${room}, ${className}.`;
    } else {
      const hoursUntil = Math.floor(minsUntilFirst / 60);
      const minsLeft = minsUntilFirst % 60;
      const timeStr =
        minsLeft > 0
          ? `${hoursUntil}h ${minsLeft}m`
          : `${hoursUntil} hour${hoursUntil > 1 ? "s" : ""}`;
      return `You have ${totalClasses} ${totalClasses === 1 ? "class" : "classes"} today. Your first lecture starts in ${timeStr} in ${room}, ${className}.`;
    }
  } else {
    // First class already started or passed — find the next upcoming one
    const upcoming = periods.find((p) => minutesUntil(p.time) > 0);
   if (upcoming) {
  const minsLeft = minutesUntil(upcoming.time);
  const upcomingClass = upcoming.subject || "your next class";
  const upcomingRoom = upcoming.room ? `Room ${upcoming.room}` : "your classroom";
  
  // Format time nicely
  let timeStr: string;
  if (minsLeft < 60) {
    timeStr = `${minsLeft} ${minsLeft === 1 ? "minute" : "minutes"}`;
  } else {
    const hours = Math.floor(minsLeft / 60);
    const mins = minsLeft % 60;
    timeStr = mins > 0 ? `${hours}h ${mins}m` : `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  return `You have ${totalClasses} ${totalClasses === 1 ? "class" : "classes"} today. Next lecture in ${timeStr} — ${upcomingClass} in ${upcomingRoom}.`;
}
    // All classes done for the day
    return `You had ${totalClasses} ${totalClasses === 1 ? "class" : "classes"} today. Great work, all done!`;
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const TeacherDashboard: React.FC = () => {
  const { teacher, isLoading: profileLoading } = useTeacherProfile();
  const teacherFirstName =
    teacher?.firstName ?? (profileLoading ? "" : "Teacher");

  const [timetableItems, setTimetableItems] = useState<TeacherTimetableItem[]>(
    [],
  );
  const [timetableLoading, setTimetableLoading] = useState(true);
  const [bannerSubtitle, setBannerSubtitle] = useState("");

  const [noticeData, setNoticeData] = useState<Notice[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(true);

  // ─── Fetch today's timetable ──────────────────────────────────────────────
  useEffect(() => {
    const fetchTodayTimetable = async () => {
      try {
        setTimetableLoading(true);
        const token = localStorage.getItem("token");
        const today = getCurrentAPIDay(); // hardcode "MONDAY" for testing

        const response = await axios.get(
          "http://localhost:5000/api/academic/timetable/teacher/my-subject",
          {
            params: { day: today },
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data.success) {
          const apiItems: MySubjectApiItem[] = response.data.data;

          // Periods only (no breaks) for cards and subtitle
          const periods = apiItems.filter((item) => !item.isBreak);

          // Build banner subtitle from all periods (not just first 4)
          setBannerSubtitle(buildBannerSubtitle(periods));

          // Max 4 cards
          const limited = periods.slice(0, 4);

          const transformed: TeacherTimetableItem[] = limited.map((item) => {
            const endTime24 = getEndTime24(item.time, item.duration);
            return {
              id: item.id,
              className: item.subject || "No Class",
              startTime: formatTo12h(item.time),
              endTime: getEndTime12h(item.time, item.duration),
              subject: item.professor || "No Subject",
              room: item.room || "TBD",
              isActive: isNowActive(item.time, endTime24),
            };
          });

          setTimetableItems(transformed);
        }
      } catch (err) {
        console.error("Failed to fetch today's timetable:", err);
        setTimetableItems([]);
        setBannerSubtitle("Unable to load today's schedule.");
      } finally {
        setTimetableLoading(false);
      }
    };

    fetchTodayTimetable();
  }, []);

  // ─── Fetch notices ────────────────────────────────────────────────────────
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
        const raw = res.data?.data ?? res.data?.notices ?? res.data ?? [];
        const notices: Notice[] = Array.isArray(raw) ? raw : [];
        setNoticeData(notices.slice(0, 3));
      } catch (err) {
        console.error("Failed to load teacher notices:", err);
        setNoticeData([]);
      } finally {
        setNoticesLoading(false);
      }
    };
    fetchNotices();
  }, []);

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
                dynamicSubtitle={timetableLoading ? "" : bannerSubtitle}
              />
            </div>

            <TeacherTimetableSection
              schedule={timetableLoading ? [] : timetableItems}
            />

            <div className="flex gap-5 items-start pb-2">
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <p className="text-[18px] font-semibold text-gray-700 px-1">
                  Class - X (A)
                </p>
                <AttendanceWeekly heatmapData={STATIC_ATTENDANCE_HEATMAP} />
              </div>

              <div className="flex-1 min-w-0 mt-10">
                <Homework
                  assignments={STATIC_HOMEWORK}
                  tab1Label="Pending"
                  tab2Label="Ongoing"
                  tab2StatusKey="ONGOING"
                />
              </div>

              <div className="flex-1 min-w-0 mt-10">
                <NoticeBoard notices={noticeData} loading={noticesLoading} />
              </div>
            </div>
          </div>

          <div
            className="flex flex-col gap-4 w-[320px] shrink-0 overflow-y-auto
                        [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <CalendarSection className="w-full" variant="timetable" />
            <CalendarMessageCard className="w-full" />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
