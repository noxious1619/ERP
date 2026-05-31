"use client"

import { useState } from "react"

interface StudentPaginationProps {
  total?: number
  perPage?: number
}

export default function StudentPagination({
  total = 6,
  perPage = 6,
}: StudentPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(total / perPage))

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-sm text-gray-500">
        Showing {Math.min(perPage, total)} of {total} students
      </p>

      <div className="flex items-center gap-1">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="rounded-lg px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={[
              "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
              currentPage === page
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100",
            ].join(" ")}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="rounded-lg px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}