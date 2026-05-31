"use client"

interface StudentPaginationProps {
  total?: number
  perPage?: number
  currentPage?: number
  onPageChange?: (page: number) => void
}

export default function StudentPagination({
  total = 0,
  perPage = 10,
  currentPage = 1,
  onPageChange,
}: StudentPaginationProps) {
  const totalPages  = Math.max(1, Math.ceil(total / perPage))
  const showing     = Math.min(perPage, total - (currentPage - 1) * perPage)

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-sm text-gray-500">
        Showing {showing} of {total} students
      </p>

      <div className="flex items-center gap-1">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          className="rounded-lg px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange?.(p)}
            className={[
              "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
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
          onClick={() => onPageChange?.(currentPage + 1)}
          className="rounded-lg px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}