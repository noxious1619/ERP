import { Pin, Plus } from "lucide-react"

export default function NoticeBoardCard() {
  const notices = [
    {
      title: "Parent-Teacher Meeting",
      desc: "Scheduled for June 5th, 2026",
      time: "2 hours ago",
      iconBg: "bg-orange-50 text-orange-500",
    },
    {
      title: "Sports Day Announcement",
      desc: "Annual sports day on June 15th",
      time: "5 hours ago",
      iconBg: "bg-blue-50 text-blue-500",
    },
    {
      title: "Library Books Return",
      desc: "Please return all borrowed books by June 10th",
      time: "1 day ago",
      iconBg: "bg-green-50 text-green-500",
    }
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 flex-1">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900 font-sans">Notice Board</h3>
          <p className="text-sm text-gray-500 mt-0.5">School & class announcements</p>
        </div>
        <button className="bg-[#4285F4] hover:bg-blue-600 text-white rounded-full p-2.5 flex items-center justify-center shadow-sm transition cursor-pointer">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Notices List */}
      <div className="flex flex-col gap-4">
        {notices.map((notice, idx) => (
          <div key={idx} className="bg-gray-50/30 border border-gray-100 rounded-2xl p-5 flex items-start gap-4 hover:shadow-xs transition duration-200">
            <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 ${notice.iconBg}`}>
              <Pin className="h-5 w-5 rotate-45" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-sm truncate">{notice.title}</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notice.desc}</p>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider block mt-2.5 uppercase">{notice.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
