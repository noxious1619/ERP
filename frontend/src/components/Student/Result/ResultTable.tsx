import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface SubjectResult {
  subject: string;
  marks: string;
  grade: string;
  percentage: string;
  status: "Pass" | "Fail" | "Absent";
}

const initialResults: SubjectResult[] = [
  { subject: "Maths", marks: "18/20", grade: "A", percentage: "90%", status: "Pass" },
  { subject: "English", marks: "03/20", grade: "F", percentage: "15%", status: "Fail" },
  { subject: "Geography", marks: "20/20", grade: "A+", percentage: "100%", status: "Pass" },
  { subject: "Chemistry", marks: "-", grade: "N/A", percentage: "-", status: "Absent" },
  { subject: "Physics", marks: "16/20", grade: "A-", percentage: "80%", status: "Pass" },
  { subject: "Biology", marks: "17/20", grade: "A", percentage: "85%", status: "Pass" },
];

const ResultTable: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState("Mid Term Exam");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getGradeStyle = (grade: string) => {
    if (grade === "F") return "bg-[#FFEBEE] text-[#F44336]";
    if (grade === "N/A") return "bg-[#ECEFF1] text-[#607D8B]";
    return "bg-[#E8F5E9] text-[#4CAF50]";
  };

  const getStatusStyle = (status: "Pass" | "Fail" | "Absent") => {
    if (status === "Pass") return "bg-[#E8F5E9] text-[#4CAF50]";
    return "bg-[#FFEBEE] text-[#F44336]";
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#EAECF0] p-6 shadow-sm w-full">
      {/* Centered Dropdown Selector */}
      <div className="flex justify-center mb-2 relative">
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-[#EAECF0] rounded-full bg-white text-[13px] font-semibold text-[#4D8DFF] hover:bg-gray-50 transition-colors shadow-sm"
          >
            {selectedExam}
            <ChevronDown className="w-4 h-4 text-[#4D8DFF]" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-[#EAECF0] rounded-xl shadow-lg z-20 py-1">
              {["Mid Term Exam", "Final Exam", "Unit Test 1"].map((exam) => (
                <button
                  key={exam}
                  onClick={() => {
                    setSelectedExam(exam);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-center px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {exam}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Left Aligned Header */}
      <div className="mb-4">
        <h3 className="text-[16px] font-bold text-[#1D2939]">
          Mid Term Exam Result
        </h3>
      </div>

      {/* Table section */}
      <div className="overflow-hidden border border-[#EAECF0] rounded-[16px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EEF3FF] border-b border-[#EAECF0]">
              <th className="py-4 px-6 text-[11px] font-bold text-[#4D8DFF] uppercase tracking-wider">Subject</th>
              <th className="py-4 px-6 text-[11px] font-bold text-[#4D8DFF] uppercase tracking-wider">Marks</th>
              <th className="py-4 px-6 text-[11px] font-bold text-[#4D8DFF] uppercase tracking-wider">Grade</th>
              <th className="py-4 px-6 text-[11px] font-bold text-[#4D8DFF] uppercase tracking-wider">Percentage</th>
              <th className="py-4 px-6 text-[11px] font-bold text-[#4D8DFF] uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAECF0]">
            {initialResults.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-[14px] font-semibold text-[#181D27]">
                  {row.subject}
                </td>
                <td className="py-4 px-6 text-[14px] font-semibold text-[#4F5E7B]">
                  {row.marks}
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-[6px] text-[12px] font-bold min-w-[28px] ${getGradeStyle(row.grade)}`}>
                    {row.grade}
                  </span>
                </td>
                <td className="py-4 px-6 text-[14px] font-semibold text-[#4F5E7B]">
                  {row.percentage}
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[12px] font-semibold min-w-[64px] ${getStatusStyle(row.status)}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultTable;
