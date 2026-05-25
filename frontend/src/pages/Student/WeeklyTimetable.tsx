import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Student/Dashboard/Navbar";
import TimetableHeader from "../../components/Student/Timetable/Header";
import WeeklyTimetableGrid from "../../components/Student/Timetable/WeeklyTimetableGrid";
import type { TimetableEntry } from "../../types";

const WeeklyTimetable = () => {
  const [scheduleData, setScheduleData] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const targetSectionId = "b7ffe974-a889-408e-886f-7a8109501ee2";

  useEffect(() => {
    const fetchWeeklySchedule = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");

        const response = await axios.get(`http://localhost:5000/api/academic/timetable/section/${targetSectionId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setScheduleData(response.data.data);
        } else {
          setError(response.data.message || "Failed to load database timetable elements.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Connection failure with backend API layers.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklySchedule();
  }, [targetSectionId]);

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />
      <div className="flex flex-1 flex-col h-screen min-w-0">
        {/* Sticky Header */}
        <div className="px-10 pt-8 py-4 shrink-0 bg-[#F5F6FA]">
          <TimetableHeader />
        </div>
        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-10 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {loading && <div className="text-center text-slate-500 py-10">Syncing live timetable...</div>}
          {error && <div className="text-center text-red-500 py-10">⚠️ {error}</div>}
          {!loading && !error && (
            <WeeklyTimetableGrid entries={scheduleData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyTimetable;