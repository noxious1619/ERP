import React, { useMemo } from "react";
import TimetableScheduleCard from "../../../components/Student/Timetable/ScheduleCard";

// ─── Types matching the parent payload ────────────────────────────────────────
interface TimetableEntry {
  id: string;
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  isBreak: boolean;
  breakLabel: string | null;
  room: string | null;
  color: string | null;
  subject?: { id: string; name: string; code: string } | null;
  displayTeacherName?: string | null;
}

interface TimetableScheduleProps {
  selectedDate: Date;
  scheduleData: TimetableEntry[];
  isLoading: boolean;
  error: string | null;
}

const DAY_ENUM_MAP = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const TimetableSchedule: React.FC<TimetableScheduleProps> = ({
  selectedDate,
  scheduleData,
  isLoading,
  error,
}) => {
  // ─── Filter & Sort ──────────────────────────────────────────────────────────
  // Grab only the entries that match the day of the week selected in the calendar
  const dailyItems = useMemo(() => {
    const targetDayEnum = DAY_ENUM_MAP[selectedDate.getDay()];

    return scheduleData
      .filter((item) => item.day?.toUpperCase() === targetDayEnum)
      .sort((a, b) => {
        const timeA = a.startTime || "00:00";
        const timeB = b.startTime || "00:00";
        return timeA.localeCompare(timeB);
      });
  }, [scheduleData, selectedDate]);

  // ─── Helper: Calculate "LIVE" Status ────────────────────────────────────────
  const isClassActive = (startTime: string, endTime: string) => {
    const today = new Date();
    // Only highlight as active if they are looking at today's schedule
    if (selectedDate.toDateString() !== today.toDateString()) return false;

    const nowMinutes = today.getHours() * 60 + today.getMinutes();
    const [startH, startM] = (startTime || "00:00").split(":").map(Number);
    const [endH, endM] = (endTime || "00:00").split(":").map(Number);

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    return nowMinutes >= startTotal && nowMinutes < endTotal;
  };

  // ─── Helper: Calculate "60 MINUTES" String ──────────────────────────────────
  const calculateDuration = (startTime: string, endTime: string) => {
    const [startH, startM] = (startTime || "00:00").split(":").map(Number);
    const [endH, endM] = (endTime || "00:00").split(":").map(Number);

    const diff = endH * 60 + endM - (startH * 60 + startM);
    return diff > 0 ? `${diff} MINUTES` : undefined;
  };

  // ─── Render States ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B4FE8]"></div>
        <span className="ml-3 text-sm font-medium text-gray-500">
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

  if (dailyItems.length === 0) {
    return (
      <div className="bg-gray-50 text-gray-500 p-8 rounded-2xl text-center text-sm font-medium mt-4 border border-dashed border-gray-200">
        No timetable is scheduled for{" "}
        {DAY_ENUM_MAP[selectedDate.getDay()].toLowerCase()}.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      {dailyItems.map((item) => (
        <TimetableScheduleCard
          key={item.id}
          time={item.startTime}
          isActive={isClassActive(item.startTime, item.endTime)}
          isBreak={item.isBreak}
          breakLabel={item.breakLabel || "Institutional Break"}
          room={item.room || "Campus Hall"}
          color={item.color || null}
          subject={item.subject?.name || "No Subject assigned"}
          professor={item.displayTeacherName || "Faculty Staff"}
          duration={calculateDuration(item.startTime, item.endTime)}
        />
      ))}
    </div>
  );
};

export default TimetableSchedule;
