"use client"

interface StaffPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  startIndex: number;
  endIndex: number;
}

export default function StaffPagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  startIndex,
  endIndex
}: StaffPaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalItems === 0) return null;

  return (
    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
      <p className="text-sm text-gray-500">
        Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} Staff
      </p>

      <div className="flex items-center gap-1 text-sm bg-white border border-gray-200 rounded-lg shadow-sm">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-50 h-full border-r border-gray-200"
        >
          Previous
        </button>
        
        {/* Pages */}
        {getPageNumbers().map(page => (
          <button 
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 ${
              currentPage === page 
                ? "bg-blue-600 text-white font-medium" 
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-50 border-l border-gray-200 h-full"
        >
          Next
        </button>
      </div>
    </div>
  )
}