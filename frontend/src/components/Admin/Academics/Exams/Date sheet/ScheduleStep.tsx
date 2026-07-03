import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  Clock,
  Plus,
  Trash2,
  Info,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../../../../../lib/api";

export interface ScheduleRow {
  id: string;
  date: string;
  subjectId: string;
  subjectName: string;
  syllabus: string;
  title: string;
  startTime: string;
  endTime: string;
  maxMarks: string;
}

interface SubjectOption {
  id: string;
  name: string;
  code: string;
}

interface ScheduleStepProps {
  classId: string;
  scheduleRows: ScheduleRow[];
  setScheduleRows: Dispatch<SetStateAction<ScheduleRow[]>>;
  onBack: () => void;
  onNext: () => void;
}

const TIME_SLOTS = [
  { label: "08:30 AM - 11:30 AM", start: "08:30 AM", end: "11:30 AM" },
  { label: "09:00 AM - 12:00 PM", start: "09:00 AM", end: "12:00 PM" },
  { label: "10:00 AM - 01:00 PM", start: "10:00 AM", end: "01:00 PM" },
  { label: "01:00 PM - 04:00 PM", start: "01:00 PM", end: "04:00 PM" },
];

export default function ScheduleStep({
  classId,
  scheduleRows,
  setScheduleRows,
  onBack,
  onNext,
}: ScheduleStepProps) {
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!classId) return;
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/api/academic/subjects?classId=${classId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.data.success) setSubjects(res.data.data);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, [classId]);

  const handleAddRow = () => {
    const newRow: ScheduleRow = {
      id: Math.random().toString(36).substring(2, 9),
      date: "",
      subjectId: "",
      subjectName: "",
      title: "",
      syllabus: "",
      startTime: "09:00 AM",
      endTime: "12:00 PM",
      maxMarks: "100",
    };
    setScheduleRows((prev) => [...prev, newRow]);
  };

  const handleUpdateRow = (
    id: string,
    field: keyof ScheduleRow,
    value: string,
  ) => {
    setScheduleRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const handleSubjectChange = (rowId: string, subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    setScheduleRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? { ...row, subjectId, subjectName: subject?.name ?? "" }
          : row,
      ),
    );
  };

  const handleTimeSlotChange = (rowId: string, label: string) => {
    const slot = TIME_SLOTS.find((s) => s.label === label);
    if (slot) {
      setScheduleRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? { ...row, startTime: slot.start, endTime: slot.end }
            : row,
        ),
      );
    }
  };

  const handleDeleteRow = (id: string) => {
    if (scheduleRows.length <= 1) {
      alert("At least one exam slot is required.");
      return;
    }
    setScheduleRows((prev) => prev.filter((row) => row.id !== id));
  };

  const handleNext = () => {
    for (let i = 0; i < scheduleRows.length; i++) {
      const row = scheduleRows[i];
      if (!row.subjectId) {
        setError(`Row ${i + 1}: Please select a subject.`);
        return;
      }
      if (!row.title.trim()) {
        setError(`Row ${i + 1}: Please enter an exam title.`);
        return;
      }
      if (!row.date) {
        setError(`Row ${i + 1}: Please select a date.`);
        return;
      }
    }
    setError(null);
    onNext();
  };

  const getSelectedTimeSlotLabel = (row: ScheduleRow) => {
    const slot = TIME_SLOTS.find(
      (s) => s.start === row.startTime && s.end === row.endTime,
    );
    return slot?.label ?? "custom";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Info Banner */}
      <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex gap-3 text-sm text-blue-800">
        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="flex-1 leading-relaxed">
          <p className="font-semibold mb-0.5">Exam Scheduling Guidelines</p>
          <p className="text-blue-700/90 text-xs">
            Add one row per exam paper. Ensure dates are in sequential order.
            Each row needs a title, subject, date and time.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600 font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Table Card */}
      <div className="border border-gray-100 rounded-2xl bg-white shadow-xs overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#4285F4]" />
            <h3 className="font-bold text-gray-900 text-[15px]">
              Schedule Exam Papers
            </h3>
            <span className="text-xs text-gray-400 font-medium">
              — {scheduleRows.length} papers
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/30">
                <th className="py-3 px-3 w-10 text-center">No.</th>
                <th className="py-3 px-3 w-36">Date</th>
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3">Exam Title</th>
                <th className="py-3 px-3">Syllabus</th>
                <th className="py-3 px-3 w-48">Time Slot</th>
                <th className="py-3 px-3 w-24">Max Marks</th>
                <th className="py-3 px-3 w-10 text-center">Del</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {scheduleRows.map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-50/40 transition">
                  {/* No. */}
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-[11px] font-bold">
                      {index + 1}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-3">
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) =>
                        handleUpdateRow(row.id, "date", e.target.value)
                      }
                      className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] font-medium text-gray-800 bg-white transition"
                    />
                  </td>

                  {/* Subject */}
                  <td className="py-3 px-3">
                    <div className="relative">
                      <select
                        value={row.subjectId}
                        onChange={(e) =>
                          handleSubjectChange(row.id, e.target.value)
                        }
                        disabled={loadingSubjects}
                        className="w-full border border-gray-200 rounded-lg px-2 py-2 pr-7 text-xs focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] font-medium text-gray-800 bg-white transition appearance-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="">
                          {loadingSubjects ? "Loading..." : "Select Subject"}
                        </option>
                        {subjects.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                    </div>
                  </td>

                  {/* Exam Title */}
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={row.title}
                      onChange={(e) =>
                        handleUpdateRow(row.id, "title", e.target.value)
                      }
                      placeholder="e.g. English Mid Term Exam"
                      className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] font-medium text-gray-800 bg-white transition"
                    />
                  </td>

                  {/* Syllabus */}
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={row.syllabus}
                      onChange={(e) =>
                        handleUpdateRow(row.id, "syllabus", e.target.value)
                      }
                      placeholder="e.g. Chapter 1, 2, 3"
                      className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] font-medium text-gray-800 bg-white transition"
                    />
                  </td>

                  {/* Time Slot */}
                  <td className="py-3 px-3">
                    <div className="relative">
                      <select
                        value={getSelectedTimeSlotLabel(row)}
                        onChange={(e) => {
                          if (e.target.value === "custom") {
                            handleUpdateRow(row.id, "startTime", "");
                            handleUpdateRow(row.id, "endTime", "");
                          } else {
                            handleTimeSlotChange(row.id, e.target.value);
                          }
                        }}
                        className="w-full border border-gray-200 rounded-lg px-2 py-2 pr-7 text-xs focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] font-medium text-gray-800 bg-white transition appearance-none cursor-pointer"
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot.label} value={slot.label}>
                            {slot.label}
                          </option>
                        ))}
                        <option value="custom">Custom Timing</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                    </div>
                    {getSelectedTimeSlotLabel(row) === "custom" && (
                      <div className="flex gap-1 mt-1">
                        <input
                          type="text"
                          value={row.startTime}
                          placeholder="Start"
                          onChange={(e) =>
                            handleUpdateRow(row.id, "startTime", e.target.value)
                          }
                          className="w-1/2 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#4285F4] font-medium text-gray-800"
                        />
                        <input
                          type="text"
                          value={row.endTime}
                          placeholder="End"
                          onChange={(e) =>
                            handleUpdateRow(row.id, "endTime", e.target.value)
                          }
                          className="w-1/2 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#4285F4] font-medium text-gray-800"
                        />
                      </div>
                    )}
                  </td>

                  {/* Max Marks */}
                  <td className="py-3 px-3">
                    <input
                      type="number"
                      value={row.maxMarks}
                      placeholder="100"
                      onChange={(e) =>
                        handleUpdateRow(row.id, "maxMarks", e.target.value)
                      }
                      className="w-full border border-gray-200 rounded-lg px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] font-medium text-gray-800 bg-white transition"
                    />
                  </td>

                  {/* Delete */}
                  <td className="py-3 px-3 w-12 text-center">
                    <button
                      onClick={() => handleDeleteRow(row.id)}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/20">
          <button
            onClick={handleAddRow}
            className="inline-flex items-center gap-1.5 px-4 py-2 hover:bg-gray-100 text-gray-600 font-semibold text-xs rounded-xl border border-gray-200 transition cursor-pointer"
          >
            <Plus className="h-4 w-4 text-gray-500" /> Add Row
          </button>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl border border-gray-200 transition bg-white cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO CONFIGURATION
        </button>
        <button
          onClick={handleNext}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#4285F4] hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition shadow-md shadow-blue-500/10 cursor-pointer"
        >
          NEXT: PREVIEW & PUBLISH <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
