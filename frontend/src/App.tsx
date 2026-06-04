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
      </Routes>
    </AuthProvider>
  );
};

export default App;
