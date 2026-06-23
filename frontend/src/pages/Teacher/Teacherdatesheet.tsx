import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Teacher/Dashboard/Navbar";
import Calendar from "../../components/Student/Dashboard/Calendar";
import TeacherUpcomingExams from "../../components/Teacher/Exam/Teacherupcomingexams";
import type { ExamData } from "../../components/Teacher/Exam/Teacherupcomingexams";
import { getDynamicHeaderDate } from "../../utils/dateHelpers";
import { downloadDatesheetPdf } from "../../utils/Downloaddatesheet";

// ─── Types ───────────────────────────────────────────────────────────────────
interface ClassOption {
  id: string;
  name: string;
}

const MY_SUBJECT = "__MY_SUBJECT__";

// ─── Instruction popup ───────────────────────────────────────────────────────
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
          transition hover:scale-[1.01]
        "
      >
        Got it
      </button>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const TeacherDatesheet = () => {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [profileLoading, setProfileLoading] = useState(true);

  const [termName, setTermName] = useState<string | null>(null);
  const [instruction, setInstruction] = useState<string | null>(null);
  const [showInstruction, setShowInstruction] = useState(false);
  const [examList, setExamList] = useState<ExamData[]>([]);

  // ── Fetch teacher profile on mount ───────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/teachers/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const { teachingAssignments } = res.data.data as {
            teachingAssignments: {
              id: string;
              section: {
                id: string;
                name: string;
                academicClass: { id: string; name: string };
              };
              subject: { id: string; name: string; code: string };
            }[];
          };

          const classMap = new Map<string, ClassOption>();
          teachingAssignments.forEach((assignment) => {
            const cls = assignment.section.academicClass;
            if (!classMap.has(cls.id)) {
              classMap.set(cls.id, { id: cls.id, name: cls.name });
            }
          });

          const classArr = Array.from(classMap.values());
          setClasses(classArr);
          setSelectedValue(MY_SUBJECT);
        }
      } catch (err) {
        console.error("[TeacherDatesheet] profile fetch failed:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────
  const isMySubject = selectedValue === MY_SUBJECT;
  const resolvedClassId = isMySubject ? (classes[0]?.id ?? "") : selectedValue;
  const loadedLabel = isMySubject
    ? "My Subject"
    : (classes.find((c) => c.id === selectedValue)?.name ?? "");
  const headingText = termName ? `${termName} · ${loadedLabel}` : loadedLabel;

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
      filterLabel: loadedLabel,
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
        {/* ── LEFT ────────────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col h-screen">
          <div className="px-14  shrink-0 py-6">
            <h1 className="text-[44px] font-[700] leading-[54px] tracking-[-1.8px] text-[#2D3335]">
              Exam Date Sheet
            </h1>
            <p className="text-sm font-semibold text-gray-400 mt-1">
              {getDynamicHeaderDate()}
            </p>

            {!profileLoading && (
              <div className="mt-8 flex items-center gap-3 mx-auto justify-center">
                <div className="relative">
                  <select
                    value={selectedValue}
                    onChange={(e) => {
                      setSelectedValue(e.target.value);
                      setTermName(null);
                      setInstruction(null);
                      setExamList([]);
                    }}
                    className="
                      appearance-none h-[40px] pl-4 pr-9
                      rounded-full border border-[#D8DCE6]
                      bg-white text-[14px] font-semibold text-[#484848]
                      focus:outline-none focus:ring-2 focus:ring-[#4285F4]/30
                      cursor-pointer
                    "
                  >
                    <option value={MY_SUBJECT}>My Subject</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 4l4 4 4-4"
                        stroke="#484848"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {instruction && (
                  <button
                    onClick={() => setShowInstruction(true)}
                    className="
                      flex h-[40px] w-[40px] items-center justify-center
                      rounded-full border border-[#D8DCE6] bg-white
                      text-[#4285F4] transition hover:bg-[#EEF2FF]
                    "
                    title="View instructions"
                  >
                    <svg
                      width="18"
                      height="18"
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
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-14 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex justify-center">
              {selectedValue && resolvedClassId ? (
                <div className="w-full max-w-[90%] xl:max-w-[95%] 2xl:max-w-full">
                  <p className="mb-6 text-[18px] font-[600] text-[#484747]">
                    {headingText}
                  </p>
                  <TeacherUpcomingExams
                    classId={resolvedClassId}
                    subjectOnly={isMySubject}
                    onMetaReady={handleMetaReady}
                  />
                </div>
              ) : (
                !profileLoading && (
                  <div className="mt-16 flex flex-col items-center gap-3 text-center">
                    <div className="h-14 w-14 rounded-full bg-[#EEF2FF] flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#4285F4"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                    </div>
                    <p className="text-[15px] font-semibold text-[#484848]">
                      Select a filter to view the exam schedule
                    </p>
                    <p className="text-[13px] text-gray-400">
                      Exam schedule will appear here
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ──────────────────────────────────────────────── */}
        <div className="w-[360px] shrink-0 bg-gray-100 mr-2 ml-2 sticky top-0 h-screen flex flex-col">
          <div className="px-2 py-4 pt-12 shrink-0" />

          <div className="flex-1 overflow-y-auto px-6 pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col gap-6">
              <Calendar variant="timetable" />

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
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
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

export default TeacherDatesheet;
