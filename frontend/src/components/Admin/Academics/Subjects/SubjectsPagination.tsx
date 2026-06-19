export default function SubjectsPagination() {
  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm text-gray-500 font-medium">Showing 6 of 6 Subjects</span>

      <div className="flex items-center gap-1.5 text-sm">
        <button className="border border-gray-200 rounded-xl px-4 py-2 text-gray-500 hover:bg-gray-50 transition font-medium cursor-pointer">
          Previous
        </button>
        <button className="bg-[#4285F4] hover:bg-blue-600 text-white rounded-xl w-10 h-10 flex items-center justify-center font-bold shadow-sm transition cursor-pointer">
          1
        </button>
        <button className="border border-gray-200 rounded-xl w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition font-medium cursor-pointer">
          2
        </button>
        <button className="border border-gray-200 rounded-xl w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition font-medium cursor-pointer">
          3
        </button>
        <button className="border border-gray-200 rounded-xl px-4 py-2 text-gray-500 hover:bg-gray-50 transition font-medium cursor-pointer">
          Next
        </button>
      </div>
    </div>
  )
}
