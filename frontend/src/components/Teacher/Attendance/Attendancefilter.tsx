import React from "react";
import { ChevronDown, Lock } from "lucide-react";

interface AttendanceFilterProps {
  selectedClass: string;
  selectedSection: string;
  selectedDate: string;
  onClassChange: (val: string) => void;
  onSectionChange: (val: string) => void;
  onDateChange: (val: string) => void;
  onLoadStudents: () => void;
}

const Dropdown = ({
  value,
  placeholder,
  options = [],
  onChange,
  disabled = false,
}: {
  value: string;
  placeholder: string;
  options?: string[];
  onChange: (val: string) => void;
  disabled?: boolean;
}) => {
  const isSelected = !!value;

  return (
    <div className="relative flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          appearance-none pl-4 pr-10 py-1.5 rounded-full border text-sm 
          outline-none transition-all font-medium
          ${
            disabled
              ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed opacity-80"
              : isSelected
              ? "bg-white border-blue-400 text-blue-600 cursor-pointer"
              : "bg-white border-gray-300 text-gray-500 cursor-pointer"
          }
        `}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        
        {/* If the exact value from DB isn't in our options list, we inject it here so it displays */}
        {value && !options.includes(value) && (
          <option value={value}>{value}</option>
        )}

        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      
      {/* Swap the chevron for a Lock icon if the field is disabled */}
      {disabled ? (
        <Lock
          size={12}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      ) : (
        <ChevronDown
          size={14}
          className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
            isSelected ? "text-blue-500" : "text-gray-400"
          }`}
        />
      )}
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
}) => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Dropdown
        value={selectedClass}
        placeholder="Select Class"
        onChange={onClassChange}
        disabled={true} // Locked for Class Teachers
      />

      <span className="text-gray-200 text-base select-none">|</span>

      <Dropdown
        value={selectedSection}
        placeholder="Select Section"
        onChange={onSectionChange}
        disabled={true} // Locked for Class Teachers
      />

      <span className="text-gray-200 text-base select-none">|</span>

      {/* Replaced the static dropdown with a dynamic Date Picker */}
      <div className="relative">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="
            appearance-none pl-4 pr-4 py-1.5 rounded-full border text-sm cursor-pointer
            outline-none transition-all bg-white font-medium border-blue-400 text-blue-600
          "
        />
      </div>
    </div>
  );
};

export default AttendanceFilter;