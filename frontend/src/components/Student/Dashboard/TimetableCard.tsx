import React from "react";
interface TimetableCardProps {
  subject: string;
  startTime: string;
  endTime: string;
  professorName: string;
  professorAvatar: string;
  room: string;
}
const TimetableCard: React.FC<TimetableCardProps> = ({
  subject,
  startTime,
  endTime,
  professorName,
  professorAvatar,
  room,
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 flex flex-col gap-2 flex-1 min-w-0 h-[170px] shadow-[0px_15px_25px_10px_rgba(0,0,0,0.05)]">
      {/* Subject Name */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 tracking-tight truncate mt-4">
          {subject}
        </h3>
        <hr className="mt-2 border-gray-200" />
      </div>
      {/* Time Row */}
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
          {startTime}
        </span>
        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
          {endTime}
        </span>
      </div>
      {/* Professor Info */}
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
