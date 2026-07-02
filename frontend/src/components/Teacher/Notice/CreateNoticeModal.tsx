import { useEffect, useState } from "react";
import axios from "axios";
import noticeIconBlue from "../../../assets/Student/NoticeBoard/blue.svg";
import noticeIconPink from "../../../assets/Student/NoticeBoard/pink.svg";
import noticeIconPurple from "../../../assets/Student/NoticeBoard/purple.svg";
import type { Notice } from "../../../types/notice";

interface Section {
  id: string;
  name: string;
  academicClass: { id: string; name: string };
}

interface CreateNoticeModalProps {
  existingNotices: Notice[];
  onClose: () => void;
  onSuccess: () => void;
}

const CARD_STYLES = [
  { bg: "bg-indigo-50/50", iconBg: "bg-indigo-200/50", icon: noticeIconBlue },
  { bg: "bg-pink-100/50", iconBg: "bg-rose-300/20", icon: noticeIconPink },
  { bg: "bg-violet-50", iconBg: "bg-violet-400/20", icon: noticeIconPurple },
];

const CATEGORIES = [
  { label: "Announcement", value: "ANNOUNCEMENT" },
  { label: "Academic", value: "ACADEMIC" },
  { label: "Holiday", value: "HOLIDAY" },
  { label: "Exam", value: "EXAM" },
  { label: "School event", value: "SCHOOL_EVENT" },
  { label: "Staff Circular", value: "STAFF_CIRCULAR", disabled: true },
];

const PRIORITIES = [
  { label: "Standard", value: "STANDARD" },
  { label: "High", value: "HIGH" },
  { label: "Urgent", value: "URGENT" },
];

const countWords = (text: string) =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

const WORD_LIMIT = 175;

type AudienceType = "ALL_STUDENTS" | "ALL_TEACHERS" | "CLASS" | "SECTION";

