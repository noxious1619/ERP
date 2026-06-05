import { useState, useRef, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Upload,
  FileText,
  Trash2,
} from "lucide-react";

export interface HomeworkTask {
  id: number;
  title: string;
  subject: string;
  status: "OVERDUE" | "DUE TODAY" | "DUE TOMORROW" | "PENDING";
  dueDate: string;
  dueTime: string;
  givenBy: string;
  description: string;
  teacherImages?: string[];
  attachments: string;   // e.g., "1 attachment"
  statusClass: string;
}

interface UploadedFile {
  id: string;
  file: File;
  previewUrl: string | null;
  isPdf: boolean;
}

interface ViewDetailSidebarProps {
  task: HomeworkTask | null;
  onClose: () => void;
  isTeacherView?: boolean;
}

const STATUS_STYLES: Record<HomeworkTask["status"], string> = {
  OVERDUE: "bg-rose-100 text-[#A8364B]",
  "DUE TODAY": "bg-pink-100 text-[#7C5270]",
  "DUE TOMORROW": "bg-gray-200 text-zinc-600",
  PENDING: "bg-blue-100 text-blue-700",
};

function extractMonth(dateStr: string): string {
  return (dateStr.split(" ")[1] ?? "").toUpperCase().slice(0, 3);
}
function extractDay(dateStr: string): string {
  return dateStr.split(" ").pop() ?? "";
}
function extractDayName(dateStr: string): string {
  return dateStr.split(",")[0] ?? "";
}

