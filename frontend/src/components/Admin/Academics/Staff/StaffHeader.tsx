"use client";
import { Search, Plus } from "lucide-react";
interface StaffHeaderProps {
  totalCount: number;
  search: string;
  onSearchChange: (val: string) => void;
  onAddClick: () => void;
  onExportCSV: () => void;
}

export default function StaffHeader({
  search,
  onSearchChange,
  onAddClick,
  onExportCSV,
}: StaffHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Staff</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, employee ID, or phone..."
            className="h-10 w-[340px] rounded-full border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={onAddClick}
          className="flex h-10 items-center gap-1.5 rounded-full bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Staff
        </button>
        <button
          onClick={onExportCSV}
          className="flex h-10 items-center gap-1.5 rounded-full border border-blue-600 px-5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 relative bg-white"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
