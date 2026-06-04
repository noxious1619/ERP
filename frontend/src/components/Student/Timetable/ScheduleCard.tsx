import React from "react";
import { MapPin, User } from "lucide-react";

interface TimetableScheduleCardProps {
  time: string;
  isActive?: boolean;
  isBreak?: boolean;
  breakLabel?: string;
  room?: string;
  color?: string | null;
  subject?: string;
  professor?: string;
  duration?: string;
}
const TimetableScheduleCard: React.FC<TimetableScheduleCardProps> = ({
  time,
  isActive = false,
  isBreak = false,
  breakLabel,
  room,
  color,
  subject,
  professor,
  duration,
}) => {
  return (
    <div className="flex items-start gap-6">
      {/* ── Time Column ── */}
      <div className="w-25  shrink-0 pt-3 text-right">
        <p
          className={`text-sm font-semibold leading-tight ${
            isActive ? "text-[#3B4FE8]" : "text-gray-400"
          }`}
        >
          {time}
        </p>
        {isActive && (
          <p className="text-[10px] font-bold text-[#3B4FE8] uppercase tracking-widest mt-0.5">
            Active
          </p>
        )}
      </div>

      {/* ── Card Column ── */}
      <div className="flex-1">
        {/* BREAK ROW */}
        {isBreak ? (
          <div className="flex items-center gap-3 py-3">
            <div className="flex-1 border-t border-dashed border-gray-300" />
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap px-3 py-1 rounded-full border border-dashed border-gray-300">
              {breakLabel}
            </span>
            <div className="flex-1 border-t border-dashed border-gray-300" />
          </div>
        ) : isActive ? (
          /* ACTIVE CARD — white bg, blue-purple left border, shadow, LIVE badge */
          <div
            className={`bg-white border border-[#3A72FF] border-l-4 rounded-2xl shadow-md px-5 py-4 ${color ? `border-l-${color}` : ""}`}
          >
            <div className="flex items-center justify-between mb-3">
              {/* LIVE badge */}
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#3B4FE8] bg-[#EEF0FF] px-2.5 py-0.5 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B4FE8]" />
                LIVE
              </span>
              <span className="text-xs text-gray-400 font-medium">{room}</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1.5">{subject}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.8} />
              {professor}
            </p>
          </div>
        ) : (
          <div className="bg-blue-300/10 rounded-3xl  px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs flex gap-1 text-gray-400 font-medium">
                <MapPin
                  className="w-3.5 h-3.5 text-gray-400"
                  strokeWidth={1.8}
                />
                {room}
              </span>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                {duration}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1.5">{subject}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.8} />
              {professor}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetableScheduleCard;
