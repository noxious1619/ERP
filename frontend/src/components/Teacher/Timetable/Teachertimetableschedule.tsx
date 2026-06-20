import React from "react";
import { MapPin, User, BookOpen } from "lucide-react";
import TimetableScheduleCard from "../../../components/Student/Timetable/ScheduleCard";
import type { TeacherFilterMode } from "./TeacherTimetableHeader";

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
  classItems: TimetableItem[];
  classLoading: boolean;
  classError: string | null;
  mySubjectItems: TimetableItem[];
  mySubjectLoading: boolean;
  mySubjectError: string | null;
}

// ─── My Subject Card — identical layout to TimetableScheduleCard
// but uses BookOpen icon instead of User icon for the subject line ─────────────
const MySubjectScheduleCard: React.FC<TimetableItem> = ({
  time,
  isActive,
  isBreak,
  breakLabel,
  room,
  color,
  subject,
  professor,
  duration,
}) => {
  return (
    <div className="flex items-start gap-6">
      {/* Time Column */}
      <div className="w-25 shrink-0 pt-3 text-right">
        <p className={`text-sm font-semibold leading-tight ${isActive ? "text-[#3B4FE8]" : "text-gray-400"}`}>
          {time}
        </p>
        {isActive && (
          <p className="text-[10px] font-bold text-[#3B4FE8] uppercase tracking-widest mt-0.5">
            Active
          </p>
        )}
      </div>

      {/* Card Column */}
      <div className="flex-1">
        {isBreak ? (
          /* Break row — identical to student card */
          <div className="flex items-center gap-3 py-3">
            <div className="flex-1 border-t border-dashed border-gray-300" />
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap px-3 py-1 rounded-full border border-dashed border-gray-300">
              {breakLabel}
            </span>
            <div className="flex-1 border-t border-dashed border-gray-300" />
          </div>
        ) : isActive ? (
          /* Active card */
          <div className={`bg-white border border-[#3A72FF] border-l-4 rounded-2xl shadow-md px-5 py-4 ${color ? `border-l-${color}` : ""}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#3B4FE8] bg-[#EEF0FF] px-2.5 py-0.5 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B4FE8]" />
                LIVE
              </span>
              <span className="text-xs text-gray-400 font-medium">{room}</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1.5">{subject}</p>
            {/* BookOpen icon instead of User */}
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.8} />
              {professor}
            </p>
          </div>
        ) : (
          /* Inactive card */
          <div className="bg-blue-300/10 rounded-3xl px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs flex gap-1 text-gray-400 font-medium">
                <MapPin className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.8} />
                {room}
              </span>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                {duration}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1.5">{subject}</p>
            {/* BookOpen icon instead of User */}
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.8} />
              {professor}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Schedule Section ────────────────────────────────────────────────────
const TeacherTimetableSchedule: React.FC<TeacherTimetableScheduleProps> = ({
  filterMode,
  classItems,
  classLoading,
  classError,
  mySubjectItems,
  mySubjectLoading,
  mySubjectError,
}) => {
  const items = filterMode === "class" ? classItems : mySubjectItems;
  const loading = filterMode === "class" ? classLoading : mySubjectLoading;
  const error = filterMode === "class" ? classError : mySubjectError;

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B4FE8]" />
        <span className="text-sm font-medium text-gray-500">Syncing live timetable...</span>
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
      {items.map((item) =>
        filterMode === "mySubject" ? (
          // My Subject — custom card with BookOpen icon
          <MySubjectScheduleCard key={item.id} {...item} />
        ) : (
          // Class mode — reuse student card unchanged (User icon)
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
        )
      )}
    </div>
  );
};

export default TeacherTimetableSchedule;