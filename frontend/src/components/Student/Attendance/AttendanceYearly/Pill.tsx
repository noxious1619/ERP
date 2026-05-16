import { useState } from "react";
import { type DayStatus, PILL_HEX } from "./Attendancetypes ";

interface PillProps {
  status: DayStatus;
  day: number;
  month: string;
}

const TOOLTIP_LABEL: Record<DayStatus, string> = {
  present: "present",
  absent: "absent",
  holiday: "holiday",
  sunday: "Sunday",
  future: "upcoming",
};

export default function Pill({ status, day, month }: PillProps) {
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <div className="relative inline-block">
      {/* Pill — background always via inline style to guarantee correct color */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-[18px] h-[7px] rounded-[4px] cursor-pointer transition-transform duration-150"
        style={{
          backgroundColor: PILL_HEX[status],
          transform: hovered ? "scaleY(1.25)" : "scaleY(1)",
        }}
      />

      {/* Tooltip */}
      {hovered && (
        <div className="absolute bottom-[calc(100%+5px)] left-1/2 -translate-x-1/2 bg-[#1A1A2E] text-white text-[9px] px-[6px] py-[3px] rounded whitespace-nowrap z-10 pointer-events-none">
          {month} {day} · {TOOLTIP_LABEL[status]}
        </div>
      )}
    </div>
  );
}
