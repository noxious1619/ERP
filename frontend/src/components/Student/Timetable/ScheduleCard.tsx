import React from "react";
interface TimetableScheduleCardProps {
  time: string;
  isActive?: boolean;
  isBreak?: boolean;
  breakLabel?: string;
  room?: string;
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
  subject,
  professor,
  duration,
}) => {
  return (
    <div className="flex items-start gap-6">
      {/* ── Time Column ── */}
      <div className="w-[90px] shrink-0 pt-3 text-right">
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
          <div className="bg-white border border-gray-200 border-l-4 border-l-[#3B4FE8] rounded-2xl shadow-md px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              {/* LIVE badge */}
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#3B4FE8] bg-[#EEF0FF] px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B4FE8]" />
                LIVE
              </span>
              <span className="text-xs text-gray-400 font-medium">{room}</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1.5">{subject}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <ProfessorIcon />
              {professor}
            </p>
          </div>
        ) : (
          /* INACTIVE CARD — light gray bg, room top-left, duration top-right */
          <div className="bg-blue-300/10 rounded-3xl  px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 font-medium">{room}</span>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                {duration}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1.5">{subject}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <ProfessorIcon />
              {professor}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
const ProfessorIcon = () => (
  <svg
    className="w-3.5 h-3.5 shrink-0 text-gray-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

export default TimetableScheduleCard;
