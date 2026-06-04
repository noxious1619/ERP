import { useState } from "react";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Teacher/Dashboard/Navbar";
import AttendanceHeader from "../../components/Student/Attendance/AttendanceHeader";
import AttendanceTableHeader from "../../components/Teacher/Attendance/Attendancetableheader";
import StudentAttendanceTable from "../../components/Teacher/Attendance/Studentattendancetable";
import type {
  Student,
  AttendanceStatus,
} from "../../components/Teacher/Attendance/Studentattendancetable";
import AttendanceStatusTable from "../../components/Teacher/Attendance/Attendancestatustable";
import AttendanceStats from "../../components/Teacher/Attendance/Attendancestats";
import AttendanceFilter from "../../components/Teacher/Attendance/Attendancefilter";
import WeeklyAttendanceChart from "../../components/Teacher/Attendance/Weeklyattendancechart";

const STATIC_STUDENTS: Student[] = [
  { rollNo: "001", name: "Alice Johnson", status: "present" },
  { rollNo: "002", name: "Bob Smith", status: "present" },
  { rollNo: "003", name: "Charlie Brown", status: "present" },
  { rollNo: "004", name: "Diana Prince", status: "present" },
  { rollNo: "005", name: "Ethan Hunt", status: "present" },
  { rollNo: "006", name: "Fiona Green", status: "present" },
  { rollNo: "007", name: "George Wilson", status: "present" },
  { rollNo: "008", name: "Hannah Lee", status: "present" },
  { rollNo: "009", name: "Ivan Petrov", status: "present" },
  { rollNo: "010", name: "Julia Roberts", status: "present" },
  { rollNo: "011", name: "Kevin Hart", status: "present" },
  { rollNo: "012", name: "Laura Palmer", status: "present" },
  { rollNo: "013", name: "Mike Tyson", status: "present" },
  { rollNo: "014", name: "Nina Simone", status: "present" },
  { rollNo: "015", name: "Oscar Wilde", status: "present" },
];

const WEEKLY_DATA = [
  { date: "21/6", count: 32 },
  { date: "22/6", count: 34 },
  { date: "23/6", count: 38 },
  { date: "24/6", count: 28 },
  { date: "25/6", count: 40 },
  { date: "26/6", count: 37 },
];

const AttendanceManagement = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const navigate = useNavigate();

  const handleLoadStudents = () => {
    if (selectedClass && selectedSection && selectedDate) {
      setStudents(STATIC_STUDENTS);
      setStudentsLoaded(true);
    }
  };

  const handleStatusChange = (rollNo: string, status: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.rollNo === rollNo ? { ...s, status } : s)),
    );
  };

  const handleMarkAllAbsent = () => {
    setStudents((prev) =>
      prev.map((s) => ({ ...s, status: "present" as AttendanceStatus })),
    );
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

  const classLabel = selectedClass.replace("Class ", "");
  const sectionLabel = selectedSection;

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />

      {/* Scrollable page column */}
      <div
        className="
          flex flex-col flex-1 min-w-0 h-screen overflow-y-auto
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        "
      >
        {/* Sticky page header */}
        <div className="bg-[#F8F9FE] px-10 pt-6 pb-4 sticky top-0 z-20">
          <AttendanceHeader
            title="Attendance Management"
            onProfileClick={() => navigate("/teacher/profile")}
          />
        </div>

        {/* Page body */}
        <div className="px-10 pb-10">
          {/* ── EMPTY STATE: single card ── */}
          {!studentsLoaded && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              {/* Filter inside card */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-center">
                <AttendanceFilter
                  selectedClass={selectedClass}
                  selectedSection={selectedSection}
                  selectedDate={selectedDate}
                  onClassChange={setSelectedClass}
                  onSectionChange={setSelectedSection}
                  onDateChange={setSelectedDate}
                  onLoadStudents={handleLoadStudents}
                />
              </div>
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Users size={48} className="text-gray-300" strokeWidth={1.2} />
                <p className="text-sm text-gray-400">
                  Select filters and click "Load Students" to begin
                </p>
              </div>
            </div>
          )}

          {/* ── LOADED STATE ── */}
          {studentsLoaded && (
            <>
              {/* Row: main card + stats panel — proper flex, no overlap */}
              <div className="flex gap-5 items-start">
                {/* ── Main card: filter + divider + table header + two tables ── */}
                <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Filter row at top of card */}
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-center">
                    <AttendanceFilter
                      selectedClass={selectedClass}
                      selectedSection={selectedSection}
                      selectedDate={selectedDate}
                      onClassChange={setSelectedClass}
                      onSectionChange={setSelectedSection}
                      onDateChange={setSelectedDate}
                      onLoadStudents={handleLoadStudents}
                    />
                  </div>

                  {/* Table section */}
                  <div className="p-6">
                    {/* Header row: class title + action buttons */}
                    <AttendanceTableHeader
                      classLabel={classLabel}
                      section={sectionLabel}
                      onMarkAllAbsent={handleMarkAllAbsent}
                      onExport={handleExport}
                    />

                    {/* Two tables side by side */}
                    <div className="flex gap-4 mt-4">
                      {/* Left: student list with status icons */}
                      <div className="flex-1 min-w-0">
                        <StudentAttendanceTable
                          students={students}
                          onStatusChange={handleStatusChange}
                        />
                      </div>

                      {/* Right: present/late/absent filtered table */}
                      <div className="w-[240px] flex-shrink-0">
                        <AttendanceStatusTable students={students} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Stats panel: fixed width, sits beside main card ── */}
                <div className="w-[320px] flex-shrink-0 flex flex-col gap-8">
                  <AttendanceStats students={students} />
                  <WeeklyAttendanceChart
                    classLabel={classLabel}
                    section={sectionLabel.replace("Section ", "")}
                    weeklyData={WEEKLY_DATA}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