const CreateNoticeModal = ({
  existingNotices,
  onClose,
  onSuccess,
}: CreateNoticeModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState<AudienceType>("ALL_STUDENTS");
  const [category, setCategory] = useState("ANNOUNCEMENT");
  const [priority, setPriority] = useState("STANDARD");
  const [expiresAt, setExpiresAt] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const [view, setView] = useState<"form" | "preview">("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/teachers/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const assignments = res.data.data.teachingAssignments || [];
          const uniqueSections: Section[] = Array.from(
            new Map(
              assignments.map((a: any) => [a.section.id, a.section as Section]),
            ).values(),
          ) as Section[];
          setSections(uniqueSections);
        }
      } catch (err) {
        console.error("Failed to fetch teacher profile", err);
      }
    };
    fetchProfile();
  }, []);

  const uniqueClasses = Array.from(
    new Map(
      sections.map((s) => [s.academicClass.id, s.academicClass]),
    ).values(),
  );

  const getTarget = () => {
    switch (audience) {
      case "ALL_STUDENTS":
        return { targetType: "ROLE", targetId: "STUDENT" };
      case "ALL_TEACHERS":
        return { targetType: "ROLE", targetId: "TEACHER" };
      case "CLASS":
        return { targetType: "CLASS", targetId: selectedId };
      case "SECTION":
        return { targetType: "SECTION", targetId: selectedId };
    }
  };

  const getAudienceLabel = () => {
    switch (audience) {
      case "ALL_STUDENTS":
        return "All Students";
      case "ALL_TEACHERS":
        return "All Teachers";
      case "CLASS":
        return (
          uniqueClasses.find((c) => c.id === selectedId)?.name ||
          "Selected Class"
        );
      case "SECTION": {
        const sec = sections.find((s) => s.id === selectedId);
        return sec
          ? `${sec.academicClass.name} – ${sec.name}`
          : "Selected Section";
      }
    }
  };

  const previewStyle = CARD_STYLES[0];

  const handlePreview = () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and description are required.");
      return;
    }
    if ((audience === "CLASS" || audience === "SECTION") && !selectedId) {
      setError("Please select a class or section.");
      return;
    }
    if (expiresAt && expiresAt < new Date().toISOString().split("T")[0]) {
      setError("Expiry date cannot be in the past.");
      return;
    }
    setError(null);
    setView("preview");
  };

  const handleSend = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem("token");
      const { targetType, targetId } = getTarget();

      await axios.post(
        "http://localhost:5000/api/notices",
        {
          title,
          content,
          targetType,
          targetId,
          category,
          priority,
          expiresAt: expiresAt || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSuccessMessage(`Notice sent to ${getAudienceLabel()}`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to publish notice.");
      setView("form");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-xl mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-white px-8 pt-8 pb-4 border-b border-gray-100 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[22px] font-[700] text-[#111111]">
                {view === "form" ? "Create new notice" : "Preview notice"}
              </h2>
              <p className="text-[13px] text-[#888888] mt-1">
                {view === "form"
                  ? "Fill in the details to publish a notice"
                  : "This is how your notice will appear on the board"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── FORM VIEW ── */}
        {view === "form" && (
          <div className="px-8 py-6 flex flex-col gap-5">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-[500] text-[#444444]">
                Notice title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. School Fire Drill Announcement"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] text-[#111111] placeholder:text-gray-300 outline-none focus:border-[#3A71FF] transition-colors"
              />
            </div>

            {/* Audience + Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-[500] text-[#444444]">
                  Audience <span className="text-red-500">*</span>
                </label>
                <select
                  value={audience}
                  onChange={(e) => {
                    setAudience(e.target.value as AudienceType);
                    setSelectedId("");
                  }}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] text-[#111111] outline-none focus:border-[#3A71FF] transition-colors bg-white"
                >
                  <option value="ALL_STUDENTS">All students</option>
                  <option value="ALL_TEACHERS">All teachers</option>
                  <option value="CLASS">Specific class</option>
                  <option value="SECTION">Specific section</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-[500] text-[#444444]">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] text-[#111111] outline-none focus:border-[#3A71FF] transition-colors bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value} disabled={c.disabled}>
                      {c.label}
                      {c.disabled ? " (admin only)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dependent — class */}
            {audience === "CLASS" && (
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-[500] text-[#444444]">
                  Select class <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] text-[#111111] outline-none focus:border-[#3A71FF] transition-colors bg-white"
                >
                  <option value="">-- Select a class --</option>
                  {uniqueClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Dependent — section */}
            {audience === "SECTION" && (
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-[500] text-[#444444]">
                  Select section <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] text-[#111111] outline-none focus:border-[#3A71FF] transition-colors bg-white"
                >
                  <option value="">-- Select a section --</option>
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.academicClass.name} – {sec.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Priority + Expiry */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-[500] text-[#444444]">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] text-[#111111] outline-none focus:border-[#3A71FF] transition-colors bg-white"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-[500] text-[#444444]">
                  Expires on
                  <span className="ml-1 text-[11px] text-gray-400">
                    (optional)
                  </span>
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-[500] text-[#444444]">
                Notice description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => {
                  const words =
                    e.target.value.trim() === ""
                      ? []
                      : e.target.value.trim().split(/\s+/);
                  if (words.length <= WORD_LIMIT) {
                    setContent(e.target.value);
                  }
                }}
                placeholder="Enter detailed notice description..."
                rows={4}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[14px] text-[#111111] placeholder:text-gray-300 outline-none focus:border-[#3A71FF] transition-colors resize-none"
              />
              <div className="flex justify-end">
                <span
                  className={`text-[12px] ${countWords(content) >= WORD_LIMIT ? "text-red-500" : "text-gray-400"}`}
                >
                  {countWords(content)} / {WORD_LIMIT} words
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[13px] text-red-500 bg-red-50 px-4 py-3 rounded-xl">
                ⚠️ {error}
              </p>
            )}

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-[14px] text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handlePreview}
                className="px-6 py-2.5 rounded-xl bg-[#3A71FF] text-white text-[14px] font-[500] hover:bg-[#2d5fd4] transition-colors"
              >
                Preview
              </button>
            </div>
          </div>
        )}

        {/* ── PREVIEW VIEW ── */}
        {view === "preview" && (
          <div className="px-8 py-6 flex flex-col gap-6">
            {/* Notice card */}
            <div
              className={`${previewStyle.bg} flex items-center gap-10 rounded-3xl px-10 py-9 shadow-[0px_10px_50px_0px_rgba(0,0,0,0.10)]`}
            >
              <div
                className={`${previewStyle.iconBg} flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-full`}
              >
                <img
                  src={previewStyle.icon}
                  alt="notice"
                  className="h-[44px] w-[44px]"
                />
              </div>
              <div>
                <h2 className="text-[20px] font-[700] text-[#111111]">
                  {title}
                </h2>
                <p className="mt-3 max-w-[380px] text-[15px] leading-[24px] text-[#333333]">
                  {content}
                </p>
              </div>
            </div>

            {/* Meta tags */}
            <div className="flex flex-wrap gap-2 px-1">
              {[
                getAudienceLabel(),
                CATEGORIES.find((c) => c.value === category)?.label,
                PRIORITIES.find((p) => p.value === priority)?.label,
                expiresAt
                  ? `Expires: ${new Date(expiresAt).toLocaleDateString("en-GB")}`
                  : "No expiry",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[12px] font-[500]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Success state */}
            {successMessage ? (
              <div className="flex flex-col items-center justify-center gap-4 py-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-7 w-7 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-[16px] font-[600] text-[#111111]">
                    Notice published!
                  </p>
                  <p className="mt-1 text-[14px] text-[#888888]">
                    {successMessage}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {error && (
                  <p className="text-[13px] text-red-500 bg-red-50 px-4 py-3 rounded-xl">
                    ⚠️ {error}
                  </p>
                )}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setView("form")}
                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-[14px] text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-[#3A71FF] text-white text-[14px] font-[500] hover:bg-[#2d5fd4] transition-colors disabled:opacity-60"
                  >
                    {submitting ? "Publishing..." : "Send notice"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateNoticeModal;
