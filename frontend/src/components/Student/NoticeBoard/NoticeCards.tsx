// import noticeIconBlue from "../../../assets/Student/NoticeBoard/blue.svg";
// import noticeIconPink from "../../../assets/Student/NoticeBoard/pink.svg";
// import noticeIconPurple from "../../../assets/Student/NoticeBoard/purple.svg";

// const noticesToday = [
//   {
//     id: 1,
//     title: "Online Homework Portal Maintenance Downtime",
//     description:
//       "Due to scheduled maintenance, the online homework portal will be unavailable on @Saturday 6:00 PM. Please submit assignments before the downtime.",
//     bg: "bg-indigo-50/50",
//     iconBg: "bg-indigo-200/50",
//     icon: noticeIconBlue,
//   },
//   {
//     id: 2,
//     title: "School Fire Drill Announcement",
//     description:
//       "There will be a fire drill on @Friday 11:30 AM. Follow your teacher’s instructions and assemble at your designated area.",
//     bg: "bg-pink-100/50",
//     iconBg: "bg-rose-300/20",
//     icon: noticeIconPink,
//   },
//   {
//     id: 3,
//     title: "Term 1 Fee Payment Deadline Reminder",
//     description:
//       "Fee payment for Term 1 closes on @May 25, 2026. Pay online or at the accounts office to avoid late charges.",
//     bg: " bg-violet-50 ",
//     iconBg: "bg-violet-400/20",
//     icon: noticeIconPurple,
//   },
// ];

// const noticesYesterday = [
//   {
//     id: 4,
//     title: "Science Exhibition Submission Deadline",
//     description:
//       "The science exhibition entries must be submitted by @Next Friday. Include project title, team members, and a short description.",
//     bg: "bg-indigo-50/50",
//     iconBg: "bg-indigo-200/50",
//     icon: noticeIconBlue,
//   },
// ];

// const NoticeCards = () => {
//   return (
//     <div className="mt-8">
//       {/* TODAY */}
//       <div>
//         <h3 className="text-[18px] font-[700] text-[#666666]">Today</h3>

//         <div className="relative mt-8 pl-14">
//           {/* Timeline */}
//           <div className="absolute left-[18px] top-0 h-full w-[1.5px] bg-[#3A71FF]/40" />

//           {/* Top Dot */}
//           <div className="absolute left-[13px] top-0 h-[12px] w-[12px] rounded-full bg-[#3A71FF]" />

//           {/* Bottom Dot */}
//           <div className="absolute bottom-0 left-[13px] h-[12px] w-[12px] rounded-full bg-[#3A71FF]" />

//           <div className="flex flex-col gap-9">
//             {noticesToday.map((notice) => (
//               <div
//                 key={notice.id}
//                 className={`
//                   ${notice.bg}
//                   flex
//                   items-center
//                   gap-10
//                   rounded-3xl
//                   px-10
//                   py-9
//                  shadow-[0px_10px_50px_0px_rgba(0,0,0,0.10)]
//                 `}
//               >
//                 {/* Icon */}
//                 <div
//                   className={`
//                     ${notice.iconBg}
//                     flex
//                     h-[84px]
//                     w-[84px]
//                     items-center
//                     justify-center
//                     rounded-full
//                     shrink-0
//                   `}
//                 >
//                   <img
//                     src={notice.icon}
//                     alt="notice"
//                     className="h-[44px] w-[44px]"
//                   />
//                 </div>

//                 {/* Content */}
//                 <div>
//                   <h2 className="text-[20px] font-[700] text-[#111111]">
//                     {notice.title}
//                   </h2>

//                   <p className="mt-3 max-w-[620px] text-[15px] leading-[24px] text-[#333333]">
//                     {notice.description}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* YESTERDAY */}
//       <div className="mt-16">
//         <h3 className="text-[18px] font-[700] text-[#666666]">Yesterday</h3>

//         <div className="relative mt-8 pl-14">
//           {/* Timeline */}
//           <div className="absolute left-[18px] top-0 h-full w-[1.5px] bg-[#3A71FF]/40" />

//           {/* Top Dot */}
//           <div className="absolute left-[13px] top-0 h-[12px] w-[12px] rounded-full bg-[#3A71FF]" />

//           <div className="flex flex-col gap-9">
//             {noticesYesterday.map((notice) => (
//               <div
//                 key={notice.id}
//                 className={`
//                   ${notice.bg}
//                   flex
//                   items-center
//                   gap-10
//                   rounded-[34px]
//                   px-10
//                   py-9
//                   shadow-[0px_30px_60px_rgba(0,0,0,0.04)]
//                 `}
//               >
//                 {/* Icon */}
//                 <div
//                   className={`
//                     ${notice.iconBg}
//                     flex
//                     h-[84px]
//                     w-[84px]
//                     items-center
//                     justify-center
//                     rounded-full
//                     shrink-0
//                   `}
//                 >
//                   <img
//                     src={notice.icon}
//                     alt="notice"
//                     className="h-[44px] w-[44px]"
//                   />
//                 </div>

