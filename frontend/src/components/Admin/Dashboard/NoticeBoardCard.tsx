import { useNavigate } from "react-router-dom"
import { Pin, Plus } from "lucide-react"

interface NoticeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

interface NoticeBoardCardProps {
  notices?: NoticeItem[];
}

const getRelativeTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (err) {
    return "Recently";
  }
};

const getCategoryStyles = (category: string) => {
  switch (category?.toUpperCase()) {
    case "HOLIDAY":
      return "bg-orange-50 text-orange-500";
    case "ACADEMIC":
      return "bg-green-50 text-green-500";
    case "EXAM":
      return "bg-red-50 text-red-500";
    case "SCHOOL_EVENT":
      return "bg-purple-50 text-purple-500";
    case "STAFF_CIRCULAR":
      return "bg-teal-50 text-teal-500";
    default:
      return "bg-blue-50 text-blue-500";
  }
};

export default function NoticeBoardCard({ notices = [] }: NoticeBoardCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 flex-1">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900 font-sans">Notice Board</h3>
          <p className="text-sm text-gray-500 mt-0.5">School & class announcements</p>
        </div>
        <button 
          onClick={() => navigate("/admin/communication/notices")}
          className="bg-[#4285F4] hover:bg-blue-600 text-white rounded-full p-2.5 flex items-center justify-center shadow-sm transition cursor-pointer"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Notices List */}
      <div className="flex flex-col gap-4 flex-1">
        {notices.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400 font-semibold border border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50/20 flex-1">
            No notices available
          </div>
        ) : (
          notices.map((notice) => (
            <div key={notice.id} className="bg-gray-50/30 border border-gray-100 rounded-2xl p-5 flex items-start gap-4 hover:shadow-xs transition duration-200">
              <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 ${getCategoryStyles(notice.category)}`}>
                <Pin className="h-5 w-5 rotate-45" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm truncate">{notice.title}</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{notice.content}</p>
                <span className="text-[10px] text-gray-400 font-semibold tracking-wider block mt-2.5 uppercase">
                  {getRelativeTime(notice.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
