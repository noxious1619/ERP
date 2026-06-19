import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

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

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/student/dashboard" replace />} />

        {/* ========================================== */}
        {/* STUDENT ROUTES                             */}
        {/* ========================================== */}
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
        <Route path="/teacher/timetable/weekly" element={<TeacherWeeklytimetable />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
        <Route path="/teacher/attendance" element={<AttendanceManagement />} />
        <Route path="/teacher/homework" element={<TeacherHomework />} />
        <Route path="/teacher/homework/:id" element={<TeacherHomeworkDetail />} />
        <Route path="/teacher/homework/submission/:submissionId" element={<TeacherSubmissionView />} />

        {/* ========================================== */}
        {/* ADMIN ROUTES                               */}
        {/* ========================================== */}
        <Route path="/admin/academics" element={<Academics />} />

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