// import { useState } from "react";
// import SubjectIcon from "./SubjectIcon";
// interface ExamCardProps {
//   title: string;
//   syllabus: string;
//   date: string;
//   suffix: string;
//   subjectName: string;
//   icon?: string | null;   // Path from DB e.g. "/icons/chemistry.png" — optional
//   bgColor: string;
//   iconBg: string;
//   textColor?: string;
// }
// const ExamCard = ({
//   title,
//   syllabus,
//   date,
//   suffix,
//   subjectName,
//   icon,
//   bgColor,
//   iconBg,
//   textColor = "#484848",
// }: ExamCardProps) => {
//   const isDark = bgColor === "#4285F4";
//   const isCompleted = bgColor === "#EEEFF0";
//   // Icon stroke color for SVG fallback
//   const iconColor = isDark ? "#FFFFFF" : isCompleted ? "#AEAFB0" : "#4285F4";
//   const titleColor        = isDark ? "#FFFFFF"                  : isCompleted ? "#9B9B9B"  : "#484848";
//   const syllabusLabelColor = isDark ? "rgba(255,255,255,0.9)"   : isCompleted ? "#AEAFB0"  : "#484848";
//   const syllabusTextColor  = isDark ? "rgba(255,255,255,0.75)"  : isCompleted ? "#B8B8B8"  : "#484747";
//   const dateColor          = isDark ? "#FFFFFF"                  : isCompleted ? "#9B9B9B"  : "#484848";
//   const gridBorderColor    = isDark ? "rgba(255,255,255,0.25)"   : "rgba(190,191,192,0.5)";
//   // Track if the DB image fails to load — fall back to SVG icon
//   const [imgError, setImgError] = useState(false);
//   // Decide what to render in the icon circle:
//   // 1. DB icon path exists AND hasn't errored → <img>
//   // 2. Otherwise → <SubjectIcon> SVG
//   const showDbImage = icon && icon.trim() !== "" && !imgError;
//   return (
//     <div
//       className="
//         flex w-full items-center justify-between
//         rounded-[28px] px-6 py-5
//         shadow-[0px_18px_40px_rgba(0,0,0,0.06)]
//         transition-all duration-300
//       "
//       style={{ backgroundColor: bgColor }}
//     >
//       {/* LEFT */}
//       <div className="flex items-center gap-5">
//         {/* Icon circle */}
//         <div
//           className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full overflow-hidden"
//           style={{ backgroundColor: iconBg }}
//         >
//           {showDbImage ? (
//             <img
//               src={icon!}
//               alt={subjectName}
//               className="h-[28px] w-[28px] object-contain"
//               style={isCompleted ? { filter: "grayscale(100%) opacity(0.5)" } : undefined}
//               onError={() => setImgError(true)}  // silently fall back to SVG
//             />
//           ) : (
//             <SubjectIcon
//               subjectName={subjectName}
//               size={26}
//               color={iconColor}
//             />
//           )}
//         </div>
//         {/* Text */}
//         <div>
//           <h3
//             className="text-[20px] font-[700] uppercase leading-tight tracking-wide"
//             style={{ color: titleColor }}
//           >
//             {title}
//           </h3>
//           <p
//             className="mt-[6px] max-w-[360px] text-[14px] leading-[18px]"
//             style={{ color: syllabusTextColor }}
//           >
//             <span className="font-[700] text-[14px]" style={{ color: syllabusLabelColor }}>
//               Syllabus :{" "}
//             </span>
//             {syllabus}
//           </p>
//         </div>
//       </div>
//       {/* DATE BOX */}
//       <div className="relative h-[74px] w-[74px] shrink-0">
//         <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <div key={i} className="border" style={{ borderColor: gridBorderColor }} />
//           ))}
//         </div>
//         <div className="absolute inset-0 ml-2 flex items-center justify-center">
//           <span className="text-4xl font-semibold leading-none" style={{ color: dateColor }}>
//             {date}
//           </span>
//           <span className="mb-auto mt-1 ml-[2px] text-[12px] font-[600]" style={{ color: textColor }}>
//             {suffix}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ExamCard;

import { useState } from "react";
import SubjectIcon from "./SubjectIcon";

interface ExamCardProps {
  title: string;
  syllabus: string;
  date: string;
  suffix: string;
  subjectName: string;
  icon?: string | null;
  bgColor: string;
  iconBg: string;
  textColor?: string;
  // ── New optional fields ──────────────────────────────────────
  startTime?: string | null;
  endTime?: string | null;
  totalMarks?: number | null;
}

const ExamCard = ({
  title,
  syllabus,
  date,
  suffix,
  subjectName,
  icon,
  bgColor,
  iconBg,
  textColor = "#484848",
  startTime,
  endTime,
  totalMarks,
}: ExamCardProps) => {
  const isDark      = bgColor === "#4285F4";
  const isCompleted = bgColor === "#EEEFF0";

  const iconColor          = isDark ? "#FFFFFF" : isCompleted ? "#AEAFB0" : "#4285F4";
  const titleColor         = isDark ? "#FFFFFF" : isCompleted ? "#9B9B9B" : "#484848";
  const syllabusLabelColor = isDark ? "rgba(255,255,255,0.9)"  : isCompleted ? "#AEAFB0" : "#484848";
  const syllabusTextColor  = isDark ? "rgba(255,255,255,0.75)" : isCompleted ? "#B8B8B8" : "#484747";
  const dateColor          = isDark ? "#FFFFFF" : isCompleted ? "#9B9B9B" : "#484848";
  const gridBorderColor    = isDark ? "rgba(255,255,255,0.25)" : "rgba(190,191,192,0.5)";
  const metaColor          = isDark ? "rgba(255,255,255,0.7)"  : isCompleted ? "#C0C0C0" : "#888888";

  const [imgError, setImgError] = useState(false);
  const showDbImage = icon && icon.trim() !== "" && !imgError;

  // Whether we have any extra meta to show
  const hasTime  = startTime || endTime;
  const hasMeta  = hasTime || totalMarks != null;

  return (
    <div
      className="
        flex w-full items-center justify-between
        rounded-[28px] px-6 py-5
        shadow-[0px_18px_40px_rgba(0,0,0,0.06)]
        transition-all duration-300
      "
      style={{ backgroundColor: bgColor }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-5">
        {/* Icon circle */}
        <div
          className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full overflow-hidden"
          style={{ backgroundColor: iconBg }}
        >
          {showDbImage ? (
            <img
              src={icon!}
              alt={subjectName}
              className="h-[28px] w-[28px] object-contain"
              style={isCompleted ? { filter: "grayscale(100%) opacity(0.5)" } : undefined}
              onError={() => setImgError(true)}
            />
          ) : (
            <SubjectIcon subjectName={subjectName} size={26} color={iconColor} />
          )}
        </div>

        {/* Text */}
        <div>
          <h3
            className="text-[20px] font-[700] uppercase leading-tight tracking-wide"
            style={{ color: titleColor }}
          >
            {title}
          </h3>

          <p
            className="mt-[6px] max-w-[360px] text-[14px] leading-[18px]"
            style={{ color: syllabusTextColor }}
          >
            <span
              className="font-[700] text-[14px]"
              style={{ color: syllabusLabelColor }}
            >
              Syllabus :{" "}
            </span>
            {syllabus}
          </p>

          {/* ── Time & Marks (only rendered when props are passed) ── */}
          {hasMeta && (
            <div className="mt-[8px] flex items-center gap-4">
              {hasTime && (
                <span className="flex items-center gap-1 text-[13px] font-[500]" style={{ color: metaColor }}>
                  {/* Clock icon */}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {startTime && endTime
                    ? `${startTime} – ${endTime}`
                    : startTime ?? endTime}
                </span>
              )}

              {totalMarks != null && (
                <span className="flex items-center gap-1 text-[13px] font-[500]" style={{ color: metaColor }}>
                  {/* Marks icon */}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  {totalMarks} Marks
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* DATE BOX */}
      <div className="relative h-[74px] w-[74px] shrink-0">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border" style={{ borderColor: gridBorderColor }} />
          ))}
        </div>
        <div className="absolute inset-0 ml-2 flex items-center justify-center">
          <span className="text-4xl font-semibold leading-none" style={{ color: dateColor }}>
            {date}
          </span>
          <span className="mb-auto mt-1 ml-[2px] text-[12px] font-[600]" style={{ color: textColor }}>
            {suffix}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;