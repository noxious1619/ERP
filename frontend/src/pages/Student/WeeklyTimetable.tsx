import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth"; 
import Navbar from "../../components/Student/Dashboard/Navbar";
import TimetableHeader from "../../components/Student/Timetable/Header";
import WeeklyTimetableGrid from "../../components/Student/Timetable/WeeklyTimetableGrid";
import type { TimetableEntry } from "../../types";
import { API_BASE_URL } from "../../lib/api";
const WeeklyTimetable = () => {
  // ✅ 2. Extract studentData to get the dynamic section ID
  const { studentData, loading: authLoading } = useAuth();

  const [scheduleData, setScheduleData] = useState<TimetableEntry[]>([]);
  // Catch the new label for the UI and PDF generator
  const [sectionLabel, setSectionLabel] = useState<string>("Class Timetable");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ 3. Make the target ID dynamic based on the logged-in student
  const targetSectionId = studentData?.sectionId;

  useEffect(() => {
    // Wait until we actually have the sectionId from the auth hook
    if (!targetSectionId) return;

    const fetchWeeklySchedule = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        //  4. FIXED PATH: Added /weekly to match your Express router
        const response = await axios.get(
          `${API_BASE_URL}/api/timetable/section/${targetSectionId}/weekly`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.success) {
          setScheduleData(response.data.data);
          // Set the label from the backend response
          if (response.data.sectionLabel) {
            setSectionLabel(response.data.sectionLabel);
          }
        } else {
          setError(
            response.data.message ||
              "Failed to load database timetable elements.",
          );
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Connection failure with backend API layers.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklySchedule();
  }, [targetSectionId]);

  // Provide a smooth loading state while Auth hydrates
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FE] text-slate-400 font-semibold text-xs tracking-wider uppercase">
        Verifying secure profile session...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />
      <div className="flex flex-1 flex-col h-screen min-w-0">
        {/* Sticky Header */}
        <div className="px-10 pt-8 py-4 shrink-0 bg-[#F5F6FA]">
          {/* Pass the data down to the header for the PDF button */}
          <TimetableHeader  sectionLabel={sectionLabel}/>
        </div>
        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-10 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {loading && (
            <div className="text-center text-slate-500 py-10">
              Syncing live timetable...
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 py-10">⚠️ {error}</div>
          )}
          {!loading && !error && <WeeklyTimetableGrid entries={scheduleData} />}
        </div>
      </div>
    </div>
  );
};

export default WeeklyTimetable;
