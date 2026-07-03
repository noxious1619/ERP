import { useState, useEffect } from "react"
import { X, Plus, Trash2, GripVertical } from "lucide-react"
import axios from "axios"
import { API_BASE_URL } from "../../../../lib/api";

interface ManagePeriodsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  sectionId: string
  currentPeriods: { period: number; startTime: string; endTime: string }[]
}


export default function ManagePeriodsModal({
  isOpen,
  onClose,
  onSuccess,
  sectionId,
  currentPeriods,
}: ManagePeriodsModalProps) {
  const [periods, setPeriods] = useState<{ period: number; startTime: string; endTime: string; originalPeriod?: number }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Drag and drop states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Sync state with props when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null)
      // Make a deep copy and keep track of originalPeriod numbers for re-indexing mapping on backend
      setPeriods(currentPeriods.map(p => ({
        ...p,
        originalPeriod: p.period
      })))
    }
  }, [isOpen, currentPeriods])

  if (!isOpen) return null

  // Handle start/end time updates
  const handleTimeChange = (periodNum: number, field: "startTime" | "endTime", value: string) => {
    setPeriods((prev) =>
      prev.map((p) => (p.period === periodNum ? { ...p, [field]: value } : p))
    )
  }

  // Remove period row
  const handleDeleteRow = (periodNum: number) => {
    setPeriods((prev) => {
      const filtered = prev.filter((p) => p.period !== periodNum)
      // Re-index period numbers sequentially from top to bottom (1 to N)
      return filtered.map((p, idx) => ({
        ...p,
        period: idx + 1,
      }))
    })
  }

  // Add new period row (always appends at the bottom)
  const handleAddRow = () => {
    setPeriods((prev) => {
      const nextPeriod = prev.length + 1

      // Default timings based on last period or general default
      let defaultStart = "08:00"
      let defaultEnd = "08:45"

      if (prev.length > 0) {
        const lastPeriod = prev[prev.length - 1]
        try {
          const [hours, minutes] = lastPeriod.endTime.split(":").map(Number)
          if (!isNaN(hours) && !isNaN(minutes)) {
            const date = new Date()
            date.setHours(hours, minutes + 15, 0, 0)
            defaultStart = date.toTimeString().substring(0, 5)
            date.setMinutes(date.getMinutes() + 45)
            defaultEnd = date.toTimeString().substring(0, 5)
          }
        } catch (err) {
          console.error("Error setting default next times:", err)
        }
      }

      const updated = [
        ...prev,
        { period: nextPeriod, startTime: defaultStart, endTime: defaultEnd },
      ]

      // Re-index sequentially to be safe
      return updated.map((p, idx) => ({
        ...p,
        period: idx + 1,
      }))
    })
  }

  // Drag Event Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      setPeriods((prev) => {
        const reordered = [...prev]
        const [removed] = reordered.splice(draggedIndex, 1)
        reordered.splice(dragOverIndex, 0, removed!)

        // Re-index period numbers sequentially from top to bottom (1 to N)
        return reordered.map((p, idx) => ({
          ...p,
          period: idx + 1,
        }))
      })
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Basic timing validations
    for (const p of periods) {
      if (!p.startTime || !p.endTime) {
        setError(`Period ${p.period} must have both start and end times.`)
        setIsSubmitting(false)
        return
      }
      if (p.startTime >= p.endTime) {
        setError(`Period ${p.period} start time must be earlier than its end time.`)
        setIsSubmitting(false)
        return
      }
    }

    try {
      const token = localStorage.getItem("token")
      const res = await axios.put(
        `${API_BASE_URL}/api/timetable/section/${sectionId}/periods`,
        { periods },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (res.data.success) {
        onSuccess()
      } else {
        setError(res.data.message || "Failed to update periods configuration.")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Server error: Failed to save changes.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900 font-sans">Manage Timetable Structure</h3>
            <p className="text-xs text-gray-500 mt-0.5">Drag to reorder rows. Adding or removing automatically updates numbering.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col h-[500px]">
          {/* Scrollable list area */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-4 py-3 rounded-2xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
                <span className="flex-1 leading-snug">{error}</span>
              </div>
            )}

            {periods.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <p className="text-sm font-semibold">No periods configured.</p>
                <p className="text-xs mt-1">Click "+ Add Period Row" to define your first row.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {periods.map((p, index) => (
                  <div
                    key={p.period}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center justify-between gap-4 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-2xl p-3.5 transition-all select-none ${
                      draggedIndex === index ? "opacity-30 border-dashed border-[#4285F4]/40 bg-[#4285F4]/5 scale-[0.98]" : ""
                    } ${
                      dragOverIndex === index ? "border-dashed border-[#4285F4] bg-[#4285F4]/5 scale-[1.01]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing shrink-0">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-gray-900 text-sm font-sans w-20">
                        Period {p.period}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pl-1">Start Time</label>
                        <input
                          type="time"
                          value={p.startTime}
                          onChange={(e) => handleTimeChange(p.period, "startTime", e.target.value)}
                          className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#4285F4] cursor-pointer"
                        />
                      </div>
                      <span className="text-gray-300 font-bold self-end mb-2.5">to</span>
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pl-1">End Time</label>
                        <input
                          type="time"
                          value={p.endTime}
                          onChange={(e) => handleTimeChange(p.period, "endTime", e.target.value)}
                          className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#4285F4] cursor-pointer"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteRow(p.period)}
                      className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors self-end mb-0.5"
                      title="Delete this period row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleAddRow}
              className="mt-2 w-full flex items-center justify-center gap-2 border border-dashed border-[#4285F4]/30 hover:border-[#4285F4]/60 bg-blue-50/10 hover:bg-blue-50/30 text-[#4285F4] text-sm font-bold py-3.5 rounded-2xl transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Period Row</span>
            </button>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-sm font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#4285F4] hover:bg-[#3367d6] text-white text-sm font-semibold shadow-md transition-all cursor-pointer disabled:opacity-75 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
