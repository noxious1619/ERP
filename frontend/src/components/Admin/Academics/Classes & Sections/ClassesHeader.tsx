import { ChevronDown } from "lucide-react";
interface AcademicYear {
  id: string;
  name: string;
  isCurrent: boolean;
}

interface AcademicClass {
  id: string;
  name: string;
}

interface ClassesHeaderProps {
  years: AcademicYear[];
  classes: AcademicClass[];
  selectedYearId: string | null;
  selectedClassId: string | null;
  onYearChange: (yearId: string) => void;
  onClassChange: (classId: string) => void;
}

export default function ClassesHeader({
  years,
  classes,
  selectedYearId,
  selectedClassId,
  onYearChange,
  onClassChange,
}: ClassesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-sans">
          Classes & Sections
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage classes and sections
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Year Dropdown */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 mb-1.5">
            Year
          </span>
          <div className="relative">
            <select
              value={selectedYearId ?? ""}
              onChange={(e) => onYearChange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] cursor-pointer"
            >
              {years.length === 0 && <option value="">No years</option>}
              {years.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Class Dropdown */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 mb-1.5">
            Class
          </span>
          <div className="relative">
            <select
              value={selectedClassId ?? ""}
              onChange={(e) => onClassChange(e.target.value)}
              disabled={classes.length === 0}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {classes.length === 0 ? (
                <option value="">No classes</option>
              ) : (
                classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))
              )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
