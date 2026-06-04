import React from "react";
import TimetableScheduleCard from "../../../components/Student/Timetable/ScheduleCard";
import type { TeacherFilterMode } from "./TeacherTimetableHeader";

// ─── Static class-wise data (backend pending) ─────────────────────────────────
const CLASS_SCHEDULE = [
  {
    id: "1",
    time: "09:00 AM",
    isActive: true,
    isBreak: false,
    breakLabel: null,
    room: "Room 402B",
    color: null,
    subject: "Advanced Mathematics",
    professor: "Dr. Sarah Smith",
    duration: undefined,
  },
  {
    id: "2",
    time: "10:00 AM",
    isActive: false,
    isBreak: false,
    breakLabel: null,
    room: "Room 105",
    color: null,
    subject: "Theoretical Physics",
    professor: "Prof. James Miller",
    duration: "45 MINUTES",
  },
  {
    id: "3",
    time: "11:00 AM",
    isActive: false,
    isBreak: true,
    breakLabel: "Coffee Break & Social",
    room: null,
    color: null,
    subject: null,
    professor: null,
    duration: undefined,
  },
  {
    id: "4",
    time: "12:00 PM",
    isActive: false,
    isBreak: false,
    breakLabel: null,
    room: "Lab 3",
    color: null,
    subject: "Organic Chemistry Lab",
    professor: "Dr. Elena Rodriguez",
    duration: "90 MINUTES",
  },
  {
    id: "5",
    time: "02:00 PM",
    isActive: false,
    isBreak: false,
    breakLabel: null,
    room: "Main Hall",
    color: null,
    subject: "Introduction to Ethics",
    professor: "Prof. Marcus Thorne",
    duration: "60 MINUTES",
  },
  {
    id: "6",
    time: "03:00 PM",
    isActive: false,
    isBreak: false,
    breakLabel: null,
    room: "Seminar Room 1",
    color: null,
    subject: "Data Structures",
    professor: "Dr. Alan T.",
    duration: "45 MINUTES",
  },
];

// ─── API item shape (matches backend response) ────────────────────────────────
export interface MySubjectApiItem {
  id: string;
  time: string;
  isActive: boolean;
  isBreak: boolean;
  breakLabel: string | null;
  room: string;
  color: string | null;
  subject: string;
  professor: string;
  duration?: string;
}

interface TeacherTimetableScheduleProps {
  filterMode: TeacherFilterMode;
  mySubjectItems?: MySubjectApiItem[];
  mySubjectLoading?: boolean;
  mySubjectError?: string | null;
}

const TeacherTimetableSchedule: React.FC<TeacherTimetableScheduleProps> = ({
  filterMode,
  mySubjectItems = [],
  mySubjectLoading = false,
  mySubjectError = null,
}) => {
  // ─── My Subject: loading / error / empty states ───────────────────────────
  if (filterMode === "mySubject") {
    if (mySubjectLoading) {
      return (
        <div className="flex items-center gap-3 py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B4FE8]" />
          <span className="text-sm font-medium text-gray-500">
            Syncing your schedule...
          </span>
        </div>
      );
    }

    if (mySubjectError) {
      return (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-medium mt-4 border border-red-100">
          ⚠️ {mySubjectError}
        </div>
      );
    }

    if (mySubjectItems.length === 0) {
      return (
        <div className="bg-gray-50 text-gray-500 p-8 rounded-2xl text-center text-sm font-medium mt-4 border border-dashed border-gray-200">
          No classes scheduled for today.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4 mt-4">
        {mySubjectItems.map((item) => (
          <TimetableScheduleCard
            key={item.id}
            time={item.time}
            isActive={item.isActive}
            isBreak={item.isBreak}
            breakLabel={item.breakLabel || "Institutional Break"}
            room={item.room}
            color={item.color}
            subject={item.subject}
            professor={item.professor}
            duration={item.duration}
          />
        ))}
      </div>
    );
  }

  // ─── Class filter: static data ────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 mt-4">
      {CLASS_SCHEDULE.map((item) => (
        <TimetableScheduleCard
          key={item.id}
          time={item.time}
          isActive={item.isActive}
          isBreak={item.isBreak}
          breakLabel={item.breakLabel || "Institutional Break"}
          room={item.room || "Campus Hall"}
          color={item.color}
          subject={item.subject || "No Subject"}
          professor={item.professor || "Faculty Staff"}
          duration={item.duration}
        />
      ))}
    </div>
  );
};

export default TeacherTimetableSchedule;
