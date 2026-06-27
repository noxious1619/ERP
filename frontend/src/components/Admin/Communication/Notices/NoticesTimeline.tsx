import { useState } from "react"
import { Trash2 } from "lucide-react"
import type { Notice } from "../../../../types/notice"
import noticeIconBlue from "../../../../assets/Student/NoticeBoard/blue.svg"
import noticeIconPink from "../../../../assets/Student/NoticeBoard/pink.svg"
import noticeIconPurple from "../../../../assets/Student/NoticeBoard/purple.svg"

interface NoticesTimelineProps {
  notices: Notice[]
  isLoading: boolean
  error: string | null
  selectedDate: Date | null
  onDelete: (id: string) => void
}

const CARD_STYLES = [
  { bg: "bg-indigo-50/50", iconBg: "bg-indigo-200/50", icon: noticeIconBlue },
  { bg: "bg-pink-100/50", iconBg: "bg-rose-300/20", icon: noticeIconPink },
  { bg: "bg-violet-50", iconBg: "bg-violet-400/20", icon: noticeIconPurple },
]

const isToday = (dateStr: string) => {
  const d = new Date(dateStr)
  const now = new Date()
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  )
}

const isYesterday = (dateStr: string) => {
  const d = new Date(dateStr)
  const y = new Date()
  y.setDate(y.getDate() - 1)
  return (
    d.getDate() === y.getDate() &&
    d.getMonth() === y.getMonth() &&
    d.getFullYear() === y.getFullYear()
  )
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

const TruncatedContent = ({ content }: { content: string }) => {
  const [expanded, setExpanded] = useState(false)
  const WORD_LIMIT = 30
  const words = content.split(" ")
  const isLong = words.length > WORD_LIMIT
  const preview = words.slice(0, WORD_LIMIT).join(" ")

  return (
    <p className="mt-3 max-w-[620px] text-[15px] leading-[24px] text-[#333333]">
      {expanded || !isLong ? content : `${preview}...`}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-2 text-[#3A71FF] text-[14px] font-[500] hover:underline cursor-pointer"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </p>
  )
}

const AdminNoticeCard = ({
  notice,
  style,
  onDelete,
}: {
  notice: Notice
  style: (typeof CARD_STYLES)[0]
  onDelete: (id: string) => void
}) => {
  return (
    <div
      className={`
        relative flex items-center gap-10 rounded-3xl px-10 py-9
        shadow-[0px_10px_50px_0px_rgba(0,0,0,0.10)]
        transition-all duration-300
        ${style.bg}
      `}
    >
      {/* Left Icon circle */}
      <div
        className={`${style.iconBg} flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-full`}
      >
        <img src={style.icon} alt="notice" className="h-[44px] w-[44px]" />
      </div>

      {/* Content on the right */}
      <div className="flex-1 min-w-0 pr-24">
        <h2 className="text-[20px] font-[700] text-[#111111] leading-snug">
          {notice.title}
        </h2>
        <TruncatedContent content={notice.content} />
      </div>

      {/* Delete button: top-right corner of the card */}
      <button
        onClick={() => onDelete(notice.id)}
        title="Delete notice"
        className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition cursor-pointer p-2 rounded-full hover:bg-black/5"
      >
        <Trash2 className="h-5 w-5" />
      </button>

      {/* Author tag: bottom-right corner of the card */}
      <span className="absolute bottom-8 right-10 text-[13px] text-gray-500 font-medium">
        by {notice.author.name}
      </span>
    </div>
  )
}

const AdminNoticeGroup = ({
  label,
  notices,
  allNotices,
  onDelete,
}: {
  label: string
  notices: Notice[]
  allNotices: Notice[]
  onDelete: (id: string) => void
}) => {
  if (notices.length === 0) return null

  return (
    <div className="mt-8">
      <h3 className="text-[18px] font-[700] text-[#666666]">{label}</h3>
      <div className="relative mt-8 pl-14">
        <div className="absolute left-[18px] top-0 h-full w-[1.5px] bg-[#3A71FF]/40" />
        <div className="absolute left-[13px] top-0 h-[12px] w-[12px] rounded-full bg-[#3A71FF]" />
        <div className="absolute left-[13px] bottom-0 h-[12px] w-[12px] rounded-full bg-[#3A71FF]" />
        
        <div className="flex flex-col gap-9">
          {notices.map((notice) => {
            const index = allNotices.findIndex((n) => n.id === notice.id)
            const style = CARD_STYLES[index === -1 ? 0 : index % CARD_STYLES.length]

            return (
              <AdminNoticeCard
                key={notice.id}
                notice={notice}
                style={style}
                onDelete={onDelete}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function NoticesTimeline({
  notices,
  isLoading,
  error,
  selectedDate,
  onDelete,
}: NoticesTimelineProps) {
  // Apply date filter
  const filtered = selectedDate
    ? notices.filter((n) => {
        const d = new Date(n.createdAt)
        return (
          d.getDate() === selectedDate.getDate() &&
          d.getMonth() === selectedDate.getMonth() &&
          d.getFullYear() === selectedDate.getFullYear()
        )
      })
    : notices

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-gray-100 rounded-3xl p-6 flex items-start gap-5 bg-white animate-pulse"
          >
            <div className="w-14 h-14 rounded-full bg-gray-100 shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 border border-dashed border-red-200 rounded-3xl bg-red-50/30 min-h-[300px]">
        <p className="text-sm font-semibold text-red-600">⚠ {error}</p>
      </div>
    )
  }

  // Empty state
  if (filtered.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 border border-dashed border-gray-200 rounded-3xl bg-white min-h-[300px]">
        <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        <h3 className="font-bold text-gray-800 text-lg">No notices found</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-[280px] text-center">
          {selectedDate
            ? `No notices on ${selectedDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}.`
            : "No notices match the selected filter."}
        </p>
        {selectedDate && (
          <button
            onClick={() => {
              const clearBtn = document.querySelector(
                "[data-clear-date]"
              ) as HTMLButtonElement
              if (clearBtn) clearBtn.click()
            }}
            className="mt-4 text-xs font-bold text-[#4285F4] hover:text-blue-600 transition cursor-pointer"
          >
            Clear Date Filter
          </button>
        )}
      </div>
    )
  }

  const todayNotices = filtered.filter((n) => isToday(n.createdAt))
  const yesterdayNotices = filtered.filter((n) => isYesterday(n.createdAt))

  const olderNotices = filtered.filter(
    (n) => !isToday(n.createdAt) && !isYesterday(n.createdAt)
  )

  const groupedOlderNotices = olderNotices.reduce<Record<string, Notice[]>>(
    (acc, notice) => {
      const label = formatDate(notice.createdAt)
      if (!acc[label]) acc[label] = []
      acc[label].push(notice)
      return acc
    },
    {}
  )

  return (
    <div className="flex-1 w-full">
      <AdminNoticeGroup
        label="Today"
        notices={todayNotices}
        allNotices={notices}
        onDelete={onDelete}
      />
      <AdminNoticeGroup
        label="Yesterday"
        notices={yesterdayNotices}
        allNotices={notices}
        onDelete={onDelete}
      />
      {Object.entries(groupedOlderNotices).map(([dateLabel, noticesForDate]) => (
        <AdminNoticeGroup
          key={dateLabel}
          label={dateLabel}
          notices={noticesForDate}
          allNotices={notices}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
