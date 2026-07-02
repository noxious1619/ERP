import { useContext, useEffect, useState } from "react";
import { Users, Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Teacher/Dashboard/Navbar";
import AttendanceHeader from "../../components/Student/Attendance/AttendanceHeader";
import AttendanceTableHeader from "../../components/Teacher/Attendance/Attendancetableheader";
import StudentAttendanceTable from "../../components/Teacher/Attendance/Studentattendancetable";
import type { AttendanceStatus } from "../../components/Teacher/Attendance/Studentattendancetable";
import AttendanceStatusTable from "../../components/Teacher/Attendance/Attendancestatustable";
import AttendanceStats from "../../components/Teacher/Attendance/Attendancestats";
import AttendanceFilter from "../../components/Teacher/Attendance/Attendancefilter";
import WeeklyAttendanceChart from "../../components/Teacher/Attendance/Weeklyattendancechart";
import { AuthContext } from "../../context/AuthContext";

interface DynamicStudent {
  rollNo: string;
  name: string;
  status: AttendanceStatus;
  studentId: string;
}

const WEEKLY_DATA = [
  { date: "21/6", count: 32 },
  { date: "22/6", count: 34 },
  { date: "23/6", count: 38 },
  { date: "24/6", count: 28 },
  { date: "25/6", count: 40 },
  { date: "26/6", count: 37 },
];

const AttendanceManagement = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }),
  );
  const [students, setStudents] = useState<DynamicStudent[]>([]);

  const [hasLoaded, setHasLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Zero-Click Auto Fetch (Using the clean auth.sectionId)
  useEffect(() => {
    const fetchAttendance = async () => {
      // 🚀 UPDATED: Using direct sectionId
      const sectionId = auth?.sectionId;
      if (!sectionId || auth?.loading) return;

      try {
        setStudents([]);
        setIsSaved(false);
        setIsLoading(true);
        setError(null);
        const headers = { Authorization: `Bearer ${auth.token}` };

        const res = await axios.get(
          `http://localhost:5000/api/attendance/daily?sectionId=${sectionId}&date=${selectedDate}`,
          { headers },
        );

        if (res.data.success) {
          const mappedStudents = res.data.data.map((row: any) => ({
            rollNo: row.student.rollNumber || "-",
            name: `${row.student.firstName} ${row.student.lastName}`,
            status: row.status.toLowerCase() as AttendanceStatus,
            studentId: row.studentId,
          }));

          setStudents(mappedStudents);
          setIsSaved(res.data.isSaved);
          setHasLoaded(true);
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to load students.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendance();
  }, [auth?.sectionId, auth?.loading, selectedDate, auth?.token]);

  const handleStatusChange = (rollNo: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.rollNo === rollNo ? { ...s, status } : s)),
    );
    if (isSaved) setIsSaved(false);
  };

  const handleMarkAllAbsent = () => {
    setStudents((prev) =>
      prev.map((s) => ({ ...s, status: "absent" as AttendanceStatus })),
    );
    if (isSaved) setIsSaved(false);
  };

  // 3. The Database Save Mechanism
  const handleSave = async () => {
    // 🚀 UPDATED: Using direct sectionId
    const sectionId = auth?.sectionId;
    if (!sectionId) return;

    try {
      setIsSaving(true);
      setError(null);
      const headers = { Authorization: `Bearer ${auth.token}` };

      const payload = {
        sectionId,
        date: selectedDate,
        attendanceData: students.map((s) => ({
          studentId: s.studentId,
          status: s.status.toUpperCase(),
        })),
      };

      const res = await axios.post(
        "http://localhost:5000/api/attendance/daily",
        payload,
        { headers },
      );

      if (res.data.success) {
        setIsSaved(true);
      }
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.response?.data?.message || "Failed to save attendance.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const csv = [
      ["Roll No", "Name", "Status"],
      ...students.map((s) => [s.rollNo, s.name, s.status]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${selectedDate.replace(/\//g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 🚀 THE DEBUG GUARD RAIL
  if (!auth?.loading && !auth?.sectionId) {
    return (
      <div className="p-8 bg-gray-900 min-h-screen text-green-400 font-mono text-sm">
        <h2 className="text-2xl text-red-500 mb-4">🛑 GUARD RAIL TRIGGERED</h2>
        <p className="mb-4">
          React blocked this page because auth.sectionId is null. Here is
          exactly what the backend sent us:
        </p>

        <div className="bg-black p-4 rounded-lg overflow-auto">
          {/* This will print the exact raw auth object to your screen! */}
          <pre>{JSON.stringify(auth, null, 2)}</pre>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-8 px-6 py-2 bg-red-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  // 🚀 UPDATED: Pulling the correct text directly from auth context
  const classLabel = auth?.className || "Class";
  const sectionLabel = auth?.sectionName || "Section";

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />

      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="bg-[#F8F9FE] px-10 pt-6 pb-4 sticky top-0 z-20">
          <AttendanceHeader
            title="Attendance Management"
            onProfileClick={() => navigate("/teacher/profile")}
          />
        </div>

        <div className="px-10 pb-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* ── LOADING STATE ── */}
          {isLoading && !hasLoaded && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="text-gray-500 font-medium">
                Fetching class roster...
              </p>
            </div>
          )}

          {/* ── LOADED STATE ── */}
          {hasLoaded && (
            <div className="flex gap-5 items-start">
              {/* Main Card */}
              <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                {/* Filters */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-center">
                  <AttendanceFilter
                    selectedClass={classLabel}
                    selectedSection={sectionLabel}
                    selectedDate={selectedDate}
                    onClassChange={() => {}}
                    onSectionChange={() => {}}
                    onDateChange={setSelectedDate}
                    onLoadStudents={() => {}}
                  />
                </div>

                {/* The new "Save / Sync Bar" */}
                <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {isSaved ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                        Official Record Saved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>{" "}
                        Unsaved Draft
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={isSaving || isSaved}
                    className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-lg transition-all ${
                      isSaving
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : isSaved
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default"
                          : "bg-[#3B4FE8] text-white hover:bg-blue-700 active:scale-95 shadow-sm"
                    }`}
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {isSaving
                      ? "Saving..."
                      : isSaved
                        ? "Saved"
                        : "Save Attendance"}
                  </button>
                </div>

                <div className="p-6">
                  <AttendanceTableHeader
                    classLabel={classLabel}
                    section={sectionLabel}
                    onMarkAllAbsent={handleMarkAllAbsent}
                    onExport={handleExport}
                  />

                  {isLoading ? (
                    <div className="py-20 flex justify-center opacity-50">
                      <Loader2
                        className="animate-spin text-blue-600"
                        size={32}
                      />
                    </div>
                  ) : (
                    <div className="flex gap-4 mt-4">
                      <div className="flex-1 min-w-0">
                        <StudentAttendanceTable
                          students={students}
                          onStatusChange={handleStatusChange}
                        />
                      </div>
                      <div className="w-[240px] flex-shrink-0">
                        <AttendanceStatusTable students={students} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Panel */}
              <div className="w-[320px] flex-shrink-0 flex flex-col gap-8">
                <AttendanceStats students={students} />
                {/* <WeeklyAttendanceChart
                  classLabel={classLabel}
                  section={sectionLabel.replace("Section ", "")}
                  weeklyData={WEEKLY_DATA}
                /> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
