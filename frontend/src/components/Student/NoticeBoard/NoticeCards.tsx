// import type { Notice } from "../../../types/notice";
// import noticeIconBlue from "../../../assets/Student/NoticeBoard/blue.svg";
// import noticeIconPink from "../../../assets/Student/NoticeBoard/pink.svg";
// import noticeIconPurple from "../../../assets/Student/NoticeBoard/purple.svg";
// import { useState } from "react";
// const CARD_STYLES = [
//   { bg: "bg-indigo-50/50", iconBg: "bg-indigo-200/50", icon: noticeIconBlue },
//   { bg: "bg-pink-100/50", iconBg: "bg-rose-300/20", icon: noticeIconPink },
//   { bg: "bg-violet-50", iconBg: "bg-violet-400/20", icon: noticeIconPurple },
// ];

// const isToday = (dateStr: string) => {
//   const d = new Date(dateStr),
//     now = new Date();
//   return (
//     d.getDate() === now.getDate() &&
//     d.getMonth() === now.getMonth() &&
//     d.getFullYear() === now.getFullYear()
//   );
// };

// const isYesterday = (dateStr: string) => {
//   const d = new Date(dateStr),
//     y = new Date();
//   y.setDate(y.getDate() - 1);
//   return (
//     d.getDate() === y.getDate() &&
//     d.getMonth() === y.getMonth() &&
//     d.getFullYear() === y.getFullYear()
//   );
// };

// const TruncatedContent = ({ content }: { content: string }) => {
//   const [expanded, setExpanded] = useState(false);
//   const WORD_LIMIT = 30;
//   const words = content.split(" ");
//   const isLong = words.length > WORD_LIMIT;
//   const preview = words.slice(0, WORD_LIMIT).join(" ");

//   return (
//     <p className="mt-3 max-w-[620px] text-[15px] leading-[24px] text-[#333333]">
//       {expanded || !isLong ? content : `${preview}...`}
//       {isLong && (
//         <button
//           onClick={() => setExpanded(!expanded)}
//           className="ml-2 text-[#3A71FF] text-[14px] font-[500] hover:underline"
//         >
//           {expanded ? "Read less" : "Read more"}
//         </button>
//       )}
//     </p>
//   );
// };

// const NoticeGroup = ({
//   label,
//   notices,
//   allNotices,
// }: {
//   label: string;
//   notices: Notice[];
//   allNotices: Notice[];
// }) => {
//   if (notices.length === 0) return null;

//   return (
//     <div className="mt-8">
//       <h3 className="text-[18px] font-[700] text-[#666666]">{label}</h3>
//       <div className="relative mt-8 pl-14">
//         <div className="absolute left-[18px] top-0 h-full w-[1.5px] bg-[#3A71FF]/40" />
//         <div className="absolute left-[13px] top-0 h-[12px] w-[12px] rounded-full bg-[#3A71FF]" />
//         <div className="absolute bottom-0 left-[13px] h-[12px] w-[12px] rounded-full bg-[#3A71FF]" />
//         <div className="flex flex-col gap-9">
//           {notices.map((notice) => {
//             const index = allNotices.findIndex((n) => n.id === notice.id);
//             const style = CARD_STYLES[index % CARD_STYLES.length];
//             return (
//               <div
//                 key={notice.id}
//                 className={`${style.bg} flex items-center gap-10 rounded-3xl px-10 py-9 shadow-[0px_10px_50px_0px_rgba(0,0,0,0.10)]`}
//               >
//                 <div
//                   className={`${style.iconBg} flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-full`}
//                 >
//                   <img
//                     src={style.icon}
//                     alt="notice"
//                     className="h-[44px] w-[44px]"
//                   />
//                 </div>
//                 <div>
//                   <h2 className="text-[20px] font-[700] text-[#111111]">
//                     {notice.title}
//                   </h2>
//                   <TruncatedContent content={notice.content} />
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// interface NoticeCardsProps {
//   notices: Notice[];
//   isLoading: boolean;
//   error: string | null;
//   allNotices: Notice[];
// }

// const NoticeCards = ({
//   notices,
//   allNotices,
//   isLoading,
//   error,
// }: NoticeCardsProps) => {
//   if (isLoading) {
//     return (
//       <div className="mt-8 flex h-[300px] flex-col items-center justify-center rounded-3xl bg-white/40">
//         <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#3B4FE8]" />
//         <span className="mt-3 text-sm font-medium text-gray-500">
//           Loading notices...
//         </span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mt-8 rounded-3xl border border-red-100 bg-red-50 p-6 text-sm font-medium text-red-700">
//         ⚠️ {error}
//       </div>
//     );
//   }

