"use client"

interface StudentPaginationProps {
  total: number
  perPage: number
  currentPage: number
  onPageChange: (page: number) => void
}

export default function StudentPagination({
  total,
  perPage,
  currentPage,
  onPageChange,
}: StudentPaginationProps) {
  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-sm text-gray-500">
        Showing page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={[
              "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium cursor-pointer",
              currentPage === p
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100",
            ].join(" ")}
          >
            {p}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  )
}