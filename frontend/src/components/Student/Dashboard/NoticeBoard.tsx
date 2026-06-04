import React from "react";

// 1. Define the shape of your backend notice data
export interface Notice {
  id: string;
  title: string;
  content: string; // The backend uses 'content' instead of 'description'
  priority?: string;
  category?: string;
}

interface NoticeBoardProps {
  notices: Notice[];
  loading?: boolean;
}

// 2. Helper to color-code notices based on priority and category
const getNoticeStyle = (priority: string = "STANDARD", category: string = "ANNOUNCEMENT") => {
  if (priority.toUpperCase() === "URGENT") {
    return { dot: "bg-red-500", box: "bg-red-500/5" };
  }
  
  switch (category.toUpperCase()) {
    case "ACADEMIC":
      return { dot: "bg-emerald-500", box: "bg-emerald-500/5" };
    case "EXAM":
      return { dot: "bg-purple-500", box: "bg-purple-500/5" };
    case "HOLIDAY":
      return { dot: "bg-amber-500", box: "bg-amber-500/5" };
    default: // ANNOUNCEMENT & SCHOOL_EVENT
      return { dot: "bg-[#2E83F5]", box: "bg-blue-600/5" };
  }
};

const NoticeBoard: React.FC<NoticeBoardProps> = ({ notices = [], loading }) => {
  return (
    <div className="w-full rounded-3xl bg-white py-5 px-5 shadow-[0px_15px_25px_10px_rgba(0,0,0,0.08)]">
      
      {/* Header */}
      <div className="flex items-center">
        <h2 className="text-[20px] mx-auto font-bold text-black pt-2 pb-4">Notice Board</h2>
      </div>

      {/* Notice List Container - Fixed height to match Homework perfectly! */}
      <div className="mt-2 flex flex-col gap-3 overflow-y-auto h-[240px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-1">
        
        {loading ? (
          <div className="text-sm text-gray-500 text-center mt-6">Loading notices...</div>
        ) : notices.length > 0 ? (
          notices.map((notice) => {
            const styles = getNoticeStyle(notice.priority, notice.category);
            
            return (
              <div
                key={notice.id}
                className={`flex shrink-0 items-start gap-4 rounded-xl px-6 py-4 ${styles.box}`}
              >
                {/* Dot */}
                <div className={`h-[10px] w-[10px] shrink-0 rounded-full mt-1.5 ${styles.dot}`} />
                
                {/* Text Content */}
                <div className="flex flex-col min-w-0">
                  <h3 className="text-[14px] font-semibold leading-tight text-[#2D2D2D] truncate">
                    {notice.title}
                  </h3>
                  <p className="mt-1 text-[10px] leading-[14px] text-[#8A8A8A] line-clamp-2">
                    {notice.content}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-gray-500 text-center mt-6">
            No active notices.
          </div>
        )}

      </div>
    </div>
  );
};

export default NoticeBoard;