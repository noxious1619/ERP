import React from "react";
import TimetableScheduleCard from "../../../components/Student/Timetable/ScheduleCard";
import type { TeacherFilterMode } from "./TeacherTimetableHeader";

// ─── Shared item shape (matches normalizeTimetable output) ───────────────────
export interface TimetableItem {
  id: string;
  time: string;
  isActive: boolean;
  isBreak: boolean;
  breakLabel: string | null;
  room: string | null;
  color: string | null;
  subject: string | null;
  professor: string | null;
  duration?: string;
}

interface TeacherTimetableScheduleProps {
  filterMode: TeacherFilterMode;
  // Class mode
  classItems: TimetableItem[];
  classLoading: boolean;
  classError: string | null;
  // My Subject mode
  mySubjectItems: TimetableItem[];
  mySubjectLoading: boolean;
  mySubjectError: string | null;
}

const TeacherTimetableSchedule: React.FC<TeacherTimetableScheduleProps> = ({
  filterMode,
  classItems,
  classLoading,
  classError,
  mySubjectItems,
  mySubjectLoading,
  mySubjectError,
}) => {
  // Pick correct dataset and states based on active filter
  const items = filterMode === "class" ? classItems : mySubjectItems;
  const loading = filterMode === "class" ? classLoading : mySubjectLoading;
  const error = filterMode === "class" ? classError : mySubjectError;

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B4FE8]" />
        <span className="text-sm font-medium text-gray-500">
          Syncing live timetable...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-medium mt-4 border border-red-100">
        ⚠️ {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 text-gray-500 p-8 rounded-2xl text-center text-sm font-medium mt-4 border border-dashed border-gray-200">
        No timetable scheduled for today.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      {items.map((item) => (
        <TimetableScheduleCard
          key={item.id}
          time={item.time}
          isActive={item.isActive}
          isBreak={item.isBreak}
          breakLabel={item.breakLabel || "Institutional Break"}
          room={item.room || "Campus Hall"}
          color={item.color || null}
          subject={item.subject || "No Subject"}
          professor={item.professor || "Faculty Staff"}
          duration={item.duration}
        />
      ))}
    </div>
  );
};

export default TeacherTimetableSchedule;
