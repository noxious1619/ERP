import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import type { Notice } from "../../types/notice";
import Navbar from "../../components/Teacher/Dashboard/Navbar";
import NoticeBoardHeader from "../../components/Student/NoticeBoard/NoticeHeader";
import Filters from "../../components/Teacher/Notice/TeacherFilter";
import NoticeCards from "../../components/Student/NoticeBoard/NoticeCards";
import Calendar from "../../components/Student/Dashboard/Calendar";
import RightSidebarHeader from "../../components/Student/NoticeBoard/RightSidebarHeader";
import CreateNoticeModal from "../../components/Teacher/Notice/CreateNoticeModal";

const TeacherNoticeBoard = () => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [allNotices, setAllNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // ── Read ?highlight=<id> from URL ────────────────────────────────────────
  // Set by the dashboard NoticeBoard card when a notice is clicked.
  // Passed down to NoticeCards which scrolls to and flashes that card.
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("highlight");

  const fetchNotices = async (filter: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const params = filter !== "ALL" ? { category: filter } : {};
      const res = await axios.get("http://localhost:5000/api/notices/teacher", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      if (res.data.success) {
        setNotices(res.data.data);
        if (filter === "ALL") setAllNotices(res.data.data);
      } else {
        setError("Failed to fetch notices.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Error connecting to notice server.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices(activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    if (highlightId && activeFilter !== "ALL") {
      setActiveFilter("ALL");
    }
  }, [highlightId, activeFilter]);

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />
      <div className="flex flex-1 h-screen">
        {/* LEFT CONTENT */}
        <div className="flex flex-1 flex-col h-screen">
          <div className="px-14 pt-10 shrink-0 bg-[#F7F7F7]">
            <NoticeBoardHeader />
            <Filters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          <div className="flex-1 overflow-y-auto px-14 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/*
              highlightId is passed from the URL query param.
              NoticeCards will:
              1. Wait 300ms for render to settle
              2. scrollIntoView({ behavior: "smooth", block: "center" }) on the matching card
              3. Show a blue ring for 2.5 seconds then clear it
            */}
            <NoticeCards
              notices={notices}
              allNotices={allNotices}
              isLoading={isLoading}
              error={error}
              highlightId={highlightId}
            />
          </div>
        </div>

        {/* RIGHT SIDEBAR — unchanged */}
        <div className="w-[360px] shrink-0 bg-gray-100 mr-2 ml-2 sticky top-0 h-screen flex flex-col">
          <div className="px-2 py-4 pt-8 shrink-0">
            <RightSidebarHeader profileRoute="/teacher/profile" />
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col gap-6">
              <Calendar variant="timetable" />

              <button
                onClick={() => setShowModal(true)}
                className="w-full flex items-center justify-center gap-3 rounded-3xl bg-[#3A71FF] py-4
                           text-white text-[18px] font-[600] hover:bg-[#2d5fd4] transition-colors
                           shadow-[0px_8px_24px_rgba(58,113,255,0.3)] cursor-pointer"
              >
                Create Notice
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[18px] font-[300]">
                  <span className="flex h-2 w-2 items-center justify-center mb-2 mt-1">
                    +
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <CreateNoticeModal
          existingNotices={allNotices}
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchNotices("ALL")}
        />
      )}
    </div>
  );
};

export default TeacherNoticeBoard;
