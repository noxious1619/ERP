"use client"

import { Search, Plus } from "lucide-react"

interface StudentsHeaderProps {
  totalCount?: number
  search?: string
  onSearchChange?: (val: string) => void
}

export default function StudentsHeader({
  totalCount = 0,
  search = "",
  onSearchChange,
}: StudentsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
        <p className="mt-0.5 text-sm text-gray-500">{totalCount} students found</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search by name, employee ID, or phone..."
            className="h-10 w-[340px] rounded-full border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button className="flex h-10 items-center gap-1.5 rounded-full bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Features
        </button>
      </div>
    </div>
  )
}