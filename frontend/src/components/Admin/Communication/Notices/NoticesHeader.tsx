interface NoticesHeaderProps {
  onAddNoticeClick: () => void
}

export default function NoticesHeader({ onAddNoticeClick }: NoticesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-sans">Notice Board</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage all school notices and announcements</p>
      </div>

      <button
        onClick={onAddNoticeClick}
        className="bg-[#4285F4] hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer self-start md:self-auto"
      >
        <span>+</span> Add Notice
      </button>
    </div>
  )
}
