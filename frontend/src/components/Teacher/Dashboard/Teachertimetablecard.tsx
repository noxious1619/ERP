import React from "react";

interface TeacherTimetableCardProps {
  className: string; // e.g. "Class – X(A)"
  startTime: string; // e.g. "9:00 AM"
  endTime: string; // e.g. "10:00 AM"
  subject: string; // e.g. "English"
  room: string; // e.g. "ROOM-101"
  isActive?: boolean; // first card gets the blue left border highlight
}

// Maps subject name → icon + color, matching the student module pattern
// const getSubjectIcon = (subjectName: string = "") => {
//   const lower = subjectName.toLowerCase();
//   if (lower.includes("math")) {
//     return <span className="text-indigo-700 font-bold text-[13px]">Σ</span>;
//   }
//   if (lower.includes("bio") || lower.includes("science")) {
//     return <span className="text-pink-600 text-[13px]">🔬</span>;
//   }
//   if (
//     lower.includes("comp") ||
//     lower.includes("java") ||
//     lower.includes("code")
//   ) {
//     return <span className="text-emerald-600 text-[13px]">{"{}"}</span>;
//   }
//   // Default: language/translation icon
//   return <Languages size={14} className="text-blue-500" />;
// };

const TeacherTimetableCard: React.FC<TeacherTimetableCardProps> = ({
  className,
  startTime,
  endTime,
  subject,
  room,
  isActive = false,
}) => {
  return (
    <div
      className={`
        bg-white rounded-3xl p-4 flex flex-col gap-2 flex-1 min-w-0 h-[140px]
       shadow-[0px_15px_25px_10px_rgba(0,0,0,0.05)]
        ${isActive ? "ring-2 ring-blue-400 ring-offset-1" : ""}
      `}
    >
      {/* Class Name — primary title */}
      <div>
        <h3 className="text-[18px] font-bold text-gray-900 tracking-tight truncate mt-2">
          {className}
        </h3>
        {/* Thin blue underline accent (matches Image 1 — active card has blue dot/line) */}
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

      {/* Subject + Room Row */}
      <div className="flex items-center gap-2 mt-1">
        {/* Subject icon badge */}
        {/* <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-blue-50">
          {getSubjectIcon(subject)}
        </div> */}
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-semibold text-gray-800 leading-tight truncate">
            {subject}
          </span>
          <span className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">
            {room}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeacherTimetableCard;
