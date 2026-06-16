import { useState } from "react"
import { X } from "lucide-react"

interface AddSectionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddSectionModal({ isOpen, onClose }: AddSectionModalProps) {
  const [sectionName, setSectionName] = useState("")
  const [roomNumber, setRoomNumber] = useState("")
  const [strength, setStrength] = useState("")
  const [batchSize, setBatchSize] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle submission logic (static for now)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1523]/35 backdrop-blur-[6px] p-4 overflow-y-auto">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-[28px] bg-[#f8fafd] p-6 shadow-2xl z-10 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0a1c3a] font-sans">Add New Section In Class 4</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Content/Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Enter Section Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#0a1c3a]">Enter Section</label>
            <input
              type="text"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="Enter Section"
              className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Room Number Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#0a1c3a]">Room Number</label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="Enter Room Number"
              className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Total Class Strength Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#0a1c3a]">Total Class Strength</label>
            <input
              type="text"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              placeholder="Enter Class Strength"
              className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Total Batch Size Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#0a1c3a]">Total Batch Size</label>
            <input
              type="text"
              value={batchSize}
              onChange={(e) => setBatchSize(e.target.value)}
              placeholder="Enter Total Batch Size"
              className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-[#4285F4] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 cursor-pointer shadow-sm"
            >
              Add New Section
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
