import React from "react";
import type { Student } from "../Attendance/Studentattendancetable";

interface AttendanceStatsProps {
  students: Student[];
}

const AttendanceStats: React.FC<AttendanceStatsProps> = ({ students }) => {
  const present = students.filter((s) => s.status === "present").length;
  const late = students.filter((s) => s.status === "late").length;
  const absent = students.filter((s) => s.status === "absent").length;
  const total = students.length;
  const attendancePct = total > 0 ? Math.round((present / total) * 100) : 0;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const presentLen = total > 0 ? (present / total) * circumference : 0;
  const lateLen = total > 0 ? (late / total) * circumference : 0;
  const absentLen = total > 0 ? (absent / total) * circumference : 0;

  return (
    <div
      className="rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4 bg-[#FFFFFF]"

    >
      {/* Left: badges */}
      <div className="flex flex-col items-start gap-2 flex-shrink-0">
        <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
          {present} Present
        </span>
        <span className="bg-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
          {late} Late
        </span>
        <span className="bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
          {absent} Absent
        </span>
      </div>

      {/* Right: donut */}
      <div className="relative w-36 h-36 flex-shrink-0">
        <svg viewBox="0 0 130 130" className="w-full h-full -rotate-90">
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="12"
            strokeDasharray={`${presentLen} ${circumference - presentLen}`}
            strokeDashoffset="0"
          />
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="#f97316"
            strokeWidth="12"
            strokeDasharray={`${lateLen} ${circumference - lateLen}`}
            strokeDashoffset={-presentLen}
          />
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke="#ef4444"
            strokeWidth="12"
            strokeDasharray={`${absentLen} ${circumference - absentLen}`}
            strokeDashoffset={-(presentLen + lateLen)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">
            {attendancePct}%
          </span>
          <span className="text-[9px] text-gray-500 font-semibold tracking-widest uppercase mt-0.5">
            Attendance
          </span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceStats;
