import { Trash2, Bell } from "lucide-react"
import type { Notice } from "../../../../types/notice"

interface NoticesTimelineProps {
  notices: Notice[]
  isLoading: boolean
  error: string | null
  selectedDate: Date | null
  onDelete: (id: string) => void
}

// ── Colour palette by category (same visual identity as before) ──────────────
const CATEGORY_STYLES: Record<string, { iconBg: string; iconColor: string; cardBg: string }> = {
  ACADEMIC:      { iconBg: "bg-[#4285F4]/10", iconColor: "text-[#4285F4]",  cardBg: "bg-[#4285F4]/[0.02] border-[#4285F4]/10" },
  ANNOUNCEMENT:  { iconBg: "bg-rose-500/10",  iconColor: "text-rose-500",   cardBg: "bg-rose-500/[0.01] border-rose-500/10" },
  STAFF_CIRCULAR:{ iconBg: "bg-purple-500/10",iconColor: "text-purple-500", cardBg: "bg-purple-500/[0.01] border-purple-500/10" },
  SCHOOL_EVENT:  { iconBg: "bg-amber-500/10", iconColor: "text-amber-500",  cardBg: "bg-amber-500/[0.01] border-amber-500/10" },
  HOLIDAY:       { iconBg: "bg-emerald-500/10",iconColor: "text-emerald-600",cardBg: "bg-emerald-500/[0.01] border-emerald-500/10" },
  EXAM:          { iconBg: "bg-indigo-500/10", iconColor: "text-indigo-600", cardBg: "bg-indigo-500/[0.01] border-indigo-500/10" },
}
const DEFAULT_STYLE = { iconBg: "bg-gray-100", iconColor: "text-gray-500", cardBg: "bg-gray-50 border-gray-200" }

const DocumentIcon = ({ iconColor }: { iconColor: string }) => (
  <svg className={`h-6 w-6 ${iconColor}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <line x1="8" y1="9" x2="16" y2="9" strokeLinecap="round" />
    <line x1="8" y1="13" x2="12" y2="13" strokeLinecap="round" />
  </svg>
)

// ── Date group helper ────────────────────────────────────────────────────────
const getDateGroup = (dateStr: string): string => {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return "Today"
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

// ── Audience label helper ────────────────────────────────────────────────────
const getAudienceLabel = (notice: Notice): string => {
  if (notice.targetType === "GLOBAL") return "Everyone"
  if (notice.targetType === "ROLE") {
    if (notice.targetId === "STUDENT") return "All Students"
    if (notice.targetId === "TEACHER") return "All Teachers"
    return notice.targetId ?? "Role"
  }
  if (notice.targetType === "CLASS") return "Class"
  if (notice.targetType === "SECTION") return "Section"
  return notice.targetType
}

const PRIORITY_COLORS: Record<string, string> = {
  URGENT: "bg-red-100 text-red-700",
  HIGH:   "bg-orange-100 text-orange-700",
  STANDARD: "bg-gray-100 text-gray-600",
}

export default function NoticesTimeline({
  notices,
  isLoading,
  error,
  selectedDate,
  onDelete,
}: NoticesTimelineProps) {

  // ── Apply date filter ────────────────────────────────────────────────────
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

  // ── Loading skeleton ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-100 rounded-2xl p-6 flex items-start gap-5 bg-white animate-pulse">
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

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 border border-dashed border-red-200 rounded-3xl bg-red-50/30 min-h-[300px]">
        <p className="text-sm font-semibold text-red-600">⚠ {error}</p>
      </div>
    )
  }

  // ── Empty state ──────────────────────────────────────────────────────────
  if (filtered.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 border border-dashed border-gray-200 rounded-3xl bg-white min-h-[300px]">
        <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <Bell className="h-6 w-6" />
        </div>
        <h3 className="font-bold text-gray-800 text-lg">No notices found</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-[280px] text-center">
          {selectedDate
            ? `No notices on ${selectedDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`
            : "No notices match the selected filter."}
        </p>
        {selectedDate && (
          <button
            onClick={() => {
              const clearBtn = document.querySelector("[data-clear-date]") as HTMLButtonElement
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

  // ── Group by date ────────────────────────────────────────────────────────
  const groups: { dateGroup: string; items: Notice[] }[] = []
  for (const notice of filtered) {
    const label = getDateGroup(notice.createdAt)
    let g = groups.find((g) => g.dateGroup === label)
    if (!g) { g = { dateGroup: label, items: [] }; groups.push(g) }
    g.items.push(notice)
  }
  // Ensure Today first, Yesterday second, rest chronological
  groups.sort((a, b) => {
    if (a.dateGroup === "Today") return -1
    if (b.dateGroup === "Today") return 1
    if (a.dateGroup === "Yesterday") return -1
    if (b.dateGroup === "Yesterday") return 1
    return 0
  })

  return (
    <div className="relative flex-1 w-full">
      {/* Vertical timeline line */}
      <div className="absolute left-[92px] top-6 bottom-6 w-px bg-gray-200" />

      <div className="flex flex-col gap-8 w-full">
        {groups.map((group, gidx) => (
          <div key={gidx} className="flex flex-col gap-4 w-full">

            {/* Group header row */}
            <div className="flex items-center">
              <span className="w-[80px] text-right text-xs font-semibold text-gray-500 tracking-wide uppercase pr-4">
                {group.dateGroup}
              </span>
              <div className="relative z-10 flex items-center justify-center w-[25px] h-[25px]">
                <div className="w-2.5 h-2.5 bg-[#4285F4] rounded-full ring-4 ring-white" />
              </div>
            </div>

            {/* Notice cards */}
            <div className="flex flex-col gap-4 ml-[105px]">
              {group.items.map((notice) => {
                const style = CATEGORY_STYLES[notice.category] ?? DEFAULT_STYLE
                const priorityClass = PRIORITY_COLORS[notice.priority] ?? PRIORITY_COLORS.STANDARD

                return (
                  <div
                    key={notice.id}
                    className={`border rounded-2xl p-5 flex items-start gap-5 hover:shadow-xs transition duration-200 ${style.cardBg}`}
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-gray-100 ${style.iconBg}`}>
                      <DocumentIcon iconColor={style.iconColor} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-bold text-gray-900 text-sm leading-snug">{notice.title}</h4>
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Priority badge */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityClass}`}>
                            {notice.priority}
                          </span>
                          {/* Delete button */}
                          <button
                            onClick={() => onDelete(notice.id)}
                            title="Delete notice"
                            className="text-gray-300 hover:text-red-500 transition cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                        {notice.content}
                      </p>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-md">
                          {notice.category.replace("_", " ")}
                        </span>
                        <span className="text-[10px] font-semibold text-[#4285F4] bg-[#4285F4]/10 px-2 py-0.5 rounded-md">
                          {getAudienceLabel(notice)}
                        </span>
                        <span className="text-[10px] text-gray-400 ml-auto">
                          by {notice.author.name}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        ))}

        {/* Bottom timeline dot */}
        <div className="flex items-center">
          <span className="w-[80px] pr-4" />
          <div className="relative z-10 flex items-center justify-center w-[25px] h-[25px]">
            <div className="w-2.5 h-2.5 bg-[#4285F4] rounded-full ring-4 ring-white" />
          </div>
        </div>
      </div>
    </div>
  )
}
