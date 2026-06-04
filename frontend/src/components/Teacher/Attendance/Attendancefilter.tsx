import React from "react";
import { ChevronDown } from "lucide-react";

interface AttendanceFilterProps {
  selectedClass: string;
  selectedSection: string;
  selectedDate: string;
  onClassChange: (val: string) => void;
  onSectionChange: (val: string) => void;
  onDateChange: (val: string) => void;
  onLoadStudents: () => void;
}

const classes = ["Class VIII", "Class IX", "Class X", "Class XI", "Class XII"];
const sections = ["Section A", "Section B", "Section C", "Section D"];
const dates = [
  "26/6/2026",
  "25/6/2026",
  "24/6/2026",
  "23/6/2026",
  "22/6/2026",
  "21/6/2026",
];

const Dropdown = ({
  value,
  placeholder,
  options,
  onChange,
}: {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (val: string) => void;
}) => {
  const isSelected = !!value;
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          appearance-none pl-3 pr-8 py-1.5 rounded-full border text-sm cursor-pointer
          outline-none transition-all bg-white font-medium
          ${
            isSelected
              ? "border-blue-400 text-blue-600"
              : "border-gray-300 text-gray-500"
          }
        `}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none
          ${isSelected ? "text-blue-500" : "text-gray-400"}`}
      />
    </div>
  );
};

const AttendanceFilter: React.FC<AttendanceFilterProps> = ({
  selectedClass,
  selectedSection,
  selectedDate,
  onClassChange,
  onSectionChange,
  onDateChange,
  onLoadStudents,
}) => {
  const allSelected = selectedClass && selectedSection && selectedDate;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Dropdown
        value={selectedClass}
        placeholder="Select Class"
        options={classes}
        onChange={onClassChange}
      />

      {/* Divider between dropdowns */}
      <span className="text-gray-300 text-base select-none">|</span>

      <Dropdown
        value={selectedSection}
        placeholder="Select Section"
        options={sections}
        onChange={onSectionChange}
      />

      <span className="text-gray-300 text-base select-none">|</span>

      <Dropdown
        value={selectedDate}
        placeholder="Select Date"
        options={dates}
        onChange={onDateChange}
      />

      <button
        onClick={onLoadStudents}
        disabled={!allSelected}
        className={`
          ml-2 px-5 py-1.5 rounded-full text-sm font-semibold transition-all border
          ${
            allSelected
              ? "bg-[#4285F4] text-white border-blue-300  cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        Load Students
      </button>
    </div>
  );
};

export default AttendanceFilter;
