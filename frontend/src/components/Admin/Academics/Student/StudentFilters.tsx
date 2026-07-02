import { ChevronDown } from "lucide-react";

interface StudentFiltersProps {
  selectedClass: string;
  onClassChange: (val: string) => void;
  selectedSection: string;
  onSectionChange: (val: string) => void;
  selectedGender: string;
  onGenderChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
  selectedYear: string;
  onYearChange: (val: string) => void;
  classes: any[];
  sections: any[];
  years: string[];
}

export default function StudentFilters({
  selectedClass,
  onClassChange,
  selectedSection,
  onSectionChange,
  selectedGender,
  onGenderChange,
  selectedStatus,
  onStatusChange,
  selectedYear,
  onYearChange,
  classes = [],
  sections = [],
  years = [],
}: StudentFiltersProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-4 flex flex-wrap items-center gap-4 shadow-sm">
      {/* Class Dropdown */}
      <div className="relative">
        <select
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] cursor-pointer"
        >
          <option value="">All Classes</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Section Dropdown */}
      <div className="relative">
        <select
          value={selectedSection}
          onChange={(e) => onSectionChange(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] cursor-pointer"
        >
          <option value="">All Sections</option>
          {sections.map((sec) => (
            <option key={sec.id} value={sec.id}>
              {sec.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Gender Dropdown */}
      <div className="relative">
        <select
          value={selectedGender}
          onChange={(e) => onGenderChange(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] cursor-pointer"
        >
          <option value="">All Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Status Dropdown */}
      <div className="relative">
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Year Dropdown */}
      <div className="relative">
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] cursor-pointer"
        >
          <option value="">All Admission Years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}