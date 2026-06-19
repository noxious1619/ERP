import { X } from "lucide-react"
import { type TimetableBlock } from "./TimetableGrid"

interface EditPeriodModalProps {
  isOpen: boolean
  onClose: () => void
  block: TimetableBlock | null
}

export default function EditPeriodModal({
  isOpen,
  onClose,
  block
}: EditPeriodModalProps) {
  if (!isOpen || !block) return null

  const displaySubject = block.subject || ""
  const displayTeacher = block.teacher || ""

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Overlay background */}
      <div 
        className="fixed inset-0 bg-[#0F172A]/35 backdrop-blur-[6px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="bg-white rounded-2xl border border-gray-100 max-w-lg w-full p-8 relative shadow-2xl flex flex-col gap-6 z-10 transform transition-all duration-300 animate-in fade-in-50 zoom-in-95">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition cursor-pointer"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Period</h2>
          <p className="text-sm text-gray-500 mt-1">
            {block.day} - Period {block.periodNumber} ({block.timeRange})
          </p>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Subject</label>
            <input
              type="text"
              defaultValue={displaySubject}
              placeholder="e.g. Mathematics"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Teacher</label>
            <input
              type="text"
              defaultValue={displayTeacher}
              placeholder="e.g. Mrs. Priya Sharma"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        {/* Current Assignment Card */}
        {block.type === "subject" && (
          <div className="bg-[#FFF8E6] border border-[#FFE7A3] rounded-xl p-4 flex flex-col gap-0.5">
            <span className="text-amber-600 text-xs font-semibold uppercase tracking-wide">Current Assignment</span>
            <span className="text-gray-900 font-bold text-sm">
              {block.subject} - {block.teacher}
            </span>
          </div>
        )}

        {/* Buttons Action Row */}
        <div className="flex items-center gap-3 mt-2">
          {block.type === "subject" && (
            <button 
              onClick={onClose}
              className="border border-red-500 hover:bg-red-50 text-red-600 text-sm font-semibold px-5 py-3 rounded-xl transition duration-150 cursor-pointer"
            >
              Remove
            </button>
          )}

          <button 
            onClick={onClose}
            className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-500 text-sm font-semibold px-5 py-3 rounded-xl transition duration-150 text-center justify-center flex items-center cursor-pointer"
          >
            Cancel
          </button>

          <button 
            onClick={onClose}
            className="flex-1 bg-[#4285F4] hover:bg-blue-600 text-white text-sm font-semibold px-5 py-3 rounded-xl transition duration-150 text-center justify-center flex items-center shadow-md cursor-pointer"
          >
            Update
          </button>
        </div>

      </div>
    </div>
  )
}