//                 {/* Content */}
//                 <div>
//                   <h2 className="text-[20px] font-[700] text-[#111111]">
//                     {notice.title}
//                   </h2>

//                   <p className="mt-3 max-w-[620px] text-[15px] leading-[24px] text-[#333333]">
//                     {notice.description}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NoticeCards;

import { useEffect, useState } from "react";
import axios from "axios";
import noticeIconBlue from "../../../assets/Student/NoticeBoard/blue.svg";
import noticeIconPink from "../../../assets/Student/NoticeBoard/pink.svg";
import noticeIconPurple from "../../../assets/Student/NoticeBoard/purple.svg";

interface Notice {
  id: string;
  title: string;
  content: string;
  targetType: "GLOBAL" | "ROLE" | "CLASS" | "SECTION";
  targetId: string | null;
  priority: "STANDARD" | "HIGH" | "URGENT";
  createdAt: string;
  author: {
    name: string;
    role: string;
  };
}

// Cycle through 3 styles based on index
const CARD_STYLES = [
  {
    bg: "bg-indigo-50/50",
    iconBg: "bg-indigo-200/50",
    icon: noticeIconBlue,
  },
  {
    bg: "bg-pink-100/50",
    iconBg: "bg-rose-300/20",
    icon: noticeIconPink,
  },
  {
    bg: "bg-violet-50",
    iconBg: "bg-violet-400/20",
    icon: noticeIconPurple,
  },
];

const isToday = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

const isYesterday = (dateStr: string) => {
  const date = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

const NoticeGroup = ({
  label,
  notices,
}: {
  label: string;
  notices: Notice[];
}) => {
  if (notices.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-[18px] font-[700] text-[#666666]">{label}</h3>

      <div className="relative mt-8 pl-14">
        {/* Timeline line */}
        <div className="absolute left-[18px] top-0 h-full w-[1.5px] bg-[#3A71FF]/40" />
        {/* Top dot */}
        <div className="absolute left-[13px] top-0 h-[12px] w-[12px] rounded-full bg-[#3A71FF]" />
        {/* Bottom dot */}
        <div className="absolute bottom-0 left-[13px] h-[12px] w-[12px] rounded-full bg-[#3A71FF]" />

        <div className="flex flex-col gap-9">
          {notices.map((notice, index) => {
            const style = CARD_STYLES[index % CARD_STYLES.length];
            return (
              <div
                key={notice.id}
                className={`
                  ${style.bg}
                  flex items-center gap-10
                  rounded-3xl px-10 py-9
                  shadow-[0px_10px_50px_0px_rgba(0,0,0,0.10)]
                `}
              >
                {/* Icon */}
                <div
                  className={`
                    ${style.iconBg}
                    flex h-[84px] w-[84px] shrink-0
                    items-center justify-center rounded-full
                  `}
                >
                  <img
                    src={style.icon}
                    alt="notice"
                    className="h-[44px] w-[44px]"
                  />
                </div>

                {/* Content */}
                <div>
                  <h2 className="text-[20px] font-[700] text-[#111111]">
                    {notice.title}
                  </h2>
                  <p className="mt-3 max-w-[620px] text-[15px] leading-[24px] text-[#333333]">
                    {notice.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const NoticeCards = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/notices/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.data.success) {
          setNotices(response.data.data);
        } else {
          setError("Failed to fetch notices.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Error connecting to notice server.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Loading state — matches the spinner pattern from StudentProfile
  if (loading) {
    return (
      <div className="mt-8 flex h-[300px] flex-col items-center justify-center rounded-3xl bg-white/40">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#3B4FE8]" />
        <span className="mt-3 text-sm font-medium text-gray-500">
          Loading notices...
        </span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-8 rounded-3xl border border-red-100 bg-red-50 p-6 text-sm font-medium text-red-700">
        ⚠️ {error}
      </div>
    );
  }

  // Empty state
  if (notices.length === 0) {
    return (
      <div className="mt-8 rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm font-medium text-gray-500">
        No notices available for you right now.
      </div>
    );
  }

  const todayNotices = notices.filter((n) => isToday(n.createdAt));
  const yesterdayNotices = notices.filter((n) => isYesterday(n.createdAt));

  return (
    <div className="mt-8">
      <NoticeGroup label="Today" notices={todayNotices} />
      <NoticeGroup label="Yesterday" notices={yesterdayNotices} />
    </div>
  );
};

export default NoticeCards;
