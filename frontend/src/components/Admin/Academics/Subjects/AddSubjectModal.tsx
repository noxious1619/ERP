import { useState, useEffect, useRef } from "react"
import { X, ChevronDown } from "lucide-react"
import axios from "axios"

interface AddSubjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  classes: any[]
  subjectToEdit?: any | null
}

export default function AddSubjectModal({
  isOpen,
  onClose,
  onSuccess,
  classes,
  subjectToEdit = null,
}: AddSubjectModalProps) {
  const [subjectName, setSubjectName] = useState("")
  const [subjectCode, setSubjectCode] = useState("")
  const [classVal, setClassVal] = useState("")
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [subjectType, setSubjectType] = useState<"Theory" | "Lab">("Theory")

  // Dynamic Options
  const [sectionsList, setSectionsList] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const isEditMode = !!subjectToEdit

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Fetch sections and prepopulate details on open
  useEffect(() => {
    if (!isOpen) return

    const fetchSections = async (classId: string) => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`http://localhost:5000/api/admin/subjects/classes/${classId}/sections`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data.success) {
          setSectionsList(res.data.data)
        }
      } catch (err) {
        console.error("Error fetching sections:", err)
      }
    }

    const fetchSubjectDetails = async (id: string) => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`http://localhost:5000/api/admin/subjects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data.success) {
          const detail = res.data.data
          setSubjectName(detail.name)
          setSubjectCode(detail.code)
          setSubjectType(detail.type)
          setClassVal(detail.classId)
          setSelectedSections(detail.sectionIds || [])
          if (detail.classId) {
            fetchSections(detail.classId)
          }
        }
      } catch (err) {
        console.error("Error fetching subject details:", err)
      }
    }

    setError(null)

    if (isEditMode && subjectToEdit) {
      fetchSubjectDetails(subjectToEdit.id)
    } else {
      setSubjectName("")
      setSubjectCode("")
      setSubjectType("Theory")
      setClassVal("")
      setSelectedSections([])
      setSectionsList([])
    }
  }, [isOpen, isEditMode, subjectToEdit])

  // Handle class selection change
  const handleClassChange = async (newClassId: string) => {
    setClassVal(newClassId)
    setSelectedSections([])
    setError(null)
    if (!newClassId) {
      setSectionsList([])
      return
    }
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`http://localhost:5000/api/admin/subjects/classes/${newClassId}/sections`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.data.success) {
        setSectionsList(res.data.data)
      }
    } catch (err) {
      console.error("Error fetching sections for class:", err)
    }
  }

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!subjectName.trim() || !subjectCode.trim() || !classVal || selectedSections.length === 0) {
      setError("All fields are required. Please select a class and at least one section.")
      return
    }

    try {
      setIsSubmitting(true)
      const token = localStorage.getItem("token")
      const payload = {
        name: subjectName.trim(),
        code: subjectCode.trim(),
        type: subjectType,
        classId: classVal,
        sectionIds: selectedSections,
      }

      if (isEditMode && subjectToEdit) {
        await axios.patch(`http://localhost:5000/api/admin/subjects/${subjectToEdit.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await axios.post("http://localhost:5000/api/admin/subjects", payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }

      setIsSubmitting(false)
      onSuccess()
    } catch (err: any) {
      setIsSubmitting(false)
      setError(err.response?.data?.message || "Failed to submit subject details.")
    }
  }

  return (
    <div ref={wrapperRef} className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1523]/35 backdrop-blur-[6px] p-4 overscroll-none animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-[28px] bg-[#f8fafd] p-6 shadow-2xl z-10 flex flex-col gap-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0a1c3a] font-sans">
            {isEditMode ? "Edit Subject" : "Add New Subject"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-4 py-3 rounded-2xl flex items-center gap-2 animate-in fade-in duration-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
            <span className="flex-1 leading-snug">{error}</span>
          </div>
        )}

        {/* Content/Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Subject Name Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#0a1c3a]">Subject Name</label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => {
                setSubjectName(e.target.value)
                setError(null)
              }}
              placeholder="Enter Subject Name"
              className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>

          {/* Subject Code Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#0a1c3a]">Subject Code</label>
            <input
              type="text"
              value={subjectCode}
              onChange={(e) => {
                setSubjectCode(e.target.value)
                setError(null)
              }}
              placeholder="Enter Subject Code"
              className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>

          {/* Class & Section Selection side-by-side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Class Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#0a1c3a]">Class</label>
              <div className="relative">
                <select
                  value={classVal}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3.5 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer font-medium"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Section Selection (1 or more) */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#0a1c3a]">Assigned Sections</label>
              {!classVal ? (
                <div className="text-xs text-gray-400 italic bg-gray-50 border border-gray-100 px-4 py-3.5 rounded-2xl h-[50px] flex items-center">
                  Select a class first.
                </div>
              ) : sectionsList.length === 0 ? (
                <div className="text-xs text-gray-400 italic bg-gray-50 border border-gray-100 px-4 py-3.5 rounded-2xl h-[50px] flex items-center">
                  No sections available.
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 p-2 rounded-2xl border border-gray-200/80 bg-white max-h-[120px] overflow-y-auto">
                  {sectionsList.map((sec) => {
                    const isChecked = selectedSections.includes(sec.id)
                    return (
                      <label
                        key={sec.id}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold cursor-pointer select-none transition-all duration-150 ${
                          isChecked
                            ? "bg-blue-50 border-[#4285F4] text-[#4285F4] shadow-xs"
                            : "bg-gray-50/50 border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedSections(selectedSections.filter((id) => id !== sec.id))
                            } else {
                              setSelectedSections([...selectedSections, sec.id])
                            }
                            setError(null)
                          }}
                          className="hidden"
                        />
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                          isChecked ? "border-[#4285F4] bg-[#4285F4]" : "border-gray-300"
                        }`}>
                          {isChecked && (
                            <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        {sec.name}
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Subject Type Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#0a1c3a]">Subject Type</label>
            <div className="relative">
              <select
                value={subjectType}
                onChange={(e) => {
                  setSubjectType(e.target.value as "Theory" | "Lab")
                  setError(null)
                }}
                className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3.5 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer font-medium"
              >
                <option value="Theory">Theory</option>
                <option value="Lab">Lab</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-2xl bg-[#4285F4] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 cursor-pointer shadow-sm disabled:opacity-75 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? "Submitting..." : isEditMode ? "Update Subject" : "Add Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
