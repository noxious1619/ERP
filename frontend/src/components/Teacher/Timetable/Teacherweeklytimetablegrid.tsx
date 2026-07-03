import React, { useMemo, useEffect, useState } from "react";
import axios from "axios";
import WeeklyClassCard from "../../../components/Student/Timetable/WeeklyCard";
import useAuth from "../../../hooks/useAuth"; 
import type {
  TeacherFilterMode,
  TeacherSection,
} from "./TeacherTimetableHeader";
import { API_BASE_URL } from "../../../lib/api";

interface TeacherWeeklyEntry {
  id: string;
  day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
  startTime: string;
  endTime?: string;
  isBreak?: boolean;
  code: string;
  subject: string;
  teacher: string;
  room: string;
  color: string;
}

// ─── Grid config ─────────────────────────────────────────────────────────────
const COLUMN_COUNT = 6;

const DAY_COLUMNS: Record<string, number> = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
};

const DAYS_HEADER = [
  { day: "Monday" },
  { day: "Tuesday" },
  { day: "Wednesday" },
  { day: "Thursday" },
  { day: "Friday" },
  { day: "Saturday" },
];

// ─── Break injection helpers ──────────────────────────────────────────────────
const BREAK_IDS = ["wb1", "wb2", "wb3", "wb4", "wb5", "wb6"];
const BREAK_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

// ─── Component ────────────────────────────────────────────────────────────────
interface TeacherWeeklyTimetableGridProps {
  filterMode: TeacherFilterMode;
  selectedSection: TeacherSection | null;
}

const TeacherWeeklyTimetableGrid: React.FC<TeacherWeeklyTimetableGridProps> = ({
  filterMode,
  selectedSection,
}) => {
  const { teacherData } = useAuth();

  // ─── Class-wise weekly state ───────────────────────────────────────────────
  const [classEntries, setClassEntries] = useState<TeacherWeeklyEntry[]>([]);
  const [classLoading, setClassLoading] = useState(false);
  const [classError, setClassError] = useState<string | null>(null);

  // ─── My Subject weekly state ───────────────────────────────────────────────
  const [mySubjectEntries, setMySubjectEntries] = useState<
    TeacherWeeklyEntry[]
  >([]);
  const [mySubjectLoading, setMySubjectLoading] = useState(false);
  const [mySubjectError, setMySubjectError] = useState<string | null>(null);

  // ─── Fetch class-wise weekly when section changes ─────────────────────────
  useEffect(() => {
    if (!selectedSection) return;

    const fetchClassWeekly = async () => {
      try {
        setClassLoading(true);
        setClassError(null);
        const token = localStorage.getItem("token");

        // ✅ FIXED PATH: Pointing to the new Section Weekly endpoint
        const response = await axios.get(
          `${API_BASE_URL}/api/timetable/section/${selectedSection.id}/weekly`,

          {
            params: { filter: "mySubject" },
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data.success) {
          const transformed: TeacherWeeklyEntry[] = response.data.data.map(
            (row: any) => ({
              id: row.id,
              day: row.day,
              startTime: row.startTime,
              endTime: row.endTime,
              isBreak: row.isBreak,
              code: row.isBreak ? "" : row.subject?.code || "N/A",
              subject: row.isBreak
                ? row.breakLabel || "Break"
                : row.subject?.name || "No Subject",
              teacher: row.isBreak
                ? ""
                : row.displayTeacherName || "Faculty Staff",
              room: row.isBreak ? "" : row.room || "TBD",
              color: row.isBreak ? "" : row.color || "BLUE",
            }),
          );
          setClassEntries(transformed);
        } else {
          setClassError("Failed to load weekly timetable.");
        }
      } catch (err: any) {
        setClassError(
          err.response?.data?.message || "Error connecting to server.",
        );
      } finally {
        setClassLoading(false);
      }
    };

    fetchClassWeekly();
  }, [selectedSection]);

  // ─── Fetch My Subject weekly ───────────────────────────────────────────────
  useEffect(() => {
    if (filterMode !== "mySubject" || !teacherData?.id) return;

    const fetchMySubjectWeekly = async () => {
      try {
        setMySubjectLoading(true);
        setMySubjectError(null);
        const token = localStorage.getItem("token");

        //  FIXED PATH: Pointing to the new Teacher Weekly endpoint
        const response = await axios.get(
          `${API_BASE_URL}/api/timetable/teacher/${teacherData.id}/weekly`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data.success) {
          // Map the custom backend properties so the WeeklyCard renders perfectly
          const apiEntries: TeacherWeeklyEntry[] = response.data.data.map(
            (row: any) => ({
              id: row.id,
              day: row.day,
              startTime: row.time, // Backend returns 'time' here
              endTime: row.endTime,
              isBreak: false, // Teacher schedule doesn't have school breaks returned
              code: row.code || "",
              subject: row.sectionLabel || "Class", // e.g., "Class 10 - A"
              teacher: row.subject || "No Subject", // Swap professor name for the subject name
              room: row.room || "TBD",
              color: row.color || "BLUE",
            }),
          );

          // Inject break rows for all 6 days at 12:00
          const breakEntries: TeacherWeeklyEntry[] = BREAK_DAYS.map(
            (day, i) => ({
              id: BREAK_IDS[i],
              day,
              startTime: "12:00",
              isBreak: true,
              code: "",
              subject: "",
              teacher: "",
              room: "",
              color: "",
            }),
          );

          setMySubjectEntries([...apiEntries, ...breakEntries]);
        } else {
          setMySubjectError("Failed to load weekly timetable.");
        }
      } catch (err: any) {
        setMySubjectError(
          err.response?.data?.message || "Error connecting to server.",
        );
      } finally {
        setMySubjectLoading(false);
      }
    };

    fetchMySubjectWeekly();
  }, [filterMode, teacherData]);

  // ─── Pick active dataset ───────────────────────────────────────────────────
  const entries = filterMode === "mySubject" ? mySubjectEntries : classEntries;
  const loading = filterMode === "mySubject" ? mySubjectLoading : classLoading;
  const error = filterMode === "mySubject" ? mySubjectError : classError;

  // ─── Derive time slots ─────────────────────────────────────────────────────
  const dynamicTimeSlots = useMemo(() => {
    const times = entries
      .filter((e) => !e.isBreak || e.startTime === "12:00") // keep 12:00 break for lunch label
      .map((e) => e.startTime);
    return Array.from(new Set(times)).sort((a, b) => a.localeCompare(b));
  }, [entries]);

  // ─── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center gap-3 py-10 justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B4FE8]" />
        <span className="text-sm font-medium text-gray-500">
          Syncing weekly schedule...
        </span>
      </div>
    );
  }

  // ─── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-medium mt-4 border border-red-100">
        ⚠️ {error}
      </div>
    );
  }

  // ─── Empty state ──────────────────────────────────────────────────────────
  if (entries.length === 0) {
    return (
      <div className="bg-gray-50 text-gray-500 p-8 rounded-2xl text-center text-sm font-medium mt-4 border border-dashed border-gray-200">
        No weekly timetable found.
      </div>
    );
  }

  const isCardActive = (day: string, start?: string, end?: string) => {
    if (!start) return false;
    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const currentDay = days[new Date().getDay()];
    if (day.toUpperCase() !== currentDay) return false;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    let resolvedEnd = end;
    if (!resolvedEnd) {
      const [h, m] = start.split(":").map(Number);
      const totalMin = h * 60 + m + 45;
      const endHour = Math.floor(totalMin / 60) % 24;
      const endMin = totalMin % 60;
      resolvedEnd = `${String(endHour).padStart(2, "0")}:${String(endMin).padStart(2, "0")}`;
    }

    return currentTime >= start && currentTime <= resolvedEnd;
  };

  return (
    <div className="mt-4 rounded-[40px] bg-[#F3F6FB] px-10 py-8 shadow-sm">
      {/* Day Headers */}
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `72px repeat(${COLUMN_COUNT}, minmax(0,1fr))`,
        }}
      >
        <div />
        {DAYS_HEADER.map((item) => (
          <div
            key={item.day}
            className="flex h-[54px] flex-col items-center justify-center rounded-full bg-[#EEF2F7]"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#666B78]">
              {item.day}
            </span>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="mt-2 flex">
        {/* Time Labels */}
        <div className="flex w-[72px] flex-col">
          {dynamicTimeSlots.map((time) => (
            <div
              key={time}
              className="flex h-[132px] items-start pt-7 text-[16px] font-medium text-[#8A8FA1]"
            >
              {time === "12:00" ? "" : time}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="relative grid flex-1 grid-cols-6 border-l border-t border-[#E6EAF2]">
          {/* Background cells */}
          {Array.from({ length: COLUMN_COUNT * dynamicTimeSlots.length }).map(
            (_, i) => (
              <div
                key={i}
                className="h-[132px] border-r border-b border-[#E6EAF2]"
              />
            ),
          )}

          {/* Cards */}
          {entries.map((item) => {
            const columnIndex = DAY_COLUMNS[item.day];
            const rowIndex = dynamicTimeSlots.indexOf(item.startTime);
            if (rowIndex === -1) return null;

            const columnWidth = 100 / COLUMN_COUNT;
            const isActive = isCardActive(
              item.day,
              item.startTime,
              item.endTime,
            );

            return (
              <div
                key={item.id}
                className="absolute p-[8px]"
                style={{
                  left: `calc(${columnIndex} * ${columnWidth}%)`,
                  top: `${rowIndex * 132}px`,
                  width: `${columnWidth}%`,
                }}
              >
                {!item.isBreak && (
                  <div
                    className={
                      isActive
                        ? "ring-4 ring-[#3B4FE8] rounded-[24px] shadow-lg animate-pulse"
                        : ""
                    }
                  >
                    <WeeklyClassCard
                      code={item.code}
                      subject={item.subject}
                      teacher={item.teacher}
                      location={item.room}
                      accentColor={item.color}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeacherWeeklyTimetableGrid;
