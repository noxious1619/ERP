import { useNavigate } from "react-router-dom";

type SubmissionStatus = "submitted" | "late" | "missing";

interface Student {
  rollNo: string;
  name: string;
  submittedOn: string | null;
  status: SubmissionStatus;
  result: "Pass" | "Fail" | null;
  marks: string | null;
}

const students: Student[] = [
  {
    rollNo: "01",
    name: "Aarav Sharma",
    submittedOn: "2026-05-25 (10:30 AM)",
    status: "submitted",
    result: "Pass",
    marks: "20/20",
  },
  {
    rollNo: "02",
    name: "Diya Patel",
    submittedOn: "2026-05-24 (03:45 PM)",
    status: "submitted",
    result: "Fail",
    marks: "08/20",
  },
  {
    rollNo: "03",
    name: "Arjun Mehta",
    submittedOn: "2026-05-27 (11:15 AM)",
    status: "late",
    result: "Pass",
    marks: "15/20",
  },
  {
    rollNo: "04",
    name: "Ananya Reddy",
    submittedOn: null,
    status: "missing",
    result: null,
    marks: null,
  },
  {
    rollNo: "05",
    name: "Vihaan Kumar",
    submittedOn: "2026-05-25 (02:20 PM)",
    status: "submitted",
    result: "Pass",
    marks: "17/20",
  },
  {
    rollNo: "06",
    name: "Saanvi Gupta",
    submittedOn: "2026-05-28 (09:00 AM)",
    status: "late",
    result: "Pass",
    marks: "16/20",
  },
  {
    rollNo: "07",
    name: "Reyansh Singh",
    submittedOn: null,
    status: "missing",
    result: null,
    marks: null,
  },
  {
    rollNo: "08",
    name: "Isha Joshi",
    submittedOn: "2026-05-26 (08:30 AM)",
    status: "submitted",
    result: "Pass",
    marks: "19/20",
  },
];

const statusDot: Record<SubmissionStatus, string> = {
  submitted: "bg-green-500",
  late: "bg-yellow-400",
  missing: "bg-red-500",
};

// Single source of truth for column sizing
const COLS = "grid-cols-[140px_2fr_2fr_1fr_1fr_1.5fr]";

const SubmissionTable = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full ">
      {/* Table header */}
      <div
        className={`grid ${COLS} px-14 py-3 bg-indigo-50 rounded-t-[10px] border border-[#EAECF0]`}
      >
        {[
          "Roll no.",
          "Student Name",
          "Submitted On",
          "Status",
          "Marks",
          "Actions",
        ].map((h) => (
          <span key={h} className="text-[13px] font-semibold text-gray-500">
            {h}
          </span>
        ))}
      </div>

      {/* Table rows */}
      <div className="border-l border-r border-[#EAECF0] bg-white rounded-b-[10px] overflow-hidden">
        {students.map((s) => (
          <div
            key={s.rollNo}
            className={`grid ${COLS} px-14 py-4 items-center border-b border-[#EAECF0] hover:bg-[#F8F9FE] transition-colors`}
          >
            <span className="text-[14px] text-gray-500">{s.rollNo}</span>

            <div className="flex items-center gap-2.5">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${statusDot[s.status]}`}
              />
              <span className="text-[14px] font-medium text-gray-800">
                {s.name}
              </span>
            </div>

            <span className="text-[14px] text-gray-500">
              {s.submittedOn ?? <span className="text-gray-300">–</span>}
            </span>

            <div>
              {s.result ? (
                <span
                  className={`inline-block px-3 py-1 rounded-full text-[12px] font-semibold border ${
                    s.result === "Pass"
                      ? "bg-green-50 text-green-600 border-green-200"
                      : "bg-red-50 text-red-500 border-red-200"
                  }`}
                >
                  {s.result}
                </span>
              ) : (
                <span className="text-gray-300 text-[14px]">–</span>
              )}
            </div>

            <span
              className={`text-[14px] font-medium ${s.result === "Fail" ? "text-[#A8364B]" : "text-gray-800"}`}
            >
              {s.marks ?? <span className="text-gray-300">–</span>}
            </span>

            <div>
              {s.submittedOn && (
                <button
                  onClick={() => navigate("/teacher/homework/submission")}
                  className="text-[13px] font-semibold text-[#4D8DFF] hover:underline tracking-wide cursor-pointer"
                >
                  View Submission
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-2 mt-5">
        <button className="px-4 h-[36px] rounded-lg border border-[#EAECF0] text-[13px] text-gray-500 hover:bg-gray-50">
          Previous
        </button>
        {[1, 2, 3].map((p) => (
          <button
            key={p}
            className={`w-[36px] h-[36px] rounded-lg text-[13px] font-semibold ${
              p === 1
                ? "bg-[#4D8DFF] text-white"
                : "border border-[#EAECF0] text-gray-500 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}
        <button className="px-4 h-[36px] rounded-lg border border-[#EAECF0] text-[13px] text-gray-500 hover:bg-gray-50">
          Next
        </button>
      </div>
    </div>
  );
};

export default SubmissionTable;
