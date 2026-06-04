import React, { useMemo, useEffect, useState } from "react";
import axios from "axios";
import WeeklyClassCard from "../../../components/Student/Timetable/WeeklyCard";
import type { TeacherFilterMode } from "./TeacherTimetableHeader";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TeacherWeeklyEntry {
  id: string;
  day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
  startTime: string;
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
  { day: "Monday", date: "16" },
  { day: "Tuesday", date: "17" },
  { day: "Wednesday", date: "18" },
  { day: "Thursday", date: "19" },
  { day: "Friday", date: "20" },
  { day: "Saturday", date: "21" },
];

// ─── Static class-wise data (backend pending) ─────────────────────────────────
const CLASS_WEEKLY_ENTRIES: TeacherWeeklyEntry[] = [
  // 08:00
  {
    id: "c1",
    day: "MONDAY",
    startTime: "08:00",
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    room: "Comp Lab 3",
    color: "BLUE",
  },
  {
    id: "c2",
    day: "TUESDAY",
    startTime: "08:00",
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    room: "Comp Lab 3",
    color: "BLUE",
  },
  {
    id: "c3",
    day: "WEDNESDAY",
    startTime: "08:00",
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    room: "Comp Lab 3",
    color: "BLUE",
  },
  {
    id: "c4",
    day: "THURSDAY",
    startTime: "08:00",
    code: "PHY-301",
    subject: "Quantum Physics",
    teacher: "Prof. Robert Chen",
    room: "Lab 12, Science Wing",
    color: "PURPLE",
  },
  {
    id: "c5",
    day: "FRIDAY",
    startTime: "08:00",
    code: "PHY-301",
    subject: "Quantum Physics",
    teacher: "Prof. Robert Chen",
    room: "Lab 12, Science Wing",
    color: "PURPLE",
  },
  {
    id: "c5s",
    day: "SATURDAY",
    startTime: "08:00",
    code: "MTH-201",
    subject: "Discrete Math",
    teacher: "Dr. Peter Parker",
    room: "Seminar Room 2",
    color: "BLUE",
  },
  // 10:00
  {
    id: "c6",
    day: "MONDAY",
    startTime: "10:00",
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    room: "Comp Lab 3",
    color: "BLUE",
  },
  {
    id: "c7",
    day: "TUESDAY",
    startTime: "10:00",
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    room: "Comp Lab 3",
    color: "BLUE",
  },
  {
    id: "c8",
    day: "WEDNESDAY",
    startTime: "10:00",
    code: "PHL-101",
    subject: "Modern Ethics",
    teacher: "Dr. Alan Moore",
    room: "Main Hall",
    color: "PINK",
  },
  {
    id: "c9",
    day: "THURSDAY",
    startTime: "10:00",
    code: "PHL-101",
    subject: "Modern Ethics",
    teacher: "Dr. Alan Moore",
    room: "Main Hall",
    color: "PINK",
  },
  {
    id: "c10",
    day: "FRIDAY",
    startTime: "10:00",
    code: "CSC-305",
    subject: "Computer Networks",
    teacher: "Prof. Lisa Wang",
    room: "Lab 08",
    color: "PURPLE",
  },
  {
    id: "c10s",
    day: "SATURDAY",
    startTime: "10:00",
    code: "AI-400",
    subject: "Intro to AI & ML",
    teacher: "Dr. Michael Grey",
    room: "Auditorium 1",
    color: "BLUE",
  },
  // 12:00 breaks
  {
    id: "b1",
    day: "MONDAY",
    startTime: "12:00",
    isBreak: true,
    code: "",
    subject: "",
    teacher: "",
    room: "",
    color: "",
  },
  {
    id: "b2",
    day: "TUESDAY",
    startTime: "12:00",
    isBreak: true,
    code: "",
    subject: "",
    teacher: "",
    room: "",
    color: "",
  },
  {
    id: "b3",
    day: "WEDNESDAY",
    startTime: "12:00",
    isBreak: true,
    code: "",
    subject: "",
    teacher: "",
    room: "",
    color: "",
  },
  {
    id: "b4",
    day: "THURSDAY",
    startTime: "12:00",
    isBreak: true,
    code: "",
    subject: "",
    teacher: "",
    room: "",
    color: "",
  },
  {
    id: "b5",
    day: "FRIDAY",
    startTime: "12:00",
    isBreak: true,
    code: "",
    subject: "",
    teacher: "",
    room: "",
    color: "",
  },
  {
    id: "b6",
    day: "SATURDAY",
    startTime: "12:00",
    isBreak: true,
    code: "",
    subject: "",
    teacher: "",
    room: "",
    color: "",
  },
  // 13:00
  {
    id: "c11",
    day: "MONDAY",
    startTime: "13:00",
    code: "MTH-201",
    subject: "Discrete Math",
    teacher: "Dr. Peter Parker",
    room: "Seminar Room 2",
    color: "BLUE",
  },
  {
    id: "c12",
    day: "TUESDAY",
    startTime: "13:00",
    code: "MTH-201",
    subject: "Discrete Math",
    teacher: "Dr. Peter Parker",
    room: "Seminar Room 2",
    color: "BLUE",
  },
  {
    id: "c13",
    day: "WEDNESDAY",
    startTime: "13:00",
    code: "AI-400",
    subject: "Intro to AI & ML",
    teacher: "Dr. Michael Grey",
    room: "Auditorium 1",
    color: "BLUE",
  },
  {
    id: "c14",
    day: "THURSDAY",
    startTime: "13:00",
    code: "AI-400",
    subject: "Intro to AI & ML",
    teacher: "Dr. Michael Grey",
    room: "Auditorium 1",
    color: "BLUE",
  },
  {
    id: "c15",
    day: "FRIDAY",
    startTime: "13:00",
    code: "MTH-402",
    subject: "Advanced Calculus",
    teacher: "Dr. Sarah Jenkins",
    room: "Room 402, Block B",
    color: "PURPLE",
  },
  {
    id: "c15s",
    day: "SATURDAY",
    startTime: "13:00",
    code: "CSC-305",
    subject: "Computer Networks",
    teacher: "Prof. Lisa Wang",
    room: "Lab 08",
    color: "PURPLE",
  },
  // 15:00
  {
    id: "c16",
    day: "MONDAY",
    startTime: "15:00",
    code: "MTH-201",
    subject: "Discrete Math",
    teacher: "Dr. Peter Parker",
    room: "Seminar Room 2",
    color: "BLUE",
  },
  {
    id: "c17",
    day: "TUESDAY",
    startTime: "15:00",
    code: "MTH-201",
    subject: "Discrete Math",
    teacher: "Dr. Peter Parker",
    room: "Seminar Room 2",
    color: "BLUE",
  },
  {
    id: "c18",
    day: "WEDNESDAY",
    startTime: "15:00",
    code: "MTH-201",
    subject: "Discrete Math",
    teacher: "Dr. Peter Parker",
    room: "Seminar Room 2",
    color: "BLUE",
  },
  {
    id: "c19",
    day: "THURSDAY",
    startTime: "15:00",
    code: "MTH-201",
    subject: "Discrete Math",
    teacher: "Dr. Peter Parker",
    room: "Seminar Room 2",
    color: "BLUE",
  },
  {
    id: "c20",
    day: "FRIDAY",
    startTime: "15:00",
    code: "MTH-402",
    subject: "Advanced Calculus",
    teacher: "Dr. Sarah Jenkins",
    room: "Room 402, Block B",
    color: "PURPLE",
  },
  {
    id: "c20s",
    day: "SATURDAY",
    startTime: "15:00",
    code: "PHL-101",
    subject: "Modern Ethics",
    teacher: "Dr. Alan Moore",
    room: "Main Hall",
    color: "PINK",
  },
];

// ─── Break row IDs for the lunch slot in My Subject mode ─────────────────────
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
}

const TeacherWeeklyTimetableGrid: React.FC<TeacherWeeklyTimetableGridProps> = ({
  filterMode,
}) => {
  const [mySubjectEntries, setMySubjectEntries] = useState<
    TeacherWeeklyEntry[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (filterMode !== "mySubject") return;

    const fetchWeekly = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/academic/timetable/teacher/my-subject/weekly",
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data.success) {
          const apiEntries: TeacherWeeklyEntry[] = response.data.data;

          // Derive unique start times from API data to know where to put lunch row
          const uniqueTimes = Array.from(
            new Set(apiEntries.map((e) => e.startTime)),
          ).sort();

          // Inject a lunch break row for every day if "12:00" slot exists in data
          // OR always inject it between the last pre-noon and first post-noon slot
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
          setError("Failed to load weekly timetable.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error connecting to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeekly();
  }, [filterMode]);

  // Pick the right dataset
  const entries =
    filterMode === "mySubject" ? mySubjectEntries : CLASS_WEEKLY_ENTRIES;

  // Derive sorted unique time slots — same approach as student WeeklyTimetableGrid
  const dynamicTimeSlots = useMemo(() => {
    const times = entries.map((e) => e.startTime);
    return Array.from(new Set(times)).sort((a, b) => a.localeCompare(b));
  }, [entries]);

  const lunchRowIndex = dynamicTimeSlots.indexOf("12:00");

  // ─── Loading / error states for My Subject ───────────────────────────────
  if (filterMode === "mySubject" && loading) {
    return (
      <div className="flex items-center gap-3 py-10 justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B4FE8]" />
        <span className="text-sm font-medium text-gray-500">
          Syncing weekly schedule...
        </span>
      </div>
    );
  }

  if (filterMode === "mySubject" && error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-medium mt-4 border border-red-100">
        ⚠️ {error}
      </div>
    );
  }

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
            <span className="text-[16px] font-bold text-[#2B2F38]">
              {item.date}
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

          {/* Lunch break label */}
          {lunchRowIndex !== -1 && (
            <div
              className="absolute left-0 z-10 flex w-full items-center justify-center"
              style={{ top: `${lunchRowIndex * 132 + 56}px` }}
            >
              <span className="bg-[#F3F5FA] px-6 text-[11px] font-bold uppercase tracking-[4px] text-gray-500">
                Institutional Lunch Break
              </span>
            </div>
          )}

          {/* Cards */}
          {entries.map((item) => {
            const columnIndex = DAY_COLUMNS[item.day];
            const rowIndex = dynamicTimeSlots.indexOf(item.startTime);
            if (rowIndex === -1) return null;

            const columnWidth = 100 / COLUMN_COUNT;

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
                {item.isBreak ? (
                  <div className="h-[116px] w-full" />
                ) : (
                  <WeeklyClassCard
                    code={item.code}
                    subject={item.subject}
                    teacher={item.teacher}
                    location={item.room}
                    accentColor={item.color}
                  />
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
