import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Navbar from "../../components/Student/Dashboard/Navbar";
import TimetableHeader from "../../components/Student/Timetable/Header";
import TimetableSchedule from "../../components/Student/Timetable/ScheduleSection";
import CalendarSection from "../../components/Student/Dashboard/Calendar";
import DateScheduleCard from "../../components/Student/Timetable/DateScheduleCard ";

interface TimetableEntry {
  id: string;
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  isBreak: boolean;
  breakLabel: string | null;
  room: string | null;
  color: string | null;
  subject?: { id: string; name: string; code: string } | null; // ← was string
  displayTeacherName?: string | null;
}
const Timetable = () => {
  const { studentData, loading: authLoading } = useAuth();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scheduleData, setScheduleData] = useState<TimetableEntry[]>([]);
  const [timetableLoading, setTimetableLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 3. Extract the real, dynamic section ID
  const targetSectionId = studentData?.sectionId;

  // Single Fetch Sequence: Grab records automatically whenever targetSectionId maps in
  useEffect(() => {
    if (!targetSectionId) return;

    const fetchWeeklyData = async () => {
      try {
        setTimetableLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:5000/api/timetable/section/${targetSectionId}/weekly`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data.success) {
          console.log("Fetched Timetable Data:", response.data.data);
          setScheduleData(response.data.data);
        } else {
          setError("Failed to load timetable dataset.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Server linkage timeout.");
      } finally {
        setTimetableLoading(false);
      }
    };

    fetchWeeklyData();
  }, [targetSectionId]);

  // 4. Return a clean loading block during cold starts/refreshes to prevent component race-conditions
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
          <TimetableHeader />
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-10 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-start gap-6">
            <div className="flex-1 min-w-0">
              <TimetableSchedule
                selectedDate={selectedDate}
                scheduleData={scheduleData}
                isLoading={timetableLoading}
                error={error}
              />
            </div>

            {/* RIGHT - Sidebar Frame */}
            <div className="w-90 shrink-0 bg-gray-100 px-5 py-6 rounded-[32px]">
              <CalendarSection
                variant="timetable"
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />

              <DateScheduleCard
                selectedDate={selectedDate}
                timetableData={scheduleData}
                isLoading={timetableLoading}
                isError={!!error}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
