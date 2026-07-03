import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Student/Dashboard/Navbar";
import NoticeBoardHeader from "../../components/Student/NoticeBoard/NoticeHeader";
import Filters from "../../components/Student/NoticeBoard/Filter";
import NoticeCards from "../../components/Student/NoticeBoard/NoticeCards";
import Calendar from "../../components/Student/Dashboard/Calendar";
import RightSidebarHeader from "../../components/Student/NoticeBoard/RightSidebarHeader";
import type { Notice } from "../../types/notice";
import { API_BASE_URL } from "../../lib/api";

const NoticeBoard = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [allNotices, setAllNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const params = activeFilter !== "ALL" ? { category: activeFilter } : {};
        const res = await axios.get(`${API_BASE_URL}/api/notices/my`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });
        if (res.data.success) {
          setNotices(res.data.data);
          if (activeFilter === "ALL") {
            setAllNotices(res.data.data);
          }
        } else {
          setError("Failed to fetch notices.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error connecting to notice server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, [activeFilter]);

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />
      <div className="flex flex-1 h-screen">
        {/* LEFT CONTENT */}
        <div className="flex flex-1 flex-col h-screen">
          <div className="px-14 pt-10 shrink-0 bg-[#F7F7F7]">
            <NoticeBoardHeader />
            <Filters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          </div>
          <div className="flex-1 overflow-y-auto px-14 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <NoticeCards
              notices={notices}
              allNotices={allNotices}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
        {/* RIGHT SIDEBAR */}
        <div className="w-[360px] shrink-0 bg-gray-100 mr-2 ml-2 sticky top-0 h-screen flex flex-col">
          <div className="px-2 py-4 pt-8 shrink-0">
            <RightSidebarHeader />
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col gap-6">
              <Calendar />
              {/* <CalendarMessageCard /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;