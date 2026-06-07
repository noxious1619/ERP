import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Student/Dashboard";
import Timetable from "./pages/Student/Timetable";
import WeeklyTimetable from "./pages/Student/WeeklyTimetable";
import Profile from "./pages/Student/Profile";
import Attendance from "./pages/Student/Attendance";
import Homework from "./pages/Student/Homework";
import NoticeBoard from "./pages/Student/NoticeBoard";
import Exam from "./pages/Student/Exam";
import { AuthProvider } from "./context/AuthContext";
import Academics from "./pages/Admin/Academics";import TeacherNoticeBoard from "./pages/Teacher/TeacherNoticeBoard";
import TeacherTimetablePage from "./pages/Teacher/TeacherTimetable";
import TeacherProfile from "./pages/Teacher/TeacherProfile";
import TeacherWeeklytimetable from "./pages/Teacher/Teacherweeklytimetable";
import TeacherHomework from "./pages/Teacher/TeacherHomework";
import TeacherHomeworkDetail from "./pages/Teacher/TeacherHomeworkDetail";
import TeacherSubmissionView from "./pages/Teacher/TeacherSubmissionView";
import AttendanceManagement from "./pages/Teacher/Attendancemanagement";
const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
        {/* Dashboard */}
        <Route path="/student/dashboard" element={<Dashboard />} />
        {/* Timetable */}
        <Route path="/student/timetable" element={<Timetable />} />
        <Route path="/student/timetable/weekly" element={<WeeklyTimetable />} />
        {/* Profile */}
        <Route path="/student/profile" element={<Profile />} />
        {/* Attendance */}
        <Route path="/student/attendance" element={<Attendance />} />
        {/* Homework */}
        <Route path="/student/homework" element={<Homework />} />
        {/* Notice Board */}
        <Route path="/student/notices" element={<NoticeBoard />} />
        {/* Exams */}
        <Route path="/student/exams" element={<Exam />} />
      {/* Teacher Routes */}
      <Route path="/teacher/notices" element={<TeacherNoticeBoard />} />
      <Route path="/teacher/timetable" element={<TeacherTimetablePage />} />
      <Route path="/teacher/profile" element={<TeacherProfile />} />
      <Route
        path="/teacher/timetable/weekly"
        element={<TeacherWeeklytimetable />}
      />
      <Route path="/teacher/homework" element={<TeacherHomework />} />
      <Route
        path="/teacher/homework/viewdetail"
        element={<TeacherHomeworkDetail />}
      />
      <Route
        path="/teacher/homework/submission"
        element={<TeacherSubmissionView />}
      />
      <Route path="/teacher/attendance" element={<AttendanceManagement />} />

        {/* Admin End Points */}
        {/* Academics */}
        <Route path="/admin/academics" element={<Academics />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
