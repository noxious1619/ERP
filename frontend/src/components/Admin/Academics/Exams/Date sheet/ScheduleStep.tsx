import type { Dispatch, SetStateAction } from "react"
import { Clock, Plus, Trash2, Info, ArrowLeft, ArrowRight, ChevronDown } from "lucide-react"

export interface ScheduleRow {
  id: string
  date: string
  subject: string
  timeSlot: string
  duration: string
  maxMarks: string
  invigilator: string
}

interface ScheduleStepProps {
  scheduleRows: ScheduleRow[]
  setScheduleRows: Dispatch<SetStateAction<ScheduleRow[]>>
  onBack: () => void
  onNext: () => void
}

const COMMON_SUBJECTS = [
  "Mathematics",
  "General Science",
  "English Literature",
  "Social Science",
  "Computer Applications",
  "Physics",
  "Chemistry",
  "Biology",
  "History & Civics",
  "Geography"
]

const COMMON_INVIGILATORS = [
  "Mr. Rajesh Kumar",
  "Ms. Priya Sharma",
  "Mr. Amit Patel",
  "Mrs. Sneha Reddy",
  "Mr. Vikram Singh",
  "Ms. Neha Gupta",
  "Mr. Sanjay Dutt",
  "Mrs. Kavita Joshi"
]

const TIME_SLOTS = [
  "08:30 AM - 11:30 AM",
  "09:00 AM - 12:00 PM",
  "01:00 PM - 04:00 PM",
  "01:30 PM - 04:30 PM"
]

