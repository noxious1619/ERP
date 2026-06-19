import { Bell } from "lucide-react"

interface NoticesTimelineProps {
  activeTab: string
  selectedDate: Date | null
}

const DocumentIcon = ({ iconColor }: { iconColor: string }) => (
  <svg className={`h-6 w-6 ${iconColor}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <rect x="4" y="5" width="16" height="14" rx="2" />
    <line x1="8" y1="9" x2="16" y2="9" strokeLinecap="round" />
    <line x1="8" y1="13" x2="12" y2="13" strokeLinecap="round" />
  </svg>
)

export default function NoticesTimeline({ activeTab, selectedDate }: NoticesTimelineProps) {
  const allNotices = [
    {
      title: "Online Homework Portal Maintenance Downtime",
      desc: "Due to scheduled maintenance, the online homework portal will be unavailable on @Saturday 6:00 PM. Please submit assignments before the downtime.",
      category: "ACADEMIC",
      group: "Today",
      iconBg: "bg-[#4285F4]/10",
      iconColor: "text-[#4285F4]",
      cardBg: "bg-[#4285F4]/[0.02] border-[#4285F4]/10"
    },
    {
      title: "School Fire Drill Announcement",
      desc: "There will be a fire drill on @Friday 11:30 AM. Follow your teacher's instructions and assemble at your designated area.",
      category: "ANNOUNCEMENT",
      group: "Today",
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-500",
      cardBg: "bg-rose-500/[0.01] border-rose-500/10"
    },
    {
      title: "Term 1 Fee Payment Deadline Reminder",
      desc: "Fee payment for Term 1 closes on @May 25, 2026. Pay online or at the accounts office to avoid late charges.",
      category: "STAFF_CIRCULAR",
      group: "Yesterday",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      cardBg: "bg-purple-500/[0.01] border-purple-500/10"
    },
    {
      title: "Science Exhibition Submission Deadline",
      desc: "The science exhibition entries must be submitted by @Next Friday. Include project title, team members, and a short description.",
      category: "SCHOOL_EVENT",
      group: "Yesterday",
      iconBg: "bg-[#4285F4]/10",
      iconColor: "text-[#4285F4]",
      cardBg: "bg-[#4285F4]/[0.02] border-[#4285F4]/10"
    }
  ]

  // Filter notices based on activeTab and selectedDate
  const filteredNotices = allNotices.filter((item) => {
    // 1. Tab Filter
    if (activeTab !== "ALL" && item.category !== activeTab) {
      return false
    }

    // 2. Date Filter
    if (selectedDate) {
      const day = selectedDate.getDate()
      const month = selectedDate.getMonth()
      const year = selectedDate.getFullYear()

      const today = new Date()
      if (year === today.getFullYear() && month === today.getMonth()) {
        if (day === today.getDate()) return item.group === "Today"
        
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)
        if (day === yesterday.getDate()) return item.group === "Yesterday"

        if (day === 18) return item.title.includes("Science Exhibition")
        if (day === 20) return item.title.includes("Fire Drill")
        if (day === 25) return item.title.includes("Fee Payment")
        return false // No notices on other days
      }
      return false // No notices outside current month in mock
    }

    return true
  })

  // Group filtered notices by group name
  const noticeGroups: { dateGroup: string; items: typeof allNotices }[] = []

  filteredNotices.forEach((notice) => {
    let group = noticeGroups.find((g) => g.dateGroup === notice.group)
    if (!group) {
      group = { dateGroup: notice.group, items: [] }
      noticeGroups.push(group)
    }
    group.items.push(notice)
  })

  // Ensure "Today" group appears first if both exist
  noticeGroups.sort((a, b) => {
    if (a.dateGroup === "Today") return -1
    if (b.dateGroup === "Today") return 1
    return 0
  })

  if (filteredNotices.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 border border-dashed border-gray-200 rounded-3xl bg-white min-h-[300px]">
        <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <Bell className="h-6 w-6" />
        </div>
        <h3 className="font-bold text-gray-800 text-lg">No notices found</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-[280px] text-center">
          {selectedDate 
            ? `There are no notices scheduled for ${selectedDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`
            : "No notices match the selected category tab filter."}
        </p>
        {selectedDate && (
          <button 
            onClick={() => {
              // Click to reset date filter (handled by clicking calendar, but nice helper here)
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

  return (
    <div className="relative flex-1 w-full">
      {/* Vertical Timeline Line */}
      <div className="absolute left-[92px] top-6 bottom-6 w-px bg-gray-200" />

      <div className="flex flex-col gap-8 w-full">
        {noticeGroups.map((group, gidx) => (
          <div key={gidx} className="flex flex-col gap-4 w-full">
            
            {/* Timeline Group Title Row */}
            <div className="flex items-center">
              {/* Date Column */}
              <span className="w-[80px] text-right text-xs font-semibold text-gray-500 tracking-wide uppercase pr-4">
                {group.dateGroup}
              </span>
              
              {/* Timeline dot */}
              <div className="relative z-10 flex items-center justify-center w-[25px] h-[25px]">
                <div className="w-2.5 h-2.5 bg-[#4285F4] rounded-full ring-4 ring-white" />
              </div>
            </div>

            {/* Group Items */}
            <div className="flex flex-col gap-4 ml-[105px]">
              {group.items.map((item, idx) => (
                <div 
                  key={idx}
                  className={`border rounded-2xl p-6 flex items-start gap-5 hover:shadow-xs transition duration-200 ${item.cardBg}`}
                >
                  {/* Icon Circle */}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border border-gray-100 ${item.iconBg}`}>
                    <DocumentIcon iconColor={item.iconColor} />
                  </div>

                  {/* Announcement Content */}
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-base">{item.title}</h4>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      {item.desc.split(/(@\w+(?:\s\d+:\d+\s[A-Z]+|\s\d+,\s\d+)?)/g).map((part, pidx) => 
                        part.startsWith("@") ? (
                          <span key={pidx} className="font-semibold text-gray-700">{part}</span>
                        ) : (
                          part
                        )
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
        {/* Extra Bottom dot for visual finish */}
        <div className="flex items-center">
          <span className="w-[80px] pr-4"></span>
          <div className="relative z-10 flex items-center justify-center w-[25px] h-[25px]">
            <div className="w-2.5 h-2.5 bg-[#4285F4] rounded-full ring-4 ring-white" />
          </div>
        </div>
      </div>
    </div>
  )
}
