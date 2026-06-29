import { useState } from "react";
import axios from "axios";
import AdminSidebar from "../../../../components/Admin/sidebar";
import AdminNavbar from "../../../../components/Admin/Navbar";
import ExamTermStep from "../../../../components/Admin/Academics/Exams/Date sheet/ExamTermStep";
import ConfigureStep from "../../../../components/Admin/Academics/Exams/Date sheet/ConfigureStep";
import ScheduleStep from "../../../../components/Admin/Academics/Exams/Date sheet/ScheduleStep";
import type { ScheduleRow } from "../../../../components/Admin/Academics/Exams/Date sheet/ScheduleStep";
import PreviewStep from "../../../../components/Admin/Academics/Exams/Date sheet/PreviewStep";
import {
  Calendar,
  Settings,
  Eye,
  BookOpen,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";

export default function Datesheet() {
  const [activeStep, setActiveStep] = useState<number>(1);

  // Step 1 — Exam Term
  const [termName, setTermName] = useState("");
  const [termId, setTermId] = useState("");

  // Step 2 — Configure
  const [title, setTitle] = useState("");
  const [academicYear, setAcademicYear] = useState("2024-25");
  const [reportingTime, setReportingTime] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedClassName, setSelectedClassName] = useState("");

  // Step 3 — Schedule
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>([
    {
      id: "1",
      date: "",
      subjectId: "",
      subjectName: "",
      title: "",
      startTime: "09:00 AM",
      endTime: "12:00 PM",
      maxMarks: "100",
      syllabus: "",
    },
  ]);

  // Publish state
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    setPublishError(null);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        termId,
        classId: selectedClassId,
        instruction: instructions.trim() || null,
        exams: scheduleRows.map((row) => ({
          subjectId: row.subjectId,
          title: row.title,
          syllabus: row.syllabus || null,
          examDate: row.date,
          startTime: row.startTime || null,
          endTime: row.endTime || null,
          totalMarks: row.maxMarks ? Number(row.maxMarks) : 100,
        })),
      };

      const res = await axios.post(
        "http://localhost:5000/api/exams/publish",
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setIsSuccessModalOpen(true);
      } else {
        setPublishError(
          res.data.message || "Publish failed. Please try again.",
        );
      }
    } catch (err: any) {
      setPublishError(
        err.response?.data?.message || "Error connecting to server.",
      );
    } finally {
      setPublishing(false);
    }
  };

  const handleReset = () => {
    setTermName("");
    setTermId("");
    setTitle("");
    setAcademicYear("2024-25");
    setReportingTime("");
    setInstructions("");
    setSelectedClassId("");
    setSelectedClassName("");
    setScheduleRows([
      {
        id: "1",
        date: "",
        subjectId: "",
        subjectName: "",
        title: "",
        startTime: "09:00 AM",
        endTime: "12:00 PM",
        maxMarks: "100",
        syllabus: "",
      },
    ]);
    setPublishError(null);
    setActiveStep(1);
    setIsSuccessModalOpen(false);
  };

  const steps = [
    {
      num: 1,
      label: "Add Exam Term",
      icon: <BookOpen className="h-3.5 w-3.5" />,
    },
    { num: 2, label: "Configure", icon: <Settings className="h-3.5 w-3.5" /> },
    { num: 3, label: "Schedule", icon: <Calendar className="h-3.5 w-3.5" /> },
    {
      num: 4,
      label: "Preview & Publish",
      icon: <Eye className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex flex-col gap-5 max-w-7xl mx-auto pb-12">
            {/* Page Title */}
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-bold text-gray-950 tracking-tight">
                Date Sheet
              </h1>
              <p className="text-[11px] text-gray-500 font-medium">
                Create standardized date sheet
              </p>
            </div>

            {/* Main Card */}
            <div className="w-full bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
              {/* Card Header */}
              <div className="p-5 flex items-center justify-between border-b border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50/60 flex items-center justify-center border border-blue-100 shrink-0">
                    <Calendar className="h-5 w-5 text-[#4285F4]" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-[15px] font-bold text-gray-950 leading-snug">
                      Exam Datesheet Generator
                    </h2>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Configure, schedule, and publish your exam timetable
                    </p>
                  </div>
                </div>
                <span className="px-3.5 py-1.5 bg-blue-50 text-[#4285F4] border border-blue-100 rounded-full text-[11px] font-bold tracking-wide uppercase">
                  {termName || title || "New Datesheet"}
                </span>
              </div>

              {/* Stepper Tabs */}
              <div className="border-b border-gray-200 px-5 flex items-center gap-6 text-sm font-semibold text-gray-500 bg-white">
                {steps.map((step) => (
                  <button
                    key={step.num}
                    onClick={() => setActiveStep(step.num)}
                    className={`flex items-center gap-2 py-3 border-b-2 font-bold text-[12px] cursor-pointer focus:outline-none transition ${
                      activeStep === step.num
                        ? "border-[#4285F4] text-[#4285F4]"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {step.icon} {step.num}. {step.label}
                  </button>
                ))}
              </div>

              {/* Step Content */}
              <div className="p-6">
                {activeStep === 1 && (
                  <ExamTermStep
                    termName={termName}
                    setTermName={setTermName}
                    setTermId={setTermId}
                    onNext={() => setActiveStep(2)}
                  />
                )}

                {activeStep === 2 && (
                  <ConfigureStep
                    termName={termName}
                    title={title || termName}
                    setTitle={setTitle}
                    academicYear={academicYear}
                    setAcademicYear={setAcademicYear}
                    reportingTime={reportingTime}
                    setReportingTime={setReportingTime}
                    instructions={instructions}
                    setInstructions={setInstructions}
                    selectedClassId={selectedClassId}
                    setSelectedClassId={setSelectedClassId}
                    selectedClassName={selectedClassName}
                    setSelectedClassName={setSelectedClassName}
                    onBack={() => setActiveStep(1)}
                    onNext={() => setActiveStep(3)}
                  />
                )}

                {activeStep === 3 && (
                  <ScheduleStep
                    classId={selectedClassId}
                    scheduleRows={scheduleRows}
                    setScheduleRows={setScheduleRows}
                    onBack={() => setActiveStep(2)}
                    onNext={() => setActiveStep(4)}
                  />
                )}

                {activeStep === 4 && (
                  <>
                    {publishError && (
                      <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600 font-medium">
                        ⚠️ {publishError}
                      </div>
                    )}
                    <PreviewStep
                      title={title || termName}
                      academicYear={academicYear}
                      reportingTime={reportingTime}
                      instructions={instructions}
                      selectedClasses={[selectedClassName]}
                      selectedSections={[]}
                      scheduleRows={scheduleRows.map((r) => ({
                        id: r.id,
                        date: r.date,
                        subject: r.subjectName,
                        title: r.title,
                        timeSlot:
                          r.startTime && r.endTime
                            ? `${r.startTime} – ${r.endTime}`
                            : "",
                        duration: "",
                        maxMarks: r.maxMarks,
                        syllabus: r.syllabus || "",
                      }))}
                      onBack={() => setActiveStep(3)}
                      onPublish={handlePublish}
                    />
                    {publishing && (
                      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl p-6 flex items-center gap-3 shadow-xl">
                          <Loader2 className="h-5 w-5 animate-spin text-[#4285F4]" />
                          <span className="text-sm font-semibold text-gray-700">
                            Publishing datesheet...
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs"
            onClick={() => setIsSuccessModalOpen(false)}
          />
          <div className="bg-white rounded-3xl border border-gray-100 max-w-md w-full p-8 shadow-2xl relative z-10 flex flex-col items-center text-center">
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-lg transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-5 border border-green-100">
              <CheckCircle2 className="h-9 w-9 text-green-500" />
            </div>

            <h3 className="text-xl font-bold text-gray-950 mb-2">
              Datesheet Published!
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              The datesheet{" "}
              <strong className="text-gray-800">"{title || termName}"</strong>{" "}
              for <strong className="text-gray-800">{selectedClassName}</strong>{" "}
              has been successfully published. Students and teachers will see it
              in their exam pages.
            </p>

            <div className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-6 text-left text-xs text-gray-600 flex flex-col gap-2 font-medium">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span>Exam Term:</span>
                <span className="text-gray-950 font-bold">{termName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span>Class:</span>
                <span className="text-gray-950 font-bold">
                  {selectedClassName}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Scheduled Exams:</span>
                <span className="text-gray-950 font-bold">
                  {scheduleRows.length} Papers
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={handleReset}
                className="w-full py-3 bg-[#4285F4] hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Create Another Datesheet
              </button>
              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
