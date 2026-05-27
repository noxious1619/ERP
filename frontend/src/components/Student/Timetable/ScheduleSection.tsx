import React, { useEffect, useState } from "react";
import axios from "axios";
import TimetableScheduleCard from "../../../components/Student/Timetable/ScheduleCard";
import { getCurrentAPIDay } from "../../../utils/dateHelpers";
interface TimetableItem {
  id: string;
  period: number;
  time: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  isBreak: boolean;
  breakLabel: string | null;
  room: string | null;
  color: string | null;
  subject: string | null;
  professor: string | null;
  duration?: string; // Optional field handled gracefully
}
const TimetableSchedule: React.FC = () => {
  const [scheduleItems, setScheduleItems] = useState<TimetableItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<string>(getCurrentAPIDay());

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token"); 

        const response = await axios.get(`http://localhost:5000/api/academic/timetable/student?day=${activeDay}`, { 
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setScheduleItems(response.data.data);
          console.log("Timetable data fetched successfully:", response.data.data);
        } else {
          setError("Failed to resolve timetable parameters.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error connecting to academic server.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B4FE8]"></div>
        <span className="ml-3 text-sm font-medium text-gray-500">Syncing live timetable...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-sm font-medium mt-4 border border-red-100">
        ⚠️ {error}
      </div>
    );
  }

  if (scheduleItems.length === 0) {
    return (
      <div className="bg-gray-50 text-gray-500 p-8 rounded-2xl text-center text-sm font-medium mt-4 border border-dashed border-gray-200">
        No academic blocks or breaks scheduled for today.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      {scheduleItems.map((item) => (
        <TimetableScheduleCard
          key={item.id}
          time={item.time}
          isActive={item.isActive}
          isBreak={item.isBreak}
          breakLabel={item.breakLabel || "Institutional Break"}
          room={item.room || "Campus Hall"}
          color={item.color || null}
          subject={item.subject || "No Subject assigned"}
          professor={item.professor || "Faculty Staff"}
          duration={item.duration}
        />
      ))}
    </div>
  );
};

export default TimetableSchedule;
