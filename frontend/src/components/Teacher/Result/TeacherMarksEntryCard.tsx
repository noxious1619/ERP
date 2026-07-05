import React from "react";
import { ChevronDown } from "lucide-react";

interface StudentMarksRecord {
  rollNo: string;
  name: string;
  marks: string;
  status: "Pass" | "Fail" | "Absent" | "N/A";
  percentage: string;
  isRedMarks?: boolean;
  isGrayMarks?: boolean;
}

const initialRecords: StudentMarksRecord[] = [
  { rollNo: "01", name: "Aarav Sharma", marks: "20", status: "Pass", percentage: "100%" },
  { rollNo: "02", name: "Diya Patel", marks: "03/20", status: "Fail", percentage: "15%", isRedMarks: true },
  { rollNo: "03", name: "Arjun Mehta", marks: "15/20", status: "Pass", percentage: "75%" },
  { rollNo: "04", name: "Ananya Reddy", marks: "-", status: "Absent", percentage: "-" },
  { rollNo: "05", name: "Vihaan Kumar", marks: "17/20", status: "Pass", percentage: "85%" },
  { rollNo: "06", name: "Saanvi Gupta", marks: "/20", status: "N/A", percentage: "-", isGrayMarks: true },
  { rollNo: "07", name: "Reyansh Singh", marks: "-", status: "Absent", percentage: "-" },
];

const TeacherMarksEntryCard: React.FC = () => {
  const selectedExam = "Mid Term Exam";
  const selectedClass = "Class X";
  const selectedSection = "Section A";
  const selectedDate = "20/6/2026";

  const getStatusStyle = (status: "Pass" | "Fail" | "Absent" | "N/A") => {
    if (status === "Pass") return "bg-[#E8F5E9] text-[#4CAF50]";
    if (status === "Fail") return "bg-[#FFEBEE] text-[#F44336]";
    if (status === "Absent") return "bg-[#FBE9E7] text-[#FF5722]";
    return "bg-[#ECEFF1] text-[#607D8B]";
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#EAECF0] p-6 shadow-sm w-full">
      {/* 1. Selectors Filter Row */}
      <div className="flex flex-wrap items-center justify-center gap-3 pb-6 border-b border-[#F2F4F7] mb-6">
        {/* Exam Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#EAECF0] rounded-full text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            {selectedExam}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Class Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#EAECF0] rounded-full text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            {selectedClass}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Section Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#EAECF0] rounded-full text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            {selectedSection}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Date Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#EAECF0] rounded-full text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            {selectedDate}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Load Students Button */}
        <button className="px-5 py-2 bg-[#4D8DFF] text-white rounded-full text-[13px] font-bold shadow-sm hover:bg-[#3B82F6] active:scale-[0.98] transition-all">
          Load Students
        </button>
      </div>

      {/* 2. Sub-Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] font-bold text-gray-800 leading-tight">English</h2>
          <span className="text-[12px] text-gray-400 font-semibold">Max Marks - 20</span>
        </div>

        <div className="text-center">
          <h3 className="text-[16px] font-bold text-gray-800">Mid-Term Examination</h3>
          <span className="text-[12px] text-[#4D8DFF] font-semibold">Class X-A • 35 Students</span>
        </div>

        <div className="flex gap-3">
          <button className="px-6 py-2 bg-[#4D8DFF] text-white rounded-full text-[13px] font-bold shadow-sm hover:bg-[#3B82F6] active:scale-[0.98] transition-all">
            Edit
          </button>
          <button className="px-6 py-2 bg-gray-200 text-gray-400 rounded-full text-[13px] font-bold cursor-not-allowed">
            Save
          </button>
        </div>
      </div>

      {/* 3. Table */}
      <div className="overflow-hidden border border-[#EAECF0] rounded-[16px] mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EEF3FF] border-b border-[#EAECF0]">
              <th className="py-4 px-6 text-[11px] font-bold text-[#4D8DFF] uppercase tracking-wider">Roll no.</th>
              <th className="py-4 px-6 text-[11px] font-bold text-[#4D8DFF] uppercase tracking-wider">Student Name</th>
              <th className="py-4 px-6 text-[11px] font-bold text-[#4D8DFF] uppercase tracking-wider">Marks</th>
              <th className="py-4 px-6 text-[11px] font-bold text-[#4D8DFF] uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-[11px] font-bold text-[#4D8DFF] uppercase tracking-wider">Percentage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAECF0]">
            {initialRecords.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-[14px] font-semibold text-[#667085]">
                  {row.rollNo}
                </td>
                <td className="py-4 px-6 text-[14px] font-semibold text-[#181D27]">
                  {row.name}
                </td>
                <td className={`py-4 px-6 text-[14px] font-bold ${
                  row.isRedMarks ? "text-[#D92D20]" : row.isGrayMarks ? "text-gray-300" : "text-[#4F5E7B]"
                }`}>
                  {row.marks}
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[12px] font-semibold min-w-[64px] ${getStatusStyle(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-[14px] font-semibold text-[#4F5E7B]">
                  {row.percentage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Footer Pagination */}
      <div className="flex items-center justify-between border-t border-[#F2F4F7] pt-4">
        <span className="text-[13px] text-gray-500 font-semibold">
          Showing 7 of 35 Students
        </span>

        <div className="flex items-center gap-1.5">
          <button className="px-4 py-2 border border-[#EAECF0] rounded-lg text-[13px] font-bold text-gray-600 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            Previous
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-[#4D8DFF] text-white rounded-lg text-[13px] font-bold shadow-sm">
            1
          </button>
          <button className="w-9 h-9 flex items-center justify-center border border-[#EAECF0] rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-colors bg-white shadow-sm">
            2
          </button>
          <button className="w-9 h-9 flex items-center justify-center border border-[#EAECF0] rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-colors bg-white shadow-sm">
            3
          </button>
          <button className="px-4 py-2 border border-[#EAECF0] rounded-lg text-[13px] font-bold text-gray-600 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            Next
          </button>
        </div>
      </div>

    </div>
  );
};

export default TeacherMarksEntryCard;