const ViewDetailSidebar = ({
  task,
  onClose,
  isTeacherView = false,
}: ViewDetailSidebarProps) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [visible, setVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task) {
      setImgIndex(0);
      setExpanded(false);
      setUploads([]);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [task?.id]);

  if (!task) return null;

  const images = task.teacherImages ?? [];
  const hasImages = images.length > 0;

  const prevImg = () =>
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIndex((i) => (i + 1) % images.length);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next: UploadedFile[] = Array.from(files).map((file) => {
      const isPdf = file.type === "application/pdf";
      const previewUrl =
        !isPdf && file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null;
      return { id: crypto.randomUUID(), file, previewUrl, isPdf };
    });
    setUploads((prev) => [...prev, ...next]);
  };

  const removeUpload = (id: string) => {
    setUploads((prev) => {
      const entry = prev.find((u) => u.id === id);
      if (entry?.previewUrl) URL.revokeObjectURL(entry.previewUrl);
      return prev.filter((u) => u.id !== id);
    });
  };

  const openFilePicker = () => fileInputRef.current?.click();
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const words = task.description.split(" ");
  const isLong = words.length > 30;
  const dispDesc =
    expanded || !isLong
      ? task.description
      : words.slice(0, 30).join(" ") + "...";

  const initial = task.givenBy
    .replace(/^(Miss|Mr|Mrs|Dr)\.?\s*/i, "")
    .charAt(0)
    .toUpperCase();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/25 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 z-50 h-screen w-[520px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out"
        style={{ transform: visible ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-1 shrink-0">
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
          >
            <X size={16} />
          </button>
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-wide ${STATUS_STYLES[task.status]}`}
          >
            {task.status}
          </span>
        </div>

        {/* Title */}
        <h2 className="px-5 pt-2 pb-4 text-[17px] font-bold text-gray-800 leading-snug shrink-0">
          {task.title}
        </h2>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-6">
            {/* Image carousel / empty state */}
            <div className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              {hasImages ? (
                <div className="relative select-none">
                  <img
                    src={images[imgIndex]}
                    alt={`Reference ${imgIndex + 1}`}
                    className="w-full h-[200px] object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImg}
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-white/85 shadow-md hover:bg-white transition"
                      >
                        <ChevronLeft size={17} className="text-gray-700" />
                      </button>
                      <button
                        onClick={nextImg}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-white/85 shadow-md hover:bg-white transition"
                      >
                        <ChevronRight size={17} className="text-gray-700" />
                      </button>
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setImgIndex(i)}
                            className={`h-1.5 rounded-full transition-all duration-200 ${i === imgIndex ? "w-5 bg-white" : "w-1.5 bg-white/55"}`}
                          />
                        ))}
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-black/40 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                        {imgIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[170px] gap-3 px-6">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-xl bg-gray-200 rotate-[-8deg]" />
                    <div className="absolute inset-0 rounded-xl bg-gray-100 rotate-[-3deg]" />
                    <div className="absolute inset-0 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#CBD5E1"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="7" />
                        <line x1="16.5" y1="16.5" x2="22" y2="22" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[13px] text-gray-400 text-center leading-snug">
                    No reference images uploaded
                    <br />
                    by the teacher
                  </p>
                </div>
              )}
            </div>

            {/* Date + Teacher */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center rounded-[10px] border border-gray-200 overflow-hidden w-[42px] shadow-sm">
                  <div className="w-full bg-[#4285F4] text-white text-[9px] font-bold text-center py-[3px] tracking-widest">
                    {extractMonth(task.dueDate)}
                  </div>
                  <div className="text-[17px] font-extrabold text-gray-800 leading-none py-[5px]">
                    {extractDay(task.dueDate)}
                  </div>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-800">
                    {extractDayName(task.dueDate) +
                      ", " +
                      extractMonth(task.dueDate).charAt(0) +
                      extractMonth(task.dueDate).slice(1).toLowerCase() +
                      " " +
                      extractDay(task.dueDate)}
                  </p>
                  <p className="text-[12px] text-gray-500 mt-0.5">
                    {task.dueTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-[#4F52A3]/15 text-[#4F52A3] flex items-center justify-center text-[11px] font-bold">
                  {initial}
                </div>
                <p className="text-[12px] text-gray-500 leading-snug">
                  Given by{" "}
                  <span className="font-semibold text-gray-800">
                    {task.givenBy}
                  </span>
                </p>
              </div>
            </div>

            {/* Description — always shown */}
            <div className="rounded-2xl bg-[#F5F8FF] p-4">
              <h3 className="text-[12px] font-bold text-[#4F52A3] uppercase tracking-widest mb-2">
                Description
              </h3>
              <p className="text-[13px] text-gray-700 leading-relaxed">
                {dispDesc}
                {isLong && (
                  <button
                    onClick={() => setExpanded((e) => !e)}
                    className="ml-1 text-[#4F52A3] font-semibold hover:underline"
                  >
                    {expanded ? "Show less" : "Read more"}
                  </button>
                )}
              </p>
            </div>

            {/* Attachment — student only */}
            {!isTeacherView && (
              <div className="rounded-2xl bg-[#F5F8FF] p-4">
                <h3 className="text-[12px] font-bold text-[#4F52A3] uppercase tracking-widest mb-3">
                  Attachment
                </h3>
                {uploads.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {uploads.map((u) => (
                      <div
                        key={u.id}
                        className="relative group h-[70px] w-[70px] rounded-xl overflow-hidden border-2 border-white shadow-sm"
                      >
                        {u.previewUrl ? (
                          <img
                            src={u.previewUrl}
                            alt={u.file.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center bg-red-50 gap-1">
                            <FileText size={22} className="text-red-400" />
                            <span className="text-[9px] font-bold text-red-400 uppercase">
                              PDF
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => removeUpload(u.id)}
                          className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 group-hover:opacity-100 transition duration-150"
                          title="Remove"
                        >
                          <Trash2 size={15} className="text-white" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={openFilePicker}
                      className="h-[70px] w-[70px] rounded-xl border-2 border-dashed border-[#4F52A3]/30 bg-white/60 flex items-center justify-center hover:border-[#4F52A3]/60 hover:bg-white transition text-[#4F52A3]/50"
                    >
                      <span className="text-2xl leading-none font-light">
                        +
                      </span>
                    </button>
                  </div>
                )}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={openFilePicker}
                  className={`cursor-pointer rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-6 gap-2 transition ${
                    isDragging
                      ? "border-[#4F52A3] bg-[#4F52A3]/10 scale-[0.99]"
                      : "border-[#4F52A3]/25 bg-white/50 hover:border-[#4F52A3]/50 hover:bg-white/80"
                  }`}
                >
                  <div className="h-9 w-9 rounded-full bg-[#4F52A3]/10 flex items-center justify-center">
                    <Upload size={16} className="text-[#4F52A3]" />
                  </div>
                  <p className="text-[12px] text-gray-500 text-center leading-snug px-3">
                    {isDragging ? (
                      "Drop files here"
                    ) : (
                      <>
                        Drag & drop or{" "}
                        <span className="text-[#4F52A3] font-semibold">
                          browse
                        </span>
                      </>
                    )}
                  </p>
                  <p className="text-[11px] text-gray-400">Images · PDF</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom button */}
        <div className="px-5 pt-3 pb-6 shrink-0 border-t border-gray-100">
          {isTeacherView ? (
            <button className="w-full rounded-2xl py-3.5 bg-[#4285F4] text-white font-semibold text-[14px] tracking-wide hover:bg-[#3f4290] active:scale-[0.98] transition shadow">
              EDIT
            </button>
          ) : (
            <button
              onClick={openFilePicker}
              className="w-full rounded-2xl py-3.5 bg-[#4285F4] text-white font-semibold text-[14px] tracking-wide hover:bg-[#3f4290] active:scale-[0.98] transition shadow flex items-center justify-center gap-2"
            >
              <Upload size={15} />
              {uploads.length > 0
                ? `${uploads.length} file${uploads.length > 1 ? "s" : ""} selected - Upload`
                : "UPLOAD"}
            </button>
          )}
        </div>
      </div>
      {/* end drawer */}
    </>
  );
};

export default ViewDetailSidebar;
