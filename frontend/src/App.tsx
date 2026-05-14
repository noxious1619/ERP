import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Student/Dashboard";
import Timetable from "./pages/Student/Timetable";
import WeeklyTimetable from "./pages/Student/WeeklyTimetable";
const App = () => {
  return (
    <Routes>
      {/* Default Route */}
      <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
      {/* Dashboard */}
      <Route path="/student/dashboard" element={<Dashboard />} />
      {/* Timetable */}
      <Route path="/student/timetable" element={<Timetable />} />
      <Route path="/student/timetable/weekly" element={<WeeklyTimetable />} />
    </Routes>
  );
};
export default App;
