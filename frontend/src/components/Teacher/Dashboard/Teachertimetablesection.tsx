import React from "react";
import { useNavigate } from "react-router-dom";
import TeacherTimetableCard from "./Teachertimetablecard";

// Shape of one timetable slot — mirrors what the backend will send later
export interface TeacherTimetableItem {
  id: string;
  className: string; // e.g. "Class – X(A)"
  startTime: string;
  endTime: string;
  subject: string; // e.g. "English"
  room: string; // e.g. "ROOM-101"
  isActive?: boolean; // true for the currently ongoing class
}

interface TeacherTimetableSectionProps {
  schedule: TeacherTimetableItem[];
  loading?: boolean;
}

const TeacherTimetableSection: React.FC<TeacherTimetableSectionProps> = ({
  schedule,
  loading,
}) => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-3 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">Today's Timetable</h2>
        <button
          onClick={() => navigate("/teacher/timetable")}
          className="text-sm font-bold text-[#090958] flex items-center gap-0.5 hover:text-cyan-600 transition-colors cursor-pointer"
        >
          View Weekly
          <span className="text-base leading-none ml-1">›</span>
        </button>
      </div>

      {/* Cards Row — same scroll pattern as student, 4 cards visible */}
      <div className="flex gap-4 w-full px-8 scroll-smooth snap-x snap-mandatory pb-2 ">
        {loading ? (
          <div className="text-sm text-gray-500 font-medium p-2">
            Loading schedule...
          </div>
        ) : schedule.length > 0 ? (
          schedule.map((item) => (
            // Width: show 4 cards at once (vs 5 in student) — 3 gaps of gap-4 (48px total) / 4
            <div
              key={item.id}
              className="shrink-0 snap-start w-[calc((100%-3rem)/4)]"
            >
              <TeacherTimetableCard
                className={item.className}
                startTime={item.startTime}
                endTime={item.endTime}
                subject={item.subject}
                room={item.room}
                isActive={item.isActive}
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

export default TeacherTimetableSection;