//   if (notices.length === 0) {
//     return (
//       <div className="mt-8 rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm font-medium text-gray-500">
//         No notices available for this category.
//       </div>
//     );
//   }

//   const todayNotices = notices.filter((n) => isToday(n.createdAt));
//   const yesterdayNotices = notices.filter((n) => isYesterday(n.createdAt));

//   return (
//     <div className="mt-8">
//       <NoticeGroup
//         label="Today"
//         notices={todayNotices}
//         allNotices={allNotices}
//       />
//       <NoticeGroup
//         label="Yesterday"
//         notices={yesterdayNotices}
//         allNotices={allNotices}
//       />
//     </div>
//   );
// };

// export default NoticeCards;

import type { Notice } from "../../../types/notice";
import noticeIconBlue from "../../../assets/Student/NoticeBoard/blue.svg";
import noticeIconPink from "../../../assets/Student/NoticeBoard/pink.svg";
import noticeIconPurple from "../../../assets/Student/NoticeBoard/purple.svg";
import { useState, useEffect, useRef } from "react";

const CARD_STYLES = [
  { bg: "bg-indigo-50/50", iconBg: "bg-indigo-200/50", icon: noticeIconBlue },
  { bg: "bg-pink-100/50", iconBg: "bg-rose-300/20", icon: noticeIconPink },
  { bg: "bg-violet-50", iconBg: "bg-violet-400/20", icon: noticeIconPurple },
];


