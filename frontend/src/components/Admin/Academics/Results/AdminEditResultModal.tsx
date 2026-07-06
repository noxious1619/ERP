import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export interface StudentMarksRecord {
  rollNo: string;
  name: string;
  marks: string;
  status: "Pass" | "Fail" | "Absent";
  percentage: string;
  isRedMarks?: boolean;
}

interface AdminEditResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: StudentMarksRecord;
  onSave: (updatedRecord: StudentMarksRecord) => void;
}

const AdminEditResultModal: React.FC<AdminEditResultModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave,
}) => {
  const [rollNo, setRollNo] = useState(record.rollNo);
  const [name, setName] = useState(record.name);
  const [status, setStatus] = useState<"Pass" | "Fail" | "Absent">(record.status);
  const [marksObtained, setMarksObtained] = useState("20");
  const [marksOutOff, setMarksOutOff] = useState("20");
  const [percentage, setPercentage] = useState("100%");

  // Prefill state when modal opens or record changes
  useEffect(() => {
    setRollNo(record.rollNo);
    setName(record.name);
    setStatus(record.status);
    
    // Parse marks string, e.g. "20/20" or "03/20" or "-"
    if (record.marks && record.marks !== "-") {
      const parts = record.marks.split("/");
      setMarksObtained(parts[0] || "0");
      setMarksOutOff(parts[1] || "20");
    } else {
      setMarksObtained("");
      setMarksOutOff("20");
    }
    setPercentage(record.percentage);
  }, [record, isOpen]);

  // Recalculate percentage when marks change
  useEffect(() => {
    const ob = parseFloat(marksObtained);
    const tot = parseFloat(marksOutOff);
    if (!isNaN(ob) && !isNaN(tot) && tot > 0) {
      const pctValue = Math.round((ob / tot) * 100);
      setPercentage(`${pctValue}%`);
    } else {
      setPercentage("-");
    }
  }, [marksObtained, marksOutOff]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMarks = status === "Absent" ? "-" : `${marksObtained.padStart(2, '0')}/${marksOutOff}`;
    const finalPct = status === "Absent" ? "-" : percentage;
    
    onSave({
      ...record,
      rollNo,
      name,
      status,
      marks: finalMarks,
      percentage: finalPct,
      isRedMarks: status === "Fail" || (status !== "Absent" && parseFloat(marksObtained) < parseFloat(marksOutOff) * 0.4),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#F8F9FC] w-full max-w-[500px] rounded-[24px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col p-6 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-extrabold text-[#181D27]">
            Edit Student Result
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Roll No */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[13px] font-bold text-[#344054]">
              Roll No.
            </label>
            <input
              type="text"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="w-full p-3 rounded-[12px] border border-gray-200 bg-white text-[14px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
            />
          </div>

          {/* Student Name */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[13px] font-bold text-[#344054]">
              Student Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-[12px] border border-gray-200 bg-white text-[14px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[13px] font-bold text-[#344054]">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full p-3 rounded-[12px] border border-gray-200 bg-white text-[14px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold cursor-pointer"
            >
              <option value="Pass">Pass</option>
              <option value="Fail">Fail</option>
              <option value="Absent">Absent</option>
            </select>
          </div>

          {/* Marks Obtained */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[13px] font-bold text-[#344054]">
              Marks Obtained
            </label>
            <input
              type="text"
              disabled={status === "Absent"}
              value={status === "Absent" ? "" : marksObtained}
              onChange={(e) => setMarksObtained(e.target.value)}
              placeholder="e.g. 20"
              className="w-full p-3 rounded-[12px] border border-gray-200 bg-white text-[14px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>

          {/* Marks Out Off */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[13px] font-bold text-[#344054]">
              Marks Out Off
            </label>
            <input
              type="text"
              disabled={status === "Absent"}
              value={status === "Absent" ? "" : marksOutOff}
              onChange={(e) => setMarksOutOff(e.target.value)}
              placeholder="e.g. 20"
              className="w-full p-3 rounded-[12px] border border-gray-200 bg-white text-[14px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>

          {/* Percentage */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[13px] font-bold text-[#344054]">
              Percentage
            </label>
            <input
              type="text"
              disabled
              value={percentage}
              className="w-full p-3 rounded-[12px] border border-gray-200 bg-gray-50 text-[14px] text-gray-500 font-semibold"
            />
            <span className="text-[11px] text-[#8492A6] font-medium mt-0.5">
              (Auto Calculated)
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-gray-200 text-gray-600 bg-white rounded-xl text-[14px] font-bold shadow-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-[#4285F4] text-white rounded-xl text-[14px] font-bold shadow-sm hover:bg-[#357AE8] transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditResultModal;
