interface NoticesTabsProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

const FILTERS = [
  { label: "All",            value: "ALL" },
  { label: "Announcements",  value: "ANNOUNCEMENT" },
  { label: "Academic",       value: "ACADEMIC" },
  { label: "Holidays",       value: "HOLIDAY" },
  { label: "Exams",          value: "EXAM" },
  { label: "School events",  value: "SCHOOL_EVENT" },
  { label: "Circulars",      value: "STAFF_CIRCULAR" },
]

export default function NoticesTabs({ activeFilter, onFilterChange }: NoticesTabsProps) {
  return (
    <div className="border-b border-gray-200/80 w-full mt-4 flex overflow-x-auto gap-8 scrollbar-none">
      {FILTERS.map((tab) => {
        const isActive = activeFilter === tab.value
        return (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value)}
            className={`pb-3.5 text-sm font-semibold transition-all relative shrink-0 cursor-pointer ${
              isActive 
                ? "text-[#4285F4]" 
                : "text-gray-500 hover:text-gray-950"
            }`}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4285F4]" />
            )}
          </button>
        )
      })}
    </div>
  )
}
