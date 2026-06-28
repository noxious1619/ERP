import { Routes, Route, Navigate } from "react-router-dom";

// ==========================================
// STUDENT IMPORTS
// ==========================================
import Dashboard from "./pages/Student/Dashboard";
import Timetable from "./pages/Student/Timetable";
import WeeklyTimetable from "./pages/Student/WeeklyTimetable";
import Profile from "./pages/Student/Profile";
import Attendance from "./pages/Student/Attendance";
import Homework from "./pages/Student/Homework";
import NoticeBoard from "./pages/Student/NoticeBoard";
import Exam from "./pages/Student/Exam";

// ==========================================
// TEACHER IMPORTS
// ==========================================
import { AuthProvider } from "./context/AuthContext";
import TeacherNoticeBoard from "./pages/Teacher/TeacherNoticeBoard";
import TeacherTimetablePage from "./pages/Teacher/TeacherTimetable";
import TeacherWeeklytimetable from "./pages/Teacher/Teacherweeklytimetable";
import TeacherProfile from "./pages/Teacher/TeacherProfile";
import TeacherHomework from "./pages/Teacher/TeacherHomework";
import TeacherHomeworkDetail from "./pages/Teacher/TeacherHomeworkDetail";
import TeacherSubmissionView from "./pages/Teacher/TeacherSubmissionView";
import AttendanceManagement from "./pages/Teacher/Attendancemanagement";

// ==========================================
// ADMIN IMPORTS
// ==========================================
import Academics from "./pages/Admin/Academics";
import Staff from "./pages/Admin/Staff";
import StaffProfile from "./pages/Admin/Staff/StaffProfile";
import Classes from "./pages/Admin/Academics/Classes";
import Subjects from "./pages/Admin/Academics/Subjects";
import AdminTimetable from "./pages/Admin/Academics/Timetable";
import AdminDashboard from "./pages/Admin/Dashboard/Dashboard";
import AdminNotices from "./pages/Admin/Communication/Notices";
import AdminDatesheet from "./pages/Admin/Academics/Exams/Datesheet";
import AdminAttendance from "./pages/Admin/Academics/Attendence";
import Teacherdatesheet from "./pages/Teacher/Teacherdatesheet";
import Teacherdashboard from "./pages/Teacher/Teacherdashboard";
import AdminProfilePage from "./pages/Admin/AdminProfilePage";
import AcademicYears from "./pages/Admin/Academics/Academicyears";
import AdminTeachersPage from "./pages/Admin/Academics/Teacher";
import AdminTeacherProfilePage from "./pages/Admin/TeacherProfile";
import DashboardAdmin from "./pages/Admin/Dashboard/Dashboard";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Default Route */}
        <Route
          path="/"
          element={<Navigate to="/student/dashboard" replace />}
        />

        {/* ========================================== */}
        {/* STUDENT ROUTES                             */}
        {/* ========================================== */}
        <Route
          path="/"
          element={<Navigate to="/student/dashboard" replace />}
        />
        {/* Dashboard */}
        <Route path="/student/dashboard" element={<Dashboard />} />
        <Route path="/student/timetable" element={<Timetable />} />
        <Route path="/student/timetable/weekly" element={<WeeklyTimetable />} />
        <Route path="/student/profile" element={<Profile />} />
        <Route path="/student/attendance" element={<Attendance />} />
        <Route path="/student/homework" element={<Homework />} />
        <Route path="/student/notices" element={<NoticeBoard />} />
        <Route path="/student/exams" element={<Exam />} />
        {/* ========================================== */}
        {/* TEACHER ROUTES                             */}
        {/* ========================================== */}
        <Route path="/teacher/notices" element={<TeacherNoticeBoard />} />
        <Route path="/teacher/timetable" element={<TeacherTimetablePage />} />
        <Route
          path="/teacher/timetable/weekly"
          element={<TeacherWeeklytimetable />}
        />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
        <Route path="/teacher/attendance" element={<AttendanceManagement />} />
        <Route path="/teacher/homework" element={<TeacherHomework />} />
        <Route
          path="/teacher/homework/:id"
          element={<TeacherHomeworkDetail />}
        />
        <Route
          path="/teacher/homework/submission/:submissionId"
          element={<TeacherSubmissionView />}
        />
        {/* Datesheet */}
        <Route path="/teacher/exams" element={<Teacherdatesheet />} />
        {/* Teacher Dashboard */}
        <Route path="/teacher/dashboard" element={<Teacherdashboard />} />

        {/* ========================================== */}
        {/* ADMIN ROUTES                               */}
        {/* ========================================== */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/academics/students" element={<Academics />} />
        <Route path="/admin/academics/staff" element={<Staff />} />
        <Route
          path="/admin/academics/staff/profile"
          element={<StaffProfile />}
        />
        <Route
          path="/admin/academics/academic-years"
          element={<AcademicYears />}
        />
        <Route path="/admin/academics/classes" element={<Classes />} />
        <Route path="/admin/academics/subjects" element={<Subjects />} />
        <Route path="/admin/academics/timetable" element={<AdminTimetable />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/communication/notices" element={<AdminNotices />} />
        <Route
          path="/admin/academics/exams/datesheet"
          element={<AdminDatesheet />}
        />
        <Route
          path="/admin/academics/attendance"
          element={<AdminAttendance />}
        />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
        <Route path="/admin/academics/staff/:id" element={<StaffProfile />} />
        <Route
          path="/admin/academics/teachers"
          element={<AdminTeachersPage />}
        />
        <Route
          path="/admin/academics/teachers/:id"
          element={<AdminTeacherProfilePage />}
        />

        {/* Catch-all 404 Route */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen text-xl font-bold text-gray-500">
              404 | Page Not Found
            </div>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
