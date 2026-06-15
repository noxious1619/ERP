import { useEffect, useState } from "react";
import axios from "axios";
import ExamCard from "../../../components/Student/Exam/ExamCard";

// ─── Types ───────────────────────────────────────────────────────────────────
interface ExamData {
  id: string;
  title: string;
  syllabus: string;
  examDate: string;
  startTime: string | null;
  endTime: string | null;
  totalMarks: number | null;
  status: string;
  subject: string;
  icon: string | null;
  termName: string;
  instruction: string | null;
}

interface Props {
  classId: string;
  subjectOnly?: boolean; // true = filter to teacher's subject only
  onMetaReady?: (termName: string, instruction: string | null) => void;
}

// ─── Date formatter ──────────────────────────────────────────────────────────
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) suffix = "st";
  else if (day === 2 || day === 22) suffix = "nd";
  else if (day === 3 || day === 23) suffix = "rd";
  return { day: day.toString(), suffix };
};

// ─── Card color logic ────────────────────────────────────────────────────────
const getCardColors = (status: string, upcomingIndex: number) => {
  if (status === "COMPLETED")
    return { bgColor: "#EEEFF0", iconBg: "#D9DADB", textColor: "#9B9B9B" };
  if (status === "ONGOING")
    return {
      bgColor: "#4285F4",
      iconBg: "rgba(255,255,255,0.2)",
      textColor: "#FFFFFF",
    };
  const isPink = upcomingIndex % 2 === 0;
  return isPink
    ? {
        bgColor: "rgba(255, 226, 232, 0.5)",
        iconBg: "#FFD6DF",
        textColor: "#484848",
      }
    : {
        bgColor: "rgba(222, 237, 254, 0.5)",
        iconBg: "#DCEBFF",
        textColor: "#484848",
      };
};

// ─── Component ───────────────────────────────────────────────────────────────
const TeacherUpcomingExams = ({
  classId,
  subjectOnly = false,
  onMetaReady,
}: Props) => {
  const [examData, setExamData] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!classId) return;

    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);
        setExamData([]);

        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/exams/datesheet",
          {
            params: { classId, subjectOnly: subjectOnly ? "true" : undefined },
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data.success) {
          const data: ExamData[] = response.data.data;
          setExamData(data);
          // Bubble term name + instruction up to the page so the header can show them
          if (onMetaReady && data.length > 0) {
            const firstInstruction =
              data.find((e) => e.instruction)?.instruction ?? null;
            onMetaReady(data[0].termName, firstInstruction);
          }
        } else {
          setError("Failed to fetch exam datesheet.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Error connecting to exam server.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [classId, subjectOnly]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#4285F4]" />
        <span className="ml-3 text-sm font-medium text-gray-500">
          Loading exam datesheet...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-sm font-medium text-red-700">
        ⚠️ {error}
      </div>
    );
  }

  if (examData.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm font-medium text-gray-500">
        No exams scheduled for this class.
      </div>
    );
  }

  let upcomingCounter = 0;

  return (
    <div className="w-full max-w-[90%] xl:max-w-[95%] 2xl:max-w-full">
      <div className="flex flex-col gap-5">
        {examData.map((exam) => {
          const { day, suffix } = formatDate(exam.examDate);
          const upcomingIndex =
            exam.status === "UPCOMING" ? upcomingCounter++ : -1;
          const colors = getCardColors(exam.status, upcomingIndex);
          return (
            <ExamCard
              key={exam.id}
              title={exam.title}
              syllabus={exam.syllabus ?? ""}
              date={day}
              suffix={suffix}
              subjectName={exam.subject}
              icon={exam.icon}
              bgColor={colors.bgColor}
              iconBg={colors.iconBg}
              textColor={colors.textColor}
              startTime={exam.startTime}
              endTime={exam.endTime}
              totalMarks={exam.totalMarks}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TeacherUpcomingExams;
