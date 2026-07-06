import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import AdminEditResultModal, { StudentMarksRecord } from "./AdminEditResultModal";

const initialRecords: StudentMarksRecord[] = [
  { rollNo: "01", name: "Aarav Sharma", marks: "20/20", status: "Pass", percentage: "100%" },
  { rollNo: "02", name: "Diya Patel", marks: "03/20", status: "Fail", percentage: "15%", isRedMarks: true },
  { rollNo: "03", name: "Arjun Mehta", marks: "15/20", status: "Pass", percentage: "75%" },
  { rollNo: "04", name: "Ananya Reddy", marks: "-", status: "Absent", percentage: "-" },
  { rollNo: "05", name: "Vihaan Kumar", marks: "17/20", status: "Pass", percentage: "85%" },
  { rollNo: "06", name: "Saanvi Gupta", marks: "-", status: "Absent", percentage: "-" },
  { rollNo: "07", name: "Reyansh Singh", marks: "-", status: "Absent", percentage: "-" },
];

interface AdminMarksTableCardProps {
  selectedSubject: string;
  onSubjectChange: (subj: string) => void;
}

const AdminMarksTableCard: React.FC<AdminMarksTableCardProps> = ({ selectedSubject, onSubjectChange }) => {
  const [records, setRecords] = useState<StudentMarksRecord[]>(initialRecords);
  const [editingRecord, setEditingRecord] = useState<StudentMarksRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusStyle = (status: "Pass" | "Fail" | "Absent") => {
    if (status === "Pass") return "bg-[#E8F5E9] text-[#4CAF50]";
    if (status === "Fail") return "bg-[#FFEBEE] text-[#F44336]";
    return "bg-[#FBE9E7] text-[#FF5722]";
  };

  const handleSave = (updated: StudentMarksRecord) => {
    setRecords((prev) => prev.map((r) => (r.rollNo === updated.rollNo ? updated : r)));
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#EAECF0] p-6 shadow-sm w-full">
      {/* 1. Filter Row */}
      <div className="flex flex-wrap items-center justify-center gap-3 pb-6 border-b border-[#F2F4F7] mb-6">
        {/* Exam Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#EAECF0] rounded-full text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors bg-white">
            Mid Term Exam
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Class Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#EAECF0] rounded-full text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors bg-white">
            Class X
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Section Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#EAECF0] rounded-full text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors bg-white">
            Section A
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Date Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#EAECF0] rounded-full text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors bg-white">
            30/05/2026
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Subject Dropdown (Custom Interactive Selection) */}
        <div className="relative">
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="flex items-center gap-2 px-4 py-2 border border-[#EAECF0] rounded-full text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors bg-white appearance-none cursor-pointer pr-8 focus:outline-none"
            style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundPosition: 'right 8px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="English">English</option>
            <option value="All Subjects">All Subjects</option>
          </select>
        </div>
      </div>

      {/* 2. Sub-Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] font-bold text-gray-800 leading-tight">English</h2>
          <span className="text-[12px] text-gray-400 font-semibold">30th May, 2026</span>
        </div>

        <div className="text-center">
          <h3 className="text-[16px] font-bold text-gray-800">Mid-Term Examination</h3>
          <span className="text-[12px] text-[#4D8DFF] font-semibold">Class X-A • 35 Students</span>
        </div>

        <div>
          <button
            onClick={() => {
              setEditingRecord(records[0]);
              setIsModalOpen(true);
            }}
            className="px-6 py-2 border border-[#4285F4] text-[#4285F4] bg-white rounded-full text-[13px] font-bold hover:bg-blue-50 active:scale-[0.98] transition-all"
          >
            Edit
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
            {records.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => {
                  setEditingRecord(row);
                  setIsModalOpen(true);
                }}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="py-4 px-6 text-[14px] font-semibold text-[#667085]">
                  {row.rollNo}
                </td>
                <td className="py-4 px-6 text-[14px] font-semibold text-[#181D27]">
                  {row.name}
                </td>
                <td className={`py-4 px-6 text-[14px] font-bold ${row.isRedMarks ? "text-[#D92D20]" : "text-[#4F5E7B]"
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

      {/* Edit Result Modal Dialog */}
      {editingRecord && (
        <AdminEditResultModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          record={editingRecord}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AdminMarksTableCard;
