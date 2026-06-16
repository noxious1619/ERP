import { useState } from "react"
import { X, Upload, Link, Eye } from "lucide-react"

interface CreateNoticeModalProps {
  isOpen: boolean
  onClose: () => void
}

const CATEGORIES = [
  { label: "Announcement", value: "ANNOUNCEMENT" },
  { label: "Academic", value: "ACADEMIC" },
  { label: "Holiday", value: "HOLIDAY" },
  { label: "Exam", value: "EXAM" },
  { label: "Circular", value: "STAFF_CIRCULAR" }
]

const PRIORITIES = [
  { label: "Standard", value: "STANDARD" },
  { label: "High", value: "HIGH" },
  { label: "Urgent", value: "URGENT" }
]

type AudienceType = "ALL_STUDENTS" | "ALL_TEACHERS" | "CLASS" | "SECTION"

export default function CreateNoticeModal({ isOpen, onClose }: CreateNoticeModalProps) {
  const [title, setTitle] = useState("")
  const [audience, setAudience] = useState<AudienceType>("ALL_STUDENTS")
  const [category, setCategory] = useState("ANNOUNCEMENT")
  const [priority, setPriority] = useState("STANDARD")
  const [expiryDate, setExpiryDate] = useState("")
  const [description, setDescription] = useState("")
  const [selectedId, setSelectedId] = useState("")

  if (!isOpen) return null

  const getAudienceLabel = () => {
    if (audience === "ALL_STUDENTS") return "Everyone"
    if (audience === "ALL_TEACHERS") return "All Teachers"
    if (audience === "CLASS") {
      const clsMap: Record<string, string> = {
        "cls-10": "Grade 10",
        "cls-11": "Grade 11",
        "cls-12": "Grade 12",
      }
      return clsMap[selectedId] || "Class"
    }
    if (audience === "SECTION") {
      const secMap: Record<string, string> = {
        "sec-10a": "Grade 10 – Alpha",
        "sec-10b": "Grade 10 – Beta",
        "sec-11a": "Grade 11 – Alpha",
        "sec-12a": "Grade 12 – Omega",
      }
      return secMap[selectedId] || "Section"
    }
    return audience
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop blur */}
      <div 
        className="fixed inset-0 bg-[#0F172A]/35 backdrop-blur-[6px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="bg-white rounded-2xl border border-gray-100 max-w-2xl w-full p-8 relative shadow-2xl flex flex-col gap-6 z-10 max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-in fade-in-50 zoom-in-95 scrollbar-thin">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Notice</h2>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to publish a notice</p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title - Full Width */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Notice Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notice title..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium text-gray-800"
            />
          </div>

          {/* Audience */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Audience <span className="text-red-500">*</span>
            </label>
            <select
              value={audience}
              onChange={(e) => {
                setAudience(e.target.value as AudienceType)
                setSelectedId("")
              }}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium text-gray-700 cursor-pointer bg-white"
            >
              <option value="ALL_STUDENTS">Everyone</option>
              <option value="ALL_TEACHERS">All teachers</option>
              <option value="CLASS">Specific class</option>
              <option value="SECTION">Specific section</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium text-gray-700 cursor-pointer bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Class Selector Dropdown (Conditional) */}
          {audience === "CLASS" && (
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Select Class <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium text-gray-700 cursor-pointer bg-white"
              >
                <option value="">-- Select a class --</option>
                <option value="cls-10">Grade 10</option>
                <option value="cls-11">Grade 11</option>
                <option value="cls-12">Grade 12</option>
              </select>
            </div>
          )}

          {/* Section Selector Dropdown (Conditional) */}
          {audience === "SECTION" && (
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Select Section <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium text-gray-700 cursor-pointer bg-white"
              >
                <option value="">-- Select a section --</option>
                <option value="sec-10a">Grade 10 – Alpha</option>
                <option value="sec-10b">Grade 10 – Beta</option>
                <option value="sec-11a">Grade 11 – Alpha</option>
                <option value="sec-12a">Grade 12 – Omega</option>
              </select>
            </div>
          )}

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium text-gray-700 cursor-pointer"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium text-gray-700 cursor-pointer bg-white"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Notice Description - Full Width */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Notice Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter detailed notice description..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium text-gray-800 resize-none"
            />
          </div>
        </div>

        {/* Attachments Section */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 mb-2">
            <Upload className="h-4 w-4 text-[#3A71FF]" /> Attachments
          </label>
          <div className="border border-dashed border-slate-200 rounded-2xl p-8 bg-[#F8FAFC]/50 text-center flex flex-col items-center justify-center gap-2 hover:border-[#3A71FF] hover:bg-blue-50/[0.01] transition duration-200 cursor-pointer shadow-inner">
            <Upload className="h-10 w-10 text-gray-400 stroke-[1.5]" />
            <p className="text-xs text-gray-400 font-medium">PDFs, Images, Documents, Videos, or Links</p>
            <p className="text-xs font-semibold text-[#3A71FF] mt-1">
              Click to upload <span className="text-gray-400 font-medium">or drag and drop</span>
            </p>
          </div>
        </div>

        {/* Add Link Chain button */}
        <button className="flex items-center gap-1 text-xs font-bold text-[#3A71FF] hover:text-blue-600 transition cursor-pointer self-start">
          <Link className="h-4 w-4" /> Add Link
        </button>

        {/* Live Preview Section */}
        <div className="border-t border-gray-100 pt-5">
          <h3 className="flex items-center gap-1.5 text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
            <Eye className="h-4.5 w-4.5 text-gray-500" /> Preview
          </h3>
          
          {/* Preview notice card - Styled like the mockup image */}
          <div className="border border-slate-200/60 rounded-2xl p-6 bg-[#F8F9FA] flex flex-col gap-3 shadow-xs">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-gray-900 text-lg max-w-[80%] break-words">
                {title || "Notice Title"}
              </h4>
              <span className="bg-[#707275] text-white font-medium text-[11px] px-3 py-1 rounded-full shadow-2xs">
                {PRIORITIES.find(p => p.value === priority)?.label}
              </span>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 text-gray-600 text-[11px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
                {getAudienceLabel()}
              </span>
              <span className="bg-[#3A71FF] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
                {CATEGORIES.find(c => c.value === category)?.label}
              </span>
            </div>

            {/* Description text */}
            <p className="text-sm text-gray-500 leading-relaxed break-words mt-1">
              {description || "Notice description will appear here..."}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button 
            onClick={onClose}
            className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-500 text-sm font-semibold px-5 py-3 rounded-xl transition cursor-pointer text-center justify-center flex items-center"
          >
            Cancel
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-[#3A71FF] hover:bg-blue-600 text-white text-sm font-semibold px-5 py-3 rounded-xl transition shadow-md cursor-pointer text-center justify-center flex items-center"
          >
            Publish Notice
          </button>
        </div>

      </div>
    </div>
  )
}
