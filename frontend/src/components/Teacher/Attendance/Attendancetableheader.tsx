import React from "react";
import { Download, CheckCircle2 } from "lucide-react";

interface AttendanceTableHeaderProps {
  classLabel: string;
  section: string;
  onMarkAllAbsent: () => void;
  onExport: () => void;
}

const AttendanceTableHeader: React.FC<AttendanceTableHeaderProps> = ({
  classLabel,
  section,
  onMarkAllAbsent,
  onExport,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">
          Class - {classLabel} ({section.replace("Section ", "")})
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">Student Attendance</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onMarkAllAbsent}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-3xl border border-gray-200 text-xs font-medium text-[#0A0A0A] hover:bg-gray-50 transition-colors"
        >
          <CheckCircle2 size={16} />
          Mark All Absent
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-3xl border border-gray-200 text-xs font-medium text-[#0A0A0A] hover:bg-gray-50 transition-colors"
        >
          <Download size={14} className="text-[#0A0A0A]" />
          Export
        </button>
      </div>
    </div>
  );
};

export default AttendanceTableHeader;
