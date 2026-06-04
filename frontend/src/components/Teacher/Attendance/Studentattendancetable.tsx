import React from "react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

export type AttendanceStatus = "present" | "late" | "absent";

export interface Student {
  rollNo: string;
  name: string;
  status: AttendanceStatus;
}

interface StudentAttendanceTableProps {
  students: Student[];
  onStatusChange: (rollNo: string, status: AttendanceStatus) => void;
}

const StatusIcon = ({
  status,
  onClick,
}: {
  status: AttendanceStatus;
  onClick: () => void;
}) => {
  if (status === "present")
    return (
      <button onClick={onClick} title="Click to change">
        <CheckCircle2 size={22} className="text-green-500" strokeWidth={1.8} />
      </button>
    );
  if (status === "late")
    return (
      <button onClick={onClick} title="Click to change">
        <Clock size={22} className="text-yellow-400" strokeWidth={1.8} />
      </button>
    );
  return (
    <button onClick={onClick} title="Click to change">
      <XCircle size={22} className="text-red-400" strokeWidth={1.8} />
    </button>
  );
};

const cycle: AttendanceStatus[] = ["present", "late", "absent"];

const StudentAttendanceTable: React.FC<StudentAttendanceTableProps> = ({
  students,
  onStatusChange,
}) => {
  const handleClick = (student: Student) => {
    const idx = cycle.indexOf(student.status);
    const next = cycle[(idx + 1) % cycle.length];
    onStatusChange(student.rollNo, next);
  };

  return (
    <>
      <style>{`
        .student-table-scroll::-webkit-scrollbar { width: 4px; }
        .student-table-scroll::-webkit-scrollbar-track { background: #04091c; }
        .student-table-scroll::-webkit-scrollbar-thumb { background-color: #030213; border-radius: 999px; }
        .student-table-scroll::-webkit-scrollbar-thumb:hover { background-color: #E0E1E5; }
      `}</style>

      {/* Single scrollable div — no duplicate outer overflow */}
      <div
        className="student-table-scroll overflow-y-auto max-h-[420px] rounded-xl border border-gray-100"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#030213 transparent",
        }}
      >
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col style={{ width: "25%" }} />
            <col style={{ width: "50%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                Roll No
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                Student Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr
                key={s.rollNo}
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  i === students.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-4 py-3 text-gray-500 text-xs">{s.rollNo}</td>
                <td className="px-4 py-3 text-gray-800 text-sm font-medium truncate">
                  {s.name}
                </td>
                <td className="px-4 py-3 ">
                  <StatusIcon
                    status={s.status}
                    onClick={() => handleClick(s)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StudentAttendanceTable;
