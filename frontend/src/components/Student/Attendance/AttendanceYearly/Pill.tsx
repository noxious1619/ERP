// src/components/Student/Attendance/Pill.tsx
import { useState } from "react";
import { type DayStatus, PILL_HEX } from "./Attendancetypes ";

interface PillProps {
  status: DayStatus | "P" | "A";
  day: number;
  month: string;
}

const TOOLTIP_LABEL: Record<string, string> = {
  present: "present",
  P: "present",
  absent: "absent",
  A: "absent",
  holiday: "holiday",
  sunday: "Sunday",
  future: "upcoming",
  empty: "no record",
};

export default function Pill({ status, day, month }: PillProps) {
  const [hovered, setHovered] = useState<boolean>(false);

  // Normalize backend tokens into predictable CSS map keys
  const normalizedStatus: DayStatus = 
    status === "P" ? "present" : 
    status === "A" ? "absent" : 
    (status as DayStatus);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-[18px] h-[7px] rounded-[4px] cursor-pointer transition-transform duration-150"
        style={{
          backgroundColor: PILL_HEX[normalizedStatus],
          transform: hovered ? "scaleY(1.25)" : "scaleY(1)",
        }}
      />

      {hovered && (
        <div className="absolute bottom-[calc(100%+5px)] left-1/2 -translate-x-1/2 bg-[#1A1A2E] text-white text-[9px] px-[6px] py-[3px] rounded whitespace-nowrap z-10 pointer-events-none">
          {month} {day} · {TOOLTIP_LABEL[status] || "N/A"}
        </div>
      )}
    </div>
  );
}