import React from "react";

interface TimetableCardProps {
  subject: string;
  startTime: string;
  endTime: string;
  professorName: string;
  professorAvatar: string;
  room: string;
  isLive?: boolean;
}

const TimetableCard: React.FC<TimetableCardProps> = ({
  subject,
  startTime,
  endTime,
  professorName,
  professorAvatar,
  room,
  isLive,
}) => {
  return (
    <div
      className={`relative bg-white rounded-3xl p-4 flex flex-col gap-2 flex-1 min-w-0 h-[170px] shadow-[0px_15px_25px_10px_rgba(0,0,0,0.05)] transition-all duration-300 ${
        isLive
          ? "border-2 border-blue-500"
          : "border-2 border-transparent"
      }`}
    >
      {/* LIVE Badge */}
      {isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          LIVE
        </div>
      )}

      {/* Subject Name */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 tracking-tight truncate mt-4">
          {subject}
        </h3>

        <hr className="mt-2 border-gray-200" />
      </div>

      {/* Time */}
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
          {startTime}
        </span>

        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
          {endTime}
        </span>
      </div>

      {/* Professor */}
      <div className="flex items-center gap-2 mt-2">
        <img
          src={professorAvatar}
          alt={professorName}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        />

        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-gray-800 leading-tight truncate">
            {professorName}
          </span>

          <span className="text-[11px] text-gray-400 font-medium tracking-wide">
            {room}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimetableCard;