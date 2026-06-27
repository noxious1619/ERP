import { useState, useEffect } from "react"
import { X, ChevronDown } from "lucide-react"
import axios from "axios"
import { type TimetableBlock } from "./TimetableGrid"

interface EditPeriodModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  block: TimetableBlock | null
  classId: string
  sectionId: string
}

const API_BASE = "http://localhost:5000"

export default function EditPeriodModal({
  isOpen,
  onClose,
  onSuccess,
  block,
  classId,
  sectionId,
}: EditPeriodModalProps) {
  const [isBreak, setIsBreak] = useState(false)
  const [breakLabel, setBreakLabel] = useState("Recess")
  const [subjectId, setSubjectId] = useState("")
  const [teacherId, setTeacherId] = useState("")
  const [room, setRoom] = useState("")
  const [color, setColor] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  const [subjectsList, setSubjectsList] = useState<any[]>([])
  const [teachersList, setTeachersList] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditMode = block ? (block.type === "subject" || block.type === "break") : false

  // Load teachers and subjects when modal opens
  useEffect(() => {
    if (!isOpen || !classId) return

    const fetchDropdownOptions = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers = { Authorization: `Bearer ${token}` }

        const [subjectsRes, teachersRes] = await Promise.all([
          axios.get(`${API_BASE}/api/admin/subjects`, {
            params: { classId },
            headers,
          }),
          axios.get(`${API_BASE}/api/admin/subjects/teachers`, {
            headers,
          }),
        ])

        if (subjectsRes.data.success) {
          setSubjectsList(subjectsRes.data.data)
        }
        if (teachersRes.data.success) {
          setTeachersList(teachersRes.data.data)
        }
      } catch (err) {
        console.error("Failed to load dropdown choices:", err)
      }
    }

    fetchDropdownOptions()
  }, [isOpen, classId])

  // Pre-populate input fields based on block details
  useEffect(() => {
    if (!isOpen || !block) return

    setError(null)
    const times = block.timeRange.split(" - ")
    setStartTime(times[0] || "")
    setEndTime(times[1] || "")

    if (block.type === "subject") {
      setIsBreak(false)
      setSubjectId(block.subjectId || "")
      setTeacherId(block.teacherId || "")
      setRoom(block.room || "")
      setColor(block.color || "")
    } else if (block.type === "break") {
      setIsBreak(true)
      setBreakLabel(block.subject || "Recess")
      setSubjectId("")
      setTeacherId("")
      setRoom("")
      setColor("")
    } else {
      // Assign mode
      setIsBreak(false)
      setBreakLabel("Recess")
      setSubjectId("")
      setTeacherId("")
      setRoom("")
      setColor("")
    }
  }, [isOpen, block])

  if (!isOpen || !block) return null

  // Handle Form Submit (Add / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!startTime.trim() || !endTime.trim()) {
      setError("Start time and End time are required.")
      return
    }

    if (!isBreak && (!subjectId || !teacherId)) {
      setError("Please select both a subject and a teacher for a class period.")
      return
    }

    if (isBreak && !breakLabel.trim()) {
      setError("Please enter a label for the break block.")
      return
    }

    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }

      const payload = {
        day: block.day,
        period: block.periodNumber,
        startTime,
        endTime,
        room: isBreak ? null : room.trim(),
        color: isBreak ? null : color,
        isBreak,
        breakLabel: isBreak ? breakLabel.trim() : null,
        sectionId,
        subjectId: isBreak ? null : subjectId,
        teacherId: isBreak ? null : teacherId,
      }

      if (isEditMode) {
        await axios.patch(`${API_BASE}/api/timetable/${block.id}`, payload, { headers })
      } else {
        await axios.post(`${API_BASE}/api/timetable`, payload, { headers })
      }

      setIsSubmitting(false)
      onSuccess()
    } catch (err: any) {
      setIsSubmitting(false)
      setError(err.response?.data?.message || "Failed to save timetable period.")
    }
  }

  // Handle Removal (Delete)
  const handleRemove = async () => {
    if (!block.id) return
    try {
      setIsDeleting(true)
      setError(null)
      const token = localStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }

      await axios.delete(`${API_BASE}/api/timetable/${block.id}`, { headers })
      
      setIsDeleting(false)
      onSuccess()
    } catch (err: any) {
      setIsDeleting(false)
      setError(err.response?.data?.message || "Failed to remove timetable period.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Overlay background */}
      <div
        className="fixed inset-0 bg-[#0F172A]/35 backdrop-blur-[6px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="bg-[#f8fafd] rounded-3xl border border-gray-100 max-w-lg w-full p-6 relative shadow-2xl flex flex-col gap-5 z-10 transform transition-all duration-300 animate-in fade-in-50 zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition cursor-pointer p-1"
        >
          <X className="h-6 w-6 stroke-[2.5]" />
        </button>

        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-sans">
            {isEditMode ? "Edit Period" : "Schedule Period"}
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-semibold">
            {block.day} — Period {block.periodNumber}
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-4 py-3 rounded-2xl flex items-center gap-2 animate-in fade-in duration-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
            <span className="flex-1 leading-snug">{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Time fields side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Start Time</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="e.g. 08:00"
                className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">End Time</label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="e.g. 08:45"
                className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Block Type Toggle (Break / Class) */}
          <div className="flex items-center gap-3 bg-white border border-gray-200/80 rounded-2xl p-2.5 shadow-sm">
            <span className="text-xs font-bold text-gray-700 flex-1 ml-1.5">Schedule as School Break / Recess?</span>
            <button
              type="button"
              onClick={() => setIsBreak(!isBreak)}
              className={`w-11 h-6 rounded-full transition-colors relative duration-200 focus:outline-none cursor-pointer ${
                isBreak ? "bg-[#4285F4]" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm ${
                  isBreak ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {isBreak ? (
            /* Break details input */
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Break Label</label>
              <input
                type="text"
                value={breakLabel}
                onChange={(e) => setBreakLabel(e.target.value)}
                placeholder="e.g. Short Break, Lunch Break"
                className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
              />
            </div>
          ) : (
            /* Class Block Inputs */
            <>
              {/* Subject Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Subject</label>
                <div className="relative">
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer font-medium"
                  >
                    <option value="">Select Subject</option>
                    {subjectsList.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name} ({sub.code})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Teacher Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Teacher</label>
                <div className="relative">
                  <select
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer font-medium"
                  >
                    <option value="">Select Teacher</option>
                    {teachersList.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Room Text Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Room / Location</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g. Room 402B, Lab 3"
                  className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </>
          )}

          {/* Buttons Action Row */}
          <div className="flex items-center gap-3 mt-3">
            {isEditMode && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={isSubmitting || isDeleting}
                className="border border-rose-500 hover:bg-rose-50 text-rose-600 text-sm font-semibold px-5 py-3 rounded-2xl transition duration-150 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Removing..." : "Remove"}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || isDeleting}
              className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-500 text-sm font-semibold px-5 py-3 rounded-2xl transition duration-150 text-center justify-center flex items-center cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isDeleting}
              className="flex-1 bg-[#4285F4] hover:bg-blue-600 text-white text-sm font-semibold px-5 py-3 rounded-2xl transition duration-150 text-center justify-center flex items-center shadow-md cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
