import { useState, useEffect, useRef } from "react"
import { X, Eye, ChevronLeft } from "lucide-react"
import axios from "axios"

interface ClassOption {
  id: string
  name: string
  sections: { id: string; name: string }[]
}

interface CreateNoticeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const CATEGORIES = [
  { label: "Announcement", value: "ANNOUNCEMENT" },
  { label: "Academic", value: "ACADEMIC" },
  { label: "Holiday", value: "HOLIDAY" },
  { label: "Exam", value: "EXAM" },
  { label: "School Event", value: "SCHOOL_EVENT" },
  { label: "Staff Circular", value: "STAFF_CIRCULAR" },
]

const PRIORITIES = [
  { label: "Standard", value: "STANDARD" },
  { label: "High", value: "HIGH" },
  { label: "Urgent", value: "URGENT" },
]

type AudienceType = "GLOBAL" | "ALL_STUDENTS" | "ALL_TEACHERS" | "CLASS" | "SECTION"
type View = "form" | "preview"

const PRIORITY_COLORS: Record<string, string> = {
  STANDARD: "bg-gray-100 text-gray-600",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
}

const WORD_LIMIT = 200
const countWords = (text: string) =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length

export default function CreateNoticeModal({ isOpen, onClose, onSuccess }: CreateNoticeModalProps) {
  const [view, setView] = useState<View>("form")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [audience, setAudience] = useState<AudienceType>("ALL_STUDENTS")
  const [category, setCategory] = useState("ANNOUNCEMENT")
  const [priority, setPriority] = useState("STANDARD")
  const [expiresAt, setExpiresAt] = useState("")
  const [selectedId, setSelectedId] = useState("")
  const [selectedClassId, setSelectedClassId] = useState("")

  const [classes, setClasses] = useState<ClassOption[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)

  // Clear selections when audience tab changes
  useEffect(() => {
    setSelectedId("")
    setSelectedClassId("")
  }, [audience])

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  // Fetch real classes + sections for dropdowns
  useEffect(() => {
    if (!isOpen) return
    const token = localStorage.getItem("token")
    axios
      .get("http://localhost:5000/api/admin/notices/classes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => { if (res.data.success) setClasses(res.data.data) })
      .catch(console.error)
  }, [isOpen])

  if (!isOpen) return null

  // ── Helpers ──────────────────────────────────────────────────────────────
  const selectedClass = classes.find((c) => c.id === selectedClassId)
  const sectionsList = selectedClass?.sections ?? []

  const getTarget = () => {
    switch (audience) {
      case "GLOBAL": return { targetType: "GLOBAL", targetId: null }
      case "ALL_STUDENTS": return { targetType: "ROLE", targetId: "STUDENT" }
      case "ALL_TEACHERS": return { targetType: "ROLE", targetId: "TEACHER" }
      case "CLASS": return { targetType: "CLASS", targetId: selectedId }
      case "SECTION": return { targetType: "SECTION", targetId: selectedId }
    }
  }

  const getAudienceLabel = () => {
    switch (audience) {
      case "GLOBAL": return "Everyone (School-wide)"
      case "ALL_STUDENTS": return "All Students"
      case "ALL_TEACHERS": return "All Teachers"
      case "CLASS": {
        const cls = classes.find((c) => c.id === selectedId)
        return cls ? cls.name : "Selected Class"
      }
      case "SECTION": {
        for (const cls of classes) {
          const sec = cls.sections.find((s) => s.id === selectedId)
          if (sec) return `${cls.name} – ${sec.name}`
        }
        return "Selected Section"
      }
    }
  }

  const handlePreview = () => {
    if (!title.trim()) { setFormError("Notice title is required."); return }
    if (!content.trim()) { setFormError("Notice description is required."); return }
    if ((audience === "CLASS" || audience === "SECTION") && !selectedId) {
      setFormError("Please select a class or section.")
      return
    }
    setFormError(null)
    setView("preview")
  }

  const handlePublish = async () => {
    try {
      setSubmitting(true)
      setFormError(null)
      const token = localStorage.getItem("token")
      const { targetType, targetId } = getTarget()
      await axios.post(
        "http://localhost:5000/api/admin/notices",
        { title, content, targetType, targetId, category, priority, expiresAt: expiresAt || undefined },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setSuccessMsg(`Notice published to ${getAudienceLabel()}!`)
      setTimeout(() => {
        onSuccess(); onClose()
        setTitle(""); setContent(""); setAudience("ALL_STUDENTS")
        setCategory("ANNOUNCEMENT"); setPriority("STANDARD")
        setExpiresAt(""); setSelectedId(""); setSelectedClassId(""); setView("form"); setSuccessMsg(null)
      }, 1800)
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to publish notice. Please try again.")
      setView("form")
    } finally {
      setSubmitting(false)
    }
  }

  const priorityClass = PRIORITY_COLORS[priority] ?? PRIORITY_COLORS.STANDARD

  return (
    // Outer backdrop — body scroll already locked via useEffect
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-[6px] p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/*
        ┌─ Modal shell ────────────────────────────────────────────────────────┐
        │  flex flex-col  +  overflow-hidden  →  nothing can leak outside     │
        │  max-h-[90vh]   →  never taller than the screen                     │
        │  The THREE-PART layout:                                              │
        │    1. Header  (shrink-0)                                             │
        │    2. Body    (flex-1 overflow-y-auto)  ← only this scrolls         │
        │    3. Footer  (shrink-0)                                             │
        │  Because the footer is OUTSIDE the scrollable area it can never     │
        │  scroll into grey territory.                                         │
        └──────────────────────────────────────────────────────────────────────┘
      */}
      <div className="bg-white rounded-2xl border border-gray-100 max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* ── 1. HEADER (always visible, never scrolls) ── */}
        <div className="shrink-0 border-b border-gray-100 px-8 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {view === "preview" && (
              <button onClick={() => setView("form")} className="text-gray-400 hover:text-gray-700 transition cursor-pointer">
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {view === "form" ? "Create New Notice" : "Preview Notice"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {view === "form"
                  ? "Fill in the details to publish a notice"
                  : "This is how the notice will appear on the board"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── 2. BODY (scrollable — only this area scrolls, no grey leaks) ── */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* ══ FORM VIEW ══════════════════════════════════════════════════ */}
          {view === "form" && (
            <div className="px-8 py-6 flex flex-col gap-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Notice Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. School Fire Drill Announcement"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800"
                />
              </div>

              {/* Audience + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Audience <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => { setAudience(e.target.value as AudienceType); setSelectedId("") }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 cursor-pointer bg-white"
                  >
                    <option value="GLOBAL">Everyone (School-wide)</option>
                    <option value="ALL_STUDENTS">All Students</option>
                    <option value="ALL_TEACHERS">All Teachers</option>
                    <option value="CLASS">Specific Class</option>
                    <option value="SECTION">Specific Section</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 cursor-pointer bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Class selector */}
              {audience === "CLASS" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Select Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 cursor-pointer bg-white"
                  >
                    <option value="">-- Select a class --</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Section selector (two-step) */}
              {audience === "SECTION" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                      Select Class <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedClassId}
                      onChange={(e) => {
                        setSelectedClassId(e.target.value)
                        setSelectedId("")
                      }}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 cursor-pointer bg-white"
                    >
                      <option value="">-- Class --</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                      Select Section <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedId}
                      onChange={(e) => setSelectedId(e.target.value)}
                      disabled={!selectedClassId || sectionsList.length === 0}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 cursor-pointer bg-white disabled:opacity-50"
                    >
                      <option value="">-- Section --</option>
                      {sectionsList.map((sec) => (
                        <option key={sec.id} value={sec.id}>{sec.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Priority + Expiry */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 cursor-pointer bg-white"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                    Expiry Date <span className="text-xs text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Notice Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => {
                    if (countWords(e.target.value) <= WORD_LIMIT) setContent(e.target.value)
                  }}
                  placeholder="Enter detailed notice description..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800 resize-none"
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-xs ${countWords(content) >= WORD_LIMIT ? "text-red-500" : "text-gray-400"}`}>
                    {countWords(content)} / {WORD_LIMIT} words
                  </span>
                </div>
              </div>

              {/* Attachment zone (commented out for now)
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 mb-2">
                  <Upload className="h-4 w-4 text-[#3A71FF]" /> Attachments
                  <span className="text-xs font-normal text-gray-400">(coming soon)</span>
                </label>
                <div className="border border-dashed border-slate-200 rounded-2xl p-6 bg-[#F8FAFC]/50 text-center flex flex-col items-center justify-center gap-1.5 opacity-60">
                  <Upload className="h-8 w-8 text-gray-300 stroke-[1.5]" />
                  <p className="text-xs text-gray-400">PDFs, Images, Documents</p>
                </div>
              </div>
              */}

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">⚠ {formError}</p>
              )}
            </div>
          )}

          {/* ══ PREVIEW VIEW ════════════════════════════════════════════════ */}
          {view === "preview" && (
            <div className="px-8 py-6 flex flex-col gap-6">
              {/* Preview card */}
              <div className="border border-slate-200/60 rounded-2xl p-6 bg-[#F8F9FA] flex flex-col gap-3 shadow-xs">
                <div className="flex justify-between items-start gap-3">
                  <h4 className="font-bold text-gray-900 text-lg leading-snug max-w-[80%] break-words">{title}</h4>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${priorityClass}`}>
                    {PRIORITIES.find((p) => p.value === priority)?.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 text-gray-600 text-[11px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {getAudienceLabel()}
                  </span>
                  <span className="bg-[#4285F4] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {CATEGORIES.find((c) => c.value === category)?.label}
                  </span>
                  {expiresAt && (
                    <span className="bg-amber-50 text-amber-700 text-[11px] font-semibold px-2.5 py-1 rounded-md">
                      Expires {new Date(expiresAt).toLocaleDateString("en-GB")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed break-words mt-1">{content}</p>
              </div>

              {/* Success state */}
              {successMsg && (
                <div className="flex flex-col items-center justify-center gap-3 py-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-900">{successMsg}</p>
                </div>
              )}

              {formError && !successMsg && (
                <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">⚠ {formError}</p>
              )}
            </div>
          )}
        </div>

        {/* ── 3. FOOTER (always visible, pinned at bottom, never scrolls) ── */}
        <div className="shrink-0 border-t border-gray-100 px-8 py-4 bg-white">
          {view === "form" && (
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-500 text-sm font-semibold px-5 py-3 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePreview}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#4285F4] hover:bg-blue-600 text-white text-sm font-semibold px-5 py-3 rounded-xl transition shadow-sm cursor-pointer"
              >
                <Eye className="h-4 w-4" /> Preview
              </button>
            </div>
          )}

          {view === "preview" && !successMsg && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView("form")}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-500 text-sm font-semibold px-5 py-3 rounded-xl transition cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={handlePublish}
                disabled={submitting}
                className="flex-1 bg-[#4285F4] hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-semibold px-5 py-3 rounded-xl transition shadow-md cursor-pointer"
              >
                {submitting ? "Publishing..." : "Publish Notice"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
