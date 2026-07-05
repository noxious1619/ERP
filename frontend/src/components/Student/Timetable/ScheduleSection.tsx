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
  const dailyItems = useMemo(() => {
    const targetDayEnum = DAY_ENUM_MAP[selectedDate.getDay()];

    const getSortValue = (time: string) => {
      const [hour, minute] = (time || "00:00").split(":").map(Number);

      // School timetable rule:
      // Treat 01:00 - 07:59 as afternoon (13:00 - 19:59)
      const adjustedHour =
        hour >= 1 && hour <= 7 ? hour + 12 : hour;

      return adjustedHour * 60 + minute;
    };

    return scheduleData
      .filter((item) => item.day?.toUpperCase() === targetDayEnum)
       .filter((item) => item.isBreak || item.subject)
      .sort((a, b) => getSortValue(a.startTime) - getSortValue(b.startTime));
  }, [scheduleData, selectedDate]);

  

  // ─── Helper: Calculate "LIVE" Status ────────────────────────────────────────
  const isClassActive = (startTime: string, endTime: string) => {
    const today = new Date();

    // Only highlight as active if they are looking at today's schedule
    if (selectedDate.toDateString() !== today.toDateString()) return false;

    const convertToMinutes = (time: string) => {
      const [hour, minute] = (time || "00:00").split(":").map(Number);

      const adjustedHour =
        hour >= 1 && hour <= 7 ? hour + 12 : hour;

      return adjustedHour * 60 + minute;
    };

    const now = new Date();
    let currentHour = now.getHours();

    // Convert current time to the same school-time format
    if (currentHour >= 13 && currentHour <= 19) {
      currentHour -= 12;
    }

    const nowMinutes = convertToMinutes(
      `${String(currentHour).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`
    );

    const startTotal = convertToMinutes(startTime);
    const endTotal = convertToMinutes(endTime);

    return nowMinutes >= startTotal && nowMinutes < endTotal;
  };

  // ─── Helper: Calculate Duration ─────────────────────────────────────────────
  const calculateDuration = (startTime: string, endTime: string) => {
    const convertToMinutes = (time: string) => {
      const [hour, minute] = (time || "00:00").split(":").map(Number);

      const adjustedHour =
        hour >= 1 && hour <= 7 ? hour + 12 : hour;

      return adjustedHour * 60 + minute;
    };

    const diff = convertToMinutes(endTime) - convertToMinutes(startTime);

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