import { useState, useEffect, useRef } from "react"
import { X, ChevronDown } from "lucide-react"
import axios from "axios"
import { type TimetableBlock } from "./TimetableGrid"
import { API_BASE_URL } from "../../../../lib/api";

interface EditPeriodModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  block: TimetableBlock | null
  classId: string
  sectionId: string
}

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
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Custom Subject dropdown open/close state
  const [isSubjectOpen, setIsSubjectOpen] = useState(false)
  const subjectDropdownRef = useRef<HTMLDivElement>(null)

  const isEditMode = block ? (block.type === "subject" || block.type === "break") : false

  // Close subject dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(e.target as Node)) {
        setIsSubjectOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Load subjects when modal opens
  useEffect(() => {
    if (!isOpen || !classId) return

    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers = { Authorization: `Bearer ${token}` }

        const subjectsRes = await axios.get(`${API_BASE_URL}/api/admin/subjects`, {
          params: { classId },
          headers,
        })

        if (subjectsRes.data.success) {
          setSubjectsList(subjectsRes.data.data)
        }
      } catch (err) {
        console.error("Failed to load subjects:", err)
      }
    }

    fetchSubjects()
  }, [isOpen, classId])

  // Load teachers whenever the selected subject changes (filtered to that subject)
  useEffect(() => {
    if (!isOpen || !subjectId) {
      setTeachersList([])
      return
    }

    const fetchTeachersForSubject = async () => {
      try {
        setIsLoadingTeachers(true)
        const token = localStorage.getItem("token")
        const headers = { Authorization: `Bearer ${token}` }

        const teachersRes = await axios.get(`${API_BASE_URL}/api/admin/subjects/teachers`, {
          params: { subjectId, sectionId },
          headers,
        })

        if (teachersRes.data.success) {
          setTeachersList(teachersRes.data.data)
        }
      } catch (err) {
        console.error("Failed to load teachers for subject:", err)
      } finally {
        setIsLoadingTeachers(false)
      }
    }

    fetchTeachersForSubject()
  }, [isOpen, subjectId, sectionId])

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

  const selectedSubject = subjectsList.find((s) => s.id === subjectId)

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
        await axios.patch(`${API_BASE_URL}/api/timetable/${block.id}`, payload, { headers })
      } else {
        await axios.post(`${API_BASE_URL}/api/timetable`, payload, { headers })
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

      await axios.delete(`${API_BASE_URL}/api/timetable/${block.id}`, { headers })

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
              {/* Subject Select — custom dropdown with internal scrollbar */}
              <div className="flex flex-col gap-1.5" ref={subjectDropdownRef}>
                <label className="text-xs font-semibold text-gray-700">Subject</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSubjectOpen((prev) => !prev)}
                    className={`w-full flex items-center justify-between rounded-2xl border bg-white px-4 py-3 text-sm text-left text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium cursor-pointer ${
                      isSubjectOpen ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200/80"
                    }`}
                  >
                    <span className={selectedSubject ? "text-gray-800" : "text-gray-400"}>
                      {selectedSubject ? `${selectedSubject.name} (${selectedSubject.code})` : "Select Subject"}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                        isSubjectOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isSubjectOpen && (
                    <div className="absolute z-20 mt-1.5 w-full rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                      <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        <button
                          type="button"
                          onClick={() => {
                            setSubjectId("")
                            setTeacherId("")
                            setIsSubjectOpen(false)
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-50 cursor-pointer"
                        >
                          Select Subject
                        </button>
                        {subjectsList.map((sub) => (
                          <button
                            type="button"
                            key={sub.id}
                            onClick={() => {
                              setSubjectId(sub.id)
                              setTeacherId("")
                              setIsSubjectOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                              subjectId === sub.id
                                ? "bg-[#4285F4] text-white"
                                : "text-gray-800 hover:bg-gray-50"
                            }`}
                          >
                            {sub.name} ({sub.code})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Teacher Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Teacher</label>
                <div className="relative">
                  <select
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    disabled={!subjectId || isLoadingTeachers}
                    className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {!subjectId
                        ? "Select a subject first"
                        : isLoadingTeachers
                        ? "Loading teachers..."
                        : teachersList.length === 0
                        ? "No teachers assigned to this subject"
                        : "Select Teacher"}
                    </option>
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