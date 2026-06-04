import type { Notice } from "../../../types/notice";
import noticeIconBlue from "../../../assets/Student/NoticeBoard/blue.svg";
import noticeIconPink from "../../../assets/Student/NoticeBoard/pink.svg";
import noticeIconPurple from "../../../assets/Student/NoticeBoard/purple.svg";
const CARD_STYLES = [
  { bg: "bg-indigo-50/50", iconBg: "bg-indigo-200/50", icon: noticeIconBlue },
  { bg: "bg-pink-100/50",  iconBg: "bg-rose-300/20",   icon: noticeIconPink },
  { bg: "bg-violet-50",    iconBg: "bg-violet-400/20",  icon: noticeIconPurple },
];
const isToday = (dateStr: string) => {
  const d = new Date(dateStr), now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

const isYesterday = (dateStr: string) => {
  const d = new Date(dateStr), y = new Date();
  y.setDate(y.getDate() - 1);
  return (
    d.getDate() === y.getDate() &&
    d.getMonth() === y.getMonth() &&
    d.getFullYear() === y.getFullYear()
  );
};

const NoticeGroup = ({
  label,
  notices,
  allNotices,
}: {
  label: string;
  notices: Notice[];
  allNotices: Notice[];
}) => {
  if (notices.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-[18px] font-[700] text-[#666666]">{label}</h3>
      <div className="relative mt-8 pl-14">
        <div className="absolute left-[18px] top-0 h-full w-[1.5px] bg-[#3A71FF]/40" />
        <div className="absolute left-[13px] top-0 h-[12px] w-[12px] rounded-full bg-[#3A71FF]" />
        <div className="absolute bottom-0 left-[13px] h-[12px] w-[12px] rounded-full bg-[#3A71FF]" />
        <div className="flex flex-col gap-9">
          {notices.map((notice) => {
            const originalIndex = allNotices.findIndex((n) => n.id === notice.id);
            const style = CARD_STYLES[originalIndex % CARD_STYLES.length];
            return (
              <div
                key={notice.id}
                className={`${style.bg} flex items-center gap-10 rounded-3xl px-10 py-9 shadow-[0px_10px_50px_0px_rgba(0,0,0,0.10)]`}
              >
                <div className={`${style.iconBg} flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-full`}>
                  <img src={style.icon} alt="notice" className="h-[44px] w-[44px]" />
                </div>
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

interface NoticeCardsProps {
  notices: Notice[];
  allNotices: Notice[];
  isLoading: boolean;
  error: string | null;
}

const NoticeCards = ({ notices, allNotices, isLoading, error }: NoticeCardsProps) => {
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

  const todayNotices = notices.filter((n) => isToday(n.createdAt));
  const yesterdayNotices = notices.filter((n) => isYesterday(n.createdAt));

  return (
    <div className="mt-8">
      <NoticeGroup label="Today" notices={todayNotices} allNotices={allNotices} />
      <NoticeGroup label="Yesterday" notices={yesterdayNotices} allNotices={allNotices} />
    </div>
  );
};

export default NoticeCards;