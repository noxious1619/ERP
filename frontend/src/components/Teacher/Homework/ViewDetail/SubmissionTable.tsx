import { useNavigate } from "react-router-dom";

// 1. Define exactly what the backend is sending us
export interface SubmissionRecord {
  assignmentId: string;
  studentId: string;
  rollNo: string;
  name: string;
  submittedOn: string | null;
  status: "SUBMITTED" | "LATE" | "MISSING";
  marks: number | null;
  result: "Pass" | "Fail" | null;
  submissionId: string | null;
}

interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface SubmissionTableProps {
  submissions: SubmissionRecord[];
  pagination?: PaginationData;
  onPageChange: (page: number) => void;
}

// 2. Updated to match the uppercase statuses from the DB
const statusDot: Record<string, string> = {
  SUBMITTED: "bg-green-500",
  LATE: "bg-yellow-400",
  MISSING: "bg-red-500",
};

// Helper to format the ISO date string from the database
const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const COLS = "grid-cols-[140px_2fr_2fr_1fr_1fr_1.5fr]";

// 3. Receive the dynamic data as props
const SubmissionTable = ({
  submissions,
  pagination,
  onPageChange,
}: SubmissionTableProps) => {
  const navigate = useNavigate();

  // If there's no data, show a clean empty state
  if (!submissions || submissions.length === 0) {
    return (
      <div className="w-full bg-white rounded-[10px] border border-[#EAECF0] py-16 flex items-center justify-center">
        <p className="text-[14px] text-gray-400">
          No submissions found for this filter.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
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
        {submissions.map((s) => (
          <div
            key={s.studentId}
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
              {s.submittedOn ? (
                formatDateTime(s.submittedOn)
              ) : (
                <span className="text-gray-300">–</span>
              )}
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
                <span className="text-gray-300 text-[14px]">
                  {s.status === "MISSING" ? "–" : "Pending"}
                </span>
              )}
            </div>

            <span
              className={`text-[14px] font-medium ${s.result === "Fail" ? "text-[#A8364B]" : "text-gray-800"}`}
            >
              {s.marks !== null ? (
                s.marks
              ) : (
                <span className="text-gray-300">–</span>
              )}
            </span>

            <div>
              {s.submissionId && (
                <button
                  onClick={() => {
                    navigate(`/teacher/homework/submission/${s.submissionId}`);
                  }}
                >
                  View Submission
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-5">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 h-[36px] rounded-lg border border-[#EAECF0] text-[13px] text-gray-500 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-[36px] h-[36px] rounded-lg text-[13px] font-semibold cursor-pointer ${
                  p === pagination.page
                    ? "bg-[#4D8DFF] text-white"
                    : "border border-[#EAECF0] text-gray-500 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ),
          )}

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 h-[36px] rounded-lg border border-[#EAECF0] text-[13px] text-gray-500 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmissionTable;
