import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AdminSidebar from "../../../components/Admin/sidebar";
import AdminNavbar from "../../../components/Admin/Navbar";
import NoticesHeader from "../../../components/Admin/Communication/Notices/NoticesHeader";
import NoticesTabs from "../../../components/Admin/Communication/Notices/NoticesTabs";
import NoticesTimeline from "../../../components/Admin/Communication/Notices/NoticesTimeline";
import Calendar from "../../../components/Student/Dashboard/Calendar";
import CreateNoticeModal from "../../../components/Admin/Communication/Notices/CreateNoticeModal";
import ConfirmDeleteModal from "../../../components/Admin/Communication/Notices/ConfirmDeleteModal";
import type { Notice } from "../../../types/notice";
import { API_BASE_URL } from "../../../lib/api";

export default function Notices() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedDate] = useState<Date | null>(null);

  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Custom Confirmation Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch notices from admin API ─────────────────────────────────────────
  const fetchNotices = useCallback(async (category: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const params = category !== "ALL" ? { category } : {};
      const res = await axios.get(`${API_BASE_URL}/api/admin/notices`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      if (res.data.success) {
        setNotices(res.data.data);
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
  }, []);

  useEffect(() => {
    fetchNotices(activeTab);
  }, [activeTab, fetchNotices]);

  // ── Trigger delete confirmation modal ────────────────────────────────────
  const handleDelete = (id: string) => {
    const notice = notices.find((n) => n.id === id);
    if (notice) {
      setNoticeToDelete(notice);
      setIsDeleteModalOpen(true);
    }
  };

  // ── Confirm delete notice ────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!noticeToDelete) return;
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/admin/notices/${noticeToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update local state immediately
      setNotices((prev) => prev.filter((n) => n.id !== noticeToDelete.id));
      setIsDeleteModalOpen(false);
      setNoticeToDelete(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete notice.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 flex flex-col overflow-hidden p-6 pb-0">
          <div className="flex flex-col max-w-7xl mx-auto w-full h-full overflow-hidden">
            {/* ── Static section: Header + Tabs (never scrolls) ── */}
            <div className="shrink-0 flex flex-col gap-6">
              <NoticesHeader onAddNoticeClick={() => setIsModalOpen(true)} />
              <NoticesTabs
                activeFilter={activeTab}
                onFilterChange={setActiveTab}
              />
            </div>

            {/* ── Scrollable section: Timeline + Calendar ── */}
            <div
              className={`flex-1 mt-2 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isModalOpen || isDeleteModalOpen ? "overflow-hidden" : "overflow-y-auto"}`}
            >
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <NoticesTimeline
                  notices={notices}
                  isLoading={isLoading}
                  error={error}
                  selectedDate={selectedDate}
                  onDelete={handleDelete}
                />
                <div className="shrink-0 w-full lg:max-w-[320px]">
                  <Calendar variant="timetable" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Notice Modal */}
      <CreateNoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchNotices(activeTab)}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setNoticeToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title={noticeToDelete?.title || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}
