import React, { useState } from "react";

interface RecordRow {
  rollNo: string;
  name: string;
  marks: string;
}

const failedRecords: RecordRow[] = [
  { rollNo: "002", name: "Diya Patel", marks: "3/20" },
  { rollNo: "025", name: "Kevin Mehra", marks: "5/20" },
];

const absentRecords: RecordRow[] = [
  { rollNo: "004", name: "Ananya Reddy", marks: "-" },
  { rollNo: "007", name: "Reyansh Singh", marks: "-" },
];

const TeacherFailedAbsentCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Failed" | "Absent">("Failed");

  const currentRecords = activeTab === "Failed" ? failedRecords : absentRecords;

  return (
    <div className="bg-white rounded-[24px] border border-[#EAECF0] p-4 shadow-sm w-full">
      {/* Header Tabs */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={() => setActiveTab("Failed")}
          className={`px-6 py-1.5 rounded-full text-[12px] font-bold tracking-wide transition-all border ${
            activeTab === "Failed"
              ? "bg-[#FFEBEE] border-[#FDA29B] text-[#F44336] shadow-sm"
              : "bg-white border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Failed
        </button>
        <button
          onClick={() => setActiveTab("Absent")}
          className={`px-6 py-1.5 rounded-full text-[12px] font-bold tracking-wide transition-all border ${
            activeTab === "Absent"
              ? "bg-[#ECEFF1] border-gray-300 text-[#607D8B] shadow-sm"
              : "bg-white border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Absent
        </button>
      </div>

      {/* Mini Table */}
      <div className="overflow-hidden border border-[#EAECF0] rounded-[16px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-[#EAECF0]">
              <th className="py-2.5 px-4 text-[12px] font-bold text-gray-600">Roll no.</th>
              <th className="py-2.5 px-4 text-[12px] font-bold text-gray-600">Student Name</th>
              <th className="py-2.5 px-4 text-[12px] font-bold text-gray-600">Marks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAECF0]">
            {currentRecords.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-[13px] font-semibold text-gray-500">
                  {row.rollNo}
                </td>
                <td className="py-3 px-4 text-[13px] font-semibold text-gray-800">
                  {row.name}
                </td>
                <td className={`py-3 px-4 text-[13px] font-bold ${activeTab === "Failed" ? "text-[#D92D20]" : "text-gray-400"}`}>
                  {row.marks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherFailedAbsentCard;
