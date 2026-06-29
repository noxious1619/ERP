interface SubjectsPaginationProps {
  currentPage: number
  totalPages: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}

export default function SubjectsPagination({
  currentPage,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: SubjectsPaginationProps) {
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end = Math.min(total, currentPage * pageSize)

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm text-gray-500 font-medium">
        Showing {start} to {end} of {total} {total === 1 ? "Subject" : "Subjects"}
      </span>

      <div className="flex items-center gap-1.5 text-sm">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalPages === 0}
          className="border border-gray-200 rounded-xl px-4 py-2 text-gray-500 hover:bg-gray-50 transition font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onPageChange(num)}
            className={`rounded-xl w-10 h-10 flex items-center justify-center font-bold shadow-sm transition cursor-pointer ${
              currentPage === num
                ? "bg-[#4285F4] hover:bg-blue-600 text-white"
                : "border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="border border-gray-200 rounded-xl px-4 py-2 text-gray-500 hover:bg-gray-50 transition font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}