export default function ScheduleStep({
  scheduleRows,
  setScheduleRows,
  onBack,
  onNext
}: ScheduleStepProps) {
  
  const handleAddRow = () => {
    const newRow: ScheduleRow = {
      id: Math.random().toString(36).substring(2, 9),
      date: "",
      subject: "",
      timeSlot: "09:00 AM - 12:00 PM",
      duration: "3 Hours",
      maxMarks: "100",
      invigilator: ""
    }
    setScheduleRows(prev => [...prev, newRow])
  }

  const handleUpdateRow = (id: string, field: keyof ScheduleRow, value: string) => {
    setScheduleRows(prev =>
      prev.map(row => (row.id === id ? { ...row, [field]: value } : row))
    )
  }

  const handleDeleteRow = (id: string) => {
    if (scheduleRows.length <= 1) {
      alert("At least one exam slot is required.")
      return
    }
    setScheduleRows(prev => prev.filter(row => row.id !== id))
  }

  const handleNextClick = () => {
    onNext()
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Informative Alert Banner */}
      <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex gap-3 text-sm text-blue-800 shadow-3xs">
        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="flex-1 leading-relaxed">
          <p className="font-semibold mb-0.5">Exam Scheduling Guidelines</p>
          <p className="text-blue-700/90 text-xs">
            Add one row per exam paper. Ensure dates are in sequential order and avoid scheduling multiple exams for overlapping class slots. Invigilator duties are optional but recommended for reporting.
          </p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="border border-gray-100 rounded-2xl bg-white shadow-2xs overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#4285F4]" />
            <h3 className="font-bold text-gray-900 text-[15px]">Schedule Exam Papers</h3>
          </div>
          <button
            onClick={handleAddRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#4285F4] font-semibold text-xs rounded-lg border border-blue-100 transition shadow-3xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> ADD ANOTHER EXAM
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/30">
                <th className="py-3 px-4 w-12 text-center">No.</th>
                <th className="py-3 px-4 w-44">Date</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4 w-52">Time Slot</th>
                <th className="py-3 px-4 w-28">Duration</th>
                <th className="py-3 px-4 w-28">Max Marks</th>
                <th className="py-3 px-4">Invigilator</th>
                <th className="py-3 px-4 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {scheduleRows.map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-50/40 transition">
                  {/* Row No. */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-[11px] font-bold">
                      {index + 1}
                    </span>
                  </td>

                  {/* Date Input */}
                  <td className="py-3.5 px-4">
                    <div className="relative">
                      <input
                        type="date"
                        value={row.date}
                        onChange={(e) => handleUpdateRow(row.id, "date", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#4285F4] font-medium text-gray-800 bg-white transition shadow-3xs"
                      />
                    </div>
                  </td>

                  {/* Subject Dropdown / Input */}
                  <td className="py-3.5 px-4">
                    <div className="relative">
                      <select
                        value={row.subject}
                        onChange={(e) => handleUpdateRow(row.id, "subject", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#4285F4] font-medium text-gray-800 bg-white transition appearance-none cursor-pointer shadow-3xs"
                      >
                        <option value="">-- Select Subject --</option>
                        {COMMON_SUBJECTS.map(subj => (
                          <option key={subj} value={subj}>{subj}</option>
                        ))}
                        <option value="custom">Other / Custom</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                    </div>
                    {row.subject === "custom" && (
                      <input
                        type="text"
                        placeholder="Enter custom subject"
                        onChange={(e) => handleUpdateRow(row.id, "subject", e.target.value)}
                        className="mt-1.5 w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#4285F4] font-medium text-gray-800 bg-white transition shadow-3xs"
                      />
                    )}
                  </td>

                  {/* Time Slot Select / Input */}
                  <td className="py-3.5 px-4">
                    <div className="relative">
                      <select
                        value={TIME_SLOTS.includes(row.timeSlot) ? row.timeSlot : "custom"}
                        onChange={(e) => {
                          const val = e.target.value
                          if (val === "custom") {
                            handleUpdateRow(row.id, "timeSlot", "")
                          } else {
                            handleUpdateRow(row.id, "timeSlot", val)
                          }
                        }}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#4285F4] font-medium text-gray-800 bg-white transition appearance-none cursor-pointer shadow-3xs"
                      >
                        {TIME_SLOTS.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                        <option value="custom">Custom Timing</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                    </div>
                    {!TIME_SLOTS.includes(row.timeSlot) && (
                      <input
                        type="text"
                        value={row.timeSlot}
                        placeholder="e.g. 10:00 AM - 01:00 PM"
                        onChange={(e) => handleUpdateRow(row.id, "timeSlot", e.target.value)}
                        className="mt-1.5 w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#4285F4] font-medium text-gray-800 bg-white transition shadow-3xs"
                      />
                    )}
                  </td>

                  {/* Duration */}
                  <td className="py-3.5 px-4">
                    <input
                      type="text"
                      value={row.duration}
                      placeholder="e.g. 3 Hours"
                      onChange={(e) => handleUpdateRow(row.id, "duration", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#4285F4] font-medium text-gray-800 bg-white transition shadow-3xs"
                    />
                  </td>

                  {/* Max Marks */}
                  <td className="py-3.5 px-4">
                    <input
                      type="number"
                      value={row.maxMarks}
                      placeholder="100"
                      onChange={(e) => handleUpdateRow(row.id, "maxMarks", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#4285F4] font-medium text-gray-800 bg-white transition shadow-3xs"
                    />
                  </td>

                  {/* Invigilator Dropdown */}
                  <td className="py-3.5 px-4">
                    <div className="relative">
                      <select
                        value={row.invigilator}
                        onChange={(e) => handleUpdateRow(row.id, "invigilator", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-[#4285F4] font-medium text-gray-800 bg-white transition appearance-none cursor-pointer shadow-3xs"
                      >
                        <option value="">Unassigned</option>
                        {COMMON_INVIGILATORS.map(inv => (
                          <option key={inv} value={inv}>{inv}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </td>

                  {/* Action Delete */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleDeleteRow(row.id)}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row Button at footer of the table */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/20 flex justify-start">
          <button
            onClick={handleAddRow}
            className="inline-flex items-center gap-1.5 px-4 py-2 hover:bg-gray-100 text-gray-600 font-semibold text-xs rounded-xl border border-gray-200 transition cursor-pointer shadow-3xs"
          >
            <Plus className="h-4 w-4 text-gray-500" /> Add Row
          </button>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3 hover:bg-gray-150 text-gray-700 font-semibold text-sm rounded-xl border border-gray-200 transition bg-white cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO CONFIGURATION
        </button>

        <button
          onClick={handleNextClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#4285F4] hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition shadow-md shadow-blue-500/10 cursor-pointer"
        >
          NEXT: PREVIEW & PUBLISH <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  )
}