const isToday = (dateStr: string) => {
  const d = new Date(dateStr),
    now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

const isYesterday = (dateStr: string) => {
  const d = new Date(dateStr),
    y = new Date();
  y.setDate(y.getDate() - 1);
  return (
    d.getDate() === y.getDate() &&
    d.getMonth() === y.getMonth() &&
    d.getFullYear() === y.getFullYear()
  );
};

// Formats a date string into "Month Day, Year" (e.g., "June 4, 2026")
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// ─── Truncated content with Read more / Read less ────────────────────────────
const TruncatedContent = ({ content }: { content: string }) => {
  const [expanded, setExpanded] = useState(false);
  const WORD_LIMIT = 30;
  const words = content.split(" ");
  const isLong = words.length > WORD_LIMIT;
  const preview = words.slice(0, WORD_LIMIT).join(" ");

  return (
    <p className="mt-3 max-w-[620px] text-[15px] leading-[24px] text-[#333333]">
      {expanded || !isLong ? content : `${preview}...`}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-2 text-[#3A71FF] text-[14px] font-[500] hover:underline"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </p>
  );
};

// ─── Single notice card ───────────────────────────────────────────────────────
const NoticeCard = ({
  notice,
  style,
  isHighlighted,
  cardRef,
}: {
  notice: Notice;
  style: (typeof CARD_STYLES)[0];
  isHighlighted: boolean;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div
      ref={cardRef}
      className={`
        flex items-center gap-10 rounded-3xl px-10 py-9
        shadow-[0px_10px_50px_0px_rgba(0,0,0,0.10)]
        transition-all duration-500
        ${style.bg}
        ${
          isHighlighted
            ? "ring-2 ring-[#3A71FF] ring-offset-2 scale-[1.01]"
            : "ring-0 scale-100"
        }
      `}
    >
      <div
        className={`${style.iconBg} flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-full`}
      >
        <img src={style.icon} alt="notice" className="h-[44px] w-[44px]" />
      </div>
      <div>
        <h2 className="text-[20px] font-[700] text-[#111111]">
          {notice.title}
        </h2>
        <TruncatedContent content={notice.content} />
      </div>
    </div>
  );
};

// ─── Notice group (Today / Yesterday / label) ─────────────────────────────────
const NoticeGroup = ({
  label,
  notices,
  allNotices,
  highlightId,
  activeHighlightId,
  highlightRef,
}: {
  label: string;
  notices: Notice[];
  allNotices: Notice[];
  highlightId: string | null; // used to attach the ref to the right card
  activeHighlightId: string | null; // used to show the blue ring after scroll
  highlightRef: React.RefObject<HTMLDivElement | null>;
}) => {
  if (notices.length === 0) return null;

  const noopRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="mt-8">
      <h3 className="text-[18px] font-[700] text-[#666666]">{label}</h3>
      <div className="relative mt-8 pl-14">
        <div className="absolute left-[18px] top-0 h-full w-[1.5px] bg-[#3A71FF]/40" />
        <div className="absolute left-[13px] top-0    h-[12px] w-[12px] rounded-full bg-[#3A71FF]" />
        <div className="absolute left-[13px] bottom-0 h-[12px] w-[12px] rounded-full bg-[#3A71FF]" />

        <div className="flex flex-col gap-9">
          {notices.map((notice) => {
            const index = allNotices.findIndex((n) => n.id === notice.id);
            const style = CARD_STYLES[index % CARD_STYLES.length];
            const isTargeted = highlightId === notice.id; // attach ref
            const isHighlighted = activeHighlightId === notice.id; // show ring

            return (
              <NoticeCard
                key={notice.id}
                notice={notice}
                style={style}
                isHighlighted={isHighlighted}
                cardRef={isTargeted ? highlightRef : noopRef}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Main NoticeCards component ───────────────────────────────────────────────
interface NoticeCardsProps {
  notices: Notice[];
  isLoading: boolean;
  error: string | null;
  allNotices: Notice[];
  /**
   * ID of the notice to scroll to and highlight.
   * Passed from TeacherNoticeBoard which reads ?highlight=<id> from the URL.
   * null = no highlight.
   */
  highlightId?: string | null;
}

const NoticeCards = ({
  notices,
  allNotices,
  isLoading,
  error,
  highlightId = null,
}: NoticeCardsProps) => {
  // Ref attached to the highlighted card's DOM node
  const highlightRef = useRef<HTMLDivElement | null>(null);
  // Controls the glowing ring — true for 2 seconds then clears
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  useEffect(() => {
    // Guard: no highlight needed, or data still loading
    if (!highlightId || isLoading) return;

    // After isLoading becomes false, React still needs one paint cycle to render
    // the notice cards and attach refs. requestAnimationFrame waits for that paint,
    // then we do a final 100ms settle before scrolling.
    let clearTimer: ReturnType<typeof setTimeout>;

    const raf = requestAnimationFrame(() => {
      const settleTimer = setTimeout(() => {
        const el = highlightRef.current;
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          setActiveHighlight(highlightId);

          // Start the clear timer ONLY after a successful scroll — 2.5s ring duration
          clearTimer = setTimeout(() => {
            setActiveHighlight(null);
          }, 2500);
        }
      }, 100);

      // Cleanup for the settle timer if effect re-runs
      return () => clearTimeout(settleTimer);
    });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(clearTimer);
    };
  }, [highlightId, isLoading]); // re-runs when loading finishes or id changes

  if (isLoading) {
    return (
      <div className="mt-8 flex h-[300px] flex-col items-center justify-center rounded-3xl bg-white/40">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#3B4FE8]" />
        <span className="mt-3 text-sm font-medium text-gray-500">
          Loading notices...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 rounded-3xl border border-red-100 bg-red-50 p-6 text-sm font-medium text-red-700">
        ⚠️ {error}
      </div>
    );
  }

  if (notices.length === 0) {
    return (
      <div className="mt-8 rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm font-medium text-gray-500">
        No notices available for this category.
      </div>
    );
  }

  // 1. Isolate Today and Yesterday
  const todayNotices = notices.filter((n) => isToday(n.createdAt));
  const yesterdayNotices = notices.filter((n) => isYesterday(n.createdAt));
  const sharedGroupProps = {
    allNotices,
    // highlightId for REF ATTACHMENT — uses the prop so the ref is attached immediately
    // when cards render, before activeHighlight state is set by the scroll effect.
    highlightId: highlightId,
    // activeHighlightId for RING STYLING — only shows ring after scroll succeeds
    activeHighlightId: activeHighlight,
    highlightRef,
  };

  return (
  <div className="mt-8">
    {/* Static Groups */}
    <NoticeGroup
      label="Today"
      notices={todayNotices}
      {...sharedGroupProps}
    />

    <NoticeGroup
      label="Yesterday"
      notices={yesterdayNotices}
      {...sharedGroupProps}
    />

    {/* Dynamic groups for older notices grouped by date */}
    {Object.entries(groupedOlderNotices).map(
      ([dateLabel, noticesForDate]) => (
        <NoticeGroup
          key={dateLabel}
          label={dateLabel}
          notices={noticesForDate}
          {...sharedGroupProps}
        />
      )
    )}
  </div>
);
};

export default NoticeCards;
