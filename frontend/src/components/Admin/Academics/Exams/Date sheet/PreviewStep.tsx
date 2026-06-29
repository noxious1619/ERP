import { Printer, Download, ArrowLeft, Send } from "lucide-react";
interface PreviewStepProps {
  title: string;
  academicYear: string;
  reportingTime: string;
  instructions: string;
  selectedClasses: string[];
  selectedSections: string[];
  scheduleRows: PreviewRow[];
  onBack: () => void;
  onPublish: () => void;
}

interface PreviewRow {
  id: string;
  date: string;
  subject: string;
  title: string;
  syllabus: string; // add this
  timeSlot: string;
  duration: string;
  maxMarks: string;
}

export default function PreviewStep({
  title,
  academicYear,
  reportingTime,
  instructions,
  selectedClasses,
  selectedSections,
  scheduleRows,
  onBack,
  onPublish,
}: PreviewStepProps) {
  const totalMaxMarks = scheduleRows.reduce((acc, curr) => {
    const marks = Number(curr.maxMarks);
    return isNaN(marks) ? acc : acc + marks;
  }, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    alert("Exporting Datesheet to PDF format...");
  };

  // Format date helper: e.g. "2026-06-16" -> "Tue, Jun 16, 2026"
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return dateStr;
      return dateObj.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Action Buttons Top Bar */}
      <div className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 shadow-3xs">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Datesheet Preview Draft
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-xs rounded-lg transition shadow-3xs cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-gray-500" /> PRINT DATESHEET
          </button>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-xs rounded-lg transition shadow-3xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-gray-500" /> EXPORT PDF
          </button>
        </div>
      </div>

      {/* Printable Sheet Card */}
      <div className="border border-gray-150 rounded-2xl bg-white shadow-md overflow-hidden max-w-4xl mx-auto w-full print:border-none print:shadow-none">
        {/* Document Header Blue Banner */}
        <div className="bg-[#4285F4] text-white p-8 text-center relative overflow-hidden">
          {/* Subtle design accents */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full -ml-12 -mb-12 pointer-events-none" />

          <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-2 inline-block">
            Official Academic Document
          </span>
          <h2 className="text-2xl font-black tracking-tight uppercase">
            {title
              ? `${title} Examination Datesheet`
              : "General Examination Datesheet"}
          </h2>
          <p className="text-blue-100 text-sm mt-1.5 font-medium">
            Academic Session: {academicYear || "N/A"}
          </p>
        </div>

        {/* Info Grid Block */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-8 py-5 border-b border-gray-100 bg-gray-50/50 text-xs">
          <div>
            <p className="text-gray-400 font-bold uppercase tracking-wider mb-0.5">
              Classes Included
            </p>
            <p className="text-gray-800 font-semibold">
              {selectedClasses.join(", ") || "None Selected"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase tracking-wider mb-0.5">
              Sections
            </p>
            <p className="text-gray-800 font-semibold">
              {selectedSections.join(", ") || "None Selected"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase tracking-wider mb-0.5">
              Reporting Time
            </p>
            <p className="text-gray-800 font-semibold">
              {reportingTime || "Not Specified"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase tracking-wider mb-0.5">
              Total Papers
            </p>
            <p className="text-gray-800 font-semibold">
              {scheduleRows.length} Exams scheduled
            </p>
          </div>
        </div>

        {/* Table Content */}
        <div className="px-8 py-6">
          <table className="w-full text-left border-collapse text-xs border border-gray-100 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 w-12 text-center">No.</th>
                <th className="py-3 px-4">Date & Day</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Time Slot</th>
                <th className="py-3 px-4 text-center">Duration</th>
                <th className="py-3 px-4 text-center">Max Marks</th>
                <th className="py-3 px-4">Syllabus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {scheduleRows.map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-50/20">
                  <td className="py-3 px-4 text-center font-bold text-gray-400">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {formatDate(row.date)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#4285F4]">
                    {row.subject}
                  </td>
                  <td className="py-3 px-4">{row.timeSlot}</td>
                  <td className="py-3 px-4 text-center font-medium">
                    {row.duration}
                  </td>
                  <td className="py-3 px-4 text-center font-bold">
                    {row.maxMarks}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-600">
                    {row.syllabus || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Table Totals Summary Bar */}
          <div className="flex justify-end items-center gap-6 mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-semibold text-gray-600">
            <span>
              Total Papers:{" "}
              <strong className="text-gray-900">{scheduleRows.length}</strong>
            </span>
            <span>
              Total Weightage:{" "}
              <strong className="text-gray-900">{totalMaxMarks} Marks</strong>
            </span>
          </div>

          {/* Instructions Block */}
          {instructions && (
            <div className="mt-8 border border-amber-100 bg-amber-50/35 rounded-xl p-5">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2.5">
                Instructions for Candidates
              </h4>
              <p className="text-xs text-amber-900/90 whitespace-pre-wrap leading-relaxed font-medium">
                {instructions}
              </p>
            </div>
          )}

          {/* Signatures Row */}
          <div className="mt-12 pt-8 border-t border-dashed border-gray-100 flex justify-between items-end text-xs text-gray-400 font-medium">
            <div>
              <p className="mb-1">
                Generated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p>Academic Office Administration</p>
            </div>
            <div className="text-right">
              <div className="w-40 border-b border-gray-300 mb-1.5" />
              <p className="font-semibold text-gray-700">
                Controller of Examinations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3 hover:bg-gray-150 text-gray-700 font-semibold text-sm rounded-xl border border-gray-200 transition bg-white cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO EXAM SCHEDULE
        </button>

        <button
          onClick={onPublish}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#4285F4] hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition shadow-md shadow-blue-500/10 cursor-pointer"
        >
          <Send className="h-4 w-4" /> PUBLISH DATESHEET
        </button>
      </div>
    </div>
  );
}
