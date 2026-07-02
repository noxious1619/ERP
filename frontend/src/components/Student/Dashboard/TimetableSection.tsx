import React from "react";
import { useNavigate } from "react-router-dom";
import TimetableCard from "../../../components/Student/Dashboard/TimetableCard";
import avtar from "../../../assets/Student/Dashboard/TimetableSection/avtar.jpg";

// 1. Define the exact shape of the data coming from Dashboard
export interface TimetableItem {
  id: string;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
  breakLabel?: string;
  subject?: { name: string };
  teacher?: { name: string; profileImage?: string };
  room?: string;
}

interface TimetableSectionProps {
  schedule: TimetableItem[];
  loading?: boolean;
}

const TimetableSection: React.FC<TimetableSectionProps> = ({
  schedule,
  loading,
}) => {
  const navigate = useNavigate();

  const isCurrentPeriod = (start: string, end: string) => {
    const now = new Date();

    const parseTime = (time: string) => {
      const [timePart, modifier] = time.trim().split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);

      if (modifier?.toUpperCase() === "PM" && hours !== 12) hours += 12;
      if (modifier?.toUpperCase() === "AM" && hours === 12) hours = 0;

      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    const startTime = parseTime(start);
    const endTime = parseTime(end);

    return now >= startTime && now <= endTime;
  };

  return (
    <section className="flex flex-col gap-3 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">Today's Timetable</h2>

        <button
          onClick={() => navigate("/student/timetable/weekly")}
          className="text-sm font-bold text-[#090958] flex items-center gap-0.5 hover:text-cyan-600 transition-colors cursor-pointer"
        >
          View Weekly
          <span className="text-base leading-none ml-1">›</span>
        </button>
      </div>

      {/* Cards */}
      <div className="flex gap-4 w-full overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {loading ? (
          <div className="text-sm text-gray-500 font-medium p-2">
            Loading schedule...
          </div>
        ) : schedule.length > 0 ? (
          schedule.map((item) => (
            <div
              key={item.id}
              className="shrink-0 snap-start w-[calc((100%-4rem)/5)]"
            >
              <TimetableCard
                subject={
                  item.isBreak
                    ? item.breakLabel || "Break"
                    : item.subject?.name || "No Subject"
                }
                startTime={item.startTime}
                endTime={item.endTime}
                professorName={
                  item.isBreak
                    ? "Interval"
                    : item.teacher?.name || "Faculty Staff"
                }
                professorAvatar={item.teacher?.profileImage || avtar}
                room={item.isBreak ? "TBA" : item.room || "TBA"}
                isLive={
                  !item.isBreak &&
                  isCurrentPeriod(item.startTime, item.endTime)
                }
              />
            </div>
          ))
        ) : (
          <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
            No classes scheduled for today!
          </div>
        )}
      </div>
    </section>
  );
};

export default TimetableSection;