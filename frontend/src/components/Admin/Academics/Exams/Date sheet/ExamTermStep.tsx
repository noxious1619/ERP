import { useState } from "react"
import { BookOpen, ArrowRight, Loader2 } from "lucide-react"
import axios from "axios"
import { API_BASE_URL } from "../../../../../lib/api";

interface ExamTermStepProps {
  termName: string
  setTermName: (val: string) => void
  setTermId: (val: string) => void
  onNext: () => void
}

export default function ExamTermStep({
  termName,
  setTermName,
  setTermId,
  onNext,
}: ExamTermStepProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNext = async () => {
    if (!termName.trim()) {
      setError("Exam term name is required.")
      return
    }
    setError(null)
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await axios.post(
        `${API_BASE_URL}/api/exam-terms`,
        { name: termName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data.success) {
        setTermId(res.data.data.id)
        onNext()
      } else {
        setError("Failed to create exam term. Please try again.")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error connecting to server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="border border-gray-200 rounded-xl p-6 bg-white">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-[#4285F4]" />
          <h3 className="font-bold text-gray-800 text-[14px]">Exam Term Details</h3>
        </div>

        <div className="max-w-md">
          <div className="relative mt-1">
            <label className="absolute -top-2 left-3.5 bg-white px-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider z-10">
              Exam Term Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={termName}
              onChange={(e) => {
                setTermName(e.target.value)
                setError(null)
              }}
              placeholder="e.g. Mid Term 2026, Annual Exam 2026"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] font-medium text-gray-800 bg-white transition"
            />
          </div>

          {error && (
            <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>
          )}

          <p className="mt-3 text-xs text-gray-400 font-medium">
            This name will appear as the heading on teacher and student datesheets (e.g. "Mid Term 2026 · Class 10").
          </p>
        </div>
      </div>

      <div className="flex justify-start pt-4 border-t border-gray-100">
        <button
          onClick={handleNext}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#4285F4] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-lg transition shadow-md shadow-blue-500/10 cursor-pointer uppercase tracking-wider"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          {loading ? "Creating..." : "NEXT: CONFIGURE →"}
        </button>
      </div>
    </div>
  )
}