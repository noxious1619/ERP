import { useState, useEffect } from "react";
import axios from "axios";
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
  subject?: { id: string; name: string; code: string } | null;
  teacher?: { id: string; name: string } | null;
}

const Timetable = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scheduleData, setScheduleData] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Your specific database section ID
  const targetSectionId = "b7ffe974-a889-408e-886f-7a8109501ee2";

  // Single Fetch Sequence: Grab the entire week's grid parameters at once
  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:5000/api/academic/timetable/section/${targetSectionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          setScheduleData(response.data.data); // Caches the whole week array
        } else {
          setError("Failed to load timetable dataset.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Server linkage timeout.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, [targetSectionId]);

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />
      <div className="flex flex-1 flex-col h-screen min-w-0">
        <div className="px-10 pt-8 py-4 shrink-0 bg-[#F5F6FA]">
          <TimetableHeader />
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-10 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-start gap-6">
            
            <div className="flex-1 min-w-0">
              <TimetableSchedule />
            </div>
            
            <div className="w-90 shrink-0 bg-gray-100 px-5 py-6 rounded-[32px]">
              <CalendarSection 
                variant="timetable" 
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
              
              {/* Pass both the selected date and the downloaded week data array down */}
              <DateScheduleCard 
                selectedDate={selectedDate} 
                timetableData={scheduleData}
                isLoading={loading}
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