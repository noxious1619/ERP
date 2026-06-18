import { useState } from "react";
import Navbar from "../../components/Student/Dashboard/Navbar";
import RightExamHeader from "../../components/Student/Exam/RightExamHeader";
import Calendar from "../../components/Student/Dashboard/Calendar";
import CalendarMessageCard from "../../components/Student/Dashboard/CalendarMessageCard";
import UpcomingExams from "../../components/Student/Exam/UpcomingExams";
import { getDynamicHeaderDate } from "../../utils/dateHelpers";
import { downloadDatesheetPdf } from "../../utils/Downloaddatesheet";
import type { ExamData } from "../../components/Student/Exam/UpcomingExams";

// ─── Instruction popup ────────────────────────────────────────────────────────
const InstructionPopup = ({
  instruction,
  onClose,
}: {
  instruction: string;
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="relative mx-4 w-full max-w-md rounded-[24px] bg-white p-8 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF]">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4285F4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </div>
        <h3 className="text-[18px] font-[700] text-[#2D3335]">Instructions</h3>
      </div>
      <p className="text-[14px] leading-[22px] text-[#484848]">{instruction}</p>
      <button
        onClick={onClose}
        className="
          mt-6 w-full rounded-full bg-[#4285F4] py-3
          text-[14px] font-semibold text-white
          shadow-[0px_6px_14px_rgba(66,133,244,0.3)]
          transition hover:scale-[1.01] cursor-pointer
        "
      >
        Got it
      </button>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const Exam = () => {
  const [termName, setTermName] = useState<string | null>(null);
  const [instruction, setInstruction] = useState<string | null>(null);
  const [showInstruction, setShowInstruction] = useState(false);
  const [examList, setExamList] = useState<ExamData[]>([]);

  const handleMetaReady = (
    tn: string,
    ins: string | null,
    exams: ExamData[],
  ) => {
    setTermName(tn);
    setInstruction(ins);
    setExamList(exams);
  };

  const handleDownload = () => {
    if (!examList.length) return;
    downloadDatesheetPdf({
      exams: examList,
      termName: termName ?? "Exam",
      filterLabel: "My Class",
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />

      {showInstruction && instruction && (
        <InstructionPopup
          instruction={instruction}
          onClose={() => setShowInstruction(false)}
        />
      )}

      <div className="flex flex-1 h-screen">
        {/* LEFT CONTENT */}
        <div className="flex flex-1 flex-col h-screen">
          {/* Sticky Left Header */}
          <div className="px-14 pt-10 shrink-0">
            <h1 className="text-[44px] font-[700] leading-[54px] tracking-[-1.8px] text-[#2D3335]">
              Exam & Result
            </h1>
            <p className="text-sm font-semibold text-gray-400 mt-1">
              {getDynamicHeaderDate()}
            </p>

            {/* "Upcoming Exams" heading + instruction icon */}
            <div className="mt-10 flex items-center gap-3">
              <p className="text-[18px] font-[600] text-[#484747]">
                Upcoming Exams
              </p>
              {instruction && (
                <button
                  onClick={() => setShowInstruction(true)}
                  className="
                    flex h-[32px] w-[32px] items-center justify-center
                    rounded-full border border-[#D8DCE6] bg-white
                    text-[#4285F4] transition hover:bg-[#EEF2FF] cursor-pointer
                  "
                  title="View instructions"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Scrollable Left Body */}
          <div className="flex-1 overflow-y-auto px-14 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex justify-center">
              <UpcomingExams onMetaReady={handleMetaReady} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[360px] shrink-0 bg-gray-100 mr-2 ml-2 sticky top-0 h-screen flex flex-col">
          {/* Sticky Right Header */}
          <div className="px-2 py-4 pt-12 shrink-0">
            <RightExamHeader />
          </div>

          {/* Scrollable Right Body */}
          <div className="flex-1 overflow-y-auto px-6 pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col gap-6">
              <Calendar />

              <CalendarMessageCard />

              {/* Download Datesheet — disabled until data is loaded */}
              <button
                onClick={handleDownload}
                disabled={examList.length === 0}
                className="
                  mt-2 h-[56px] w-full rounded-full bg-[#3F6EF6]
                  shadow-[0px_8px_18px_rgba(63,110,246,0.35)]
                  flex items-center justify-center gap-3
                  text-white font-semibold text-[16px]
                  transition-all duration-200 hover:scale-[1.01]
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer
                "
              >
                <span>Download Datesheet</span>
                <div className="w-7 h-7 rounded-full border border-white flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v12" />
                    <path d="M7 10l5 5 5-5" />
                    <path d="M5 21h14" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
