import { Users } from "lucide-react"

export default function ClassesBanner() {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
      {/* Inner Left Container */}
      <div className="flex flex-wrap items-center gap-6 bg-gray-50/50 border border-gray-200/80 rounded-xl px-5 py-3">
        <span className="text-base font-bold text-[#4285F4]">Class 1</span>
        
        <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
          <Users className="h-4 w-4 text-gray-400" />
          <span>135/150</span>
        </div>

        <span className="text-sm text-gray-500 font-medium">3 Sections</span>

        <button className="bg-[#4285F4] hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-sm cursor-pointer">
          + Add Section
        </button>
      </div>

      {/* Right Button */}
      <button className="bg-[#4285F4] hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm self-stretch sm:self-auto flex items-center justify-center gap-1.5 cursor-pointer">
        <span>+</span> Add Class
      </button>
    </div>
  )
}
