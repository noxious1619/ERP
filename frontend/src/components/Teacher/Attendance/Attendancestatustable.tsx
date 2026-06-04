import React, { useState } from "react";
import type { Student } from "./Studentattendancetable";
interface AttendanceStatusTableProps {
  students: Student[];
}

type Tab = "present" | "late" | "absent";

const tabConfig: { key: Tab; label: string; activeClass: string }[] = [
  {
    key: "present",
    label: "Present",
    activeClass: "border border-green-400 text-green-600 bg-green-50",
  },
  {
    key: "late",
    label: "Late",
    activeClass: "border border-yellow-300 text-yellow-600 bg-yellow-50",
  },
  {
    key: "absent",
    label: "Absent",
    activeClass: "border border-red-300 text-red-500 bg-red-50",
  },
];

const AttendanceStatusTable: React.FC<AttendanceStatusTableProps> = ({
  students,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("present");
  const filtered = students.filter((s) => s.status === activeTab);

  return (
    <div className="rounded-xl border border-gray-100 overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        {tabConfig.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              activeTab === tab.key
                ? tab.activeClass
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table with thin scrollbar */}
      <style>{`
        .status-table-scroll::-webkit-scrollbar { width: 4px; }
        .status-table-scroll::-webkit-scrollbar-track { background: transparent; }
        .status-table-scroll::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 999px; }
        .status-table-scroll::-webkit-scrollbar-thumb:hover { background-color: #030213; }
      `}</style>
      <div
        className="status-table-scroll overflow-y-auto max-h-[375px]"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#030213 transparent",
        }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500 w-20">
                Roll No.
              </th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">
                Student Name
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="text-center py-6 text-xs text-gray-400"
                >
                  No students
                </td>
              </tr>
            ) : (
              filtered.map((s, i) => (
                <tr
                  key={s.rollNo}
                  className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    i === filtered.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {s.rollNo}
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-sm">{s.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceStatusTable;
