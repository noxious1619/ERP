import React from "react";
import TimetableCard from "../../../components/Student/Dashboard/TimetableCard";
import avtar from "../../../assets/Student/Dashboard/TimetableSection/avtar.jpg";
const timetableData = [
  {
    id: 1,
    subject: "Maths",
    startTime: "9:00 AM",
    endTime: "10:00 AM",
    professorName: "Dr. Sarah Jenkins",
    professorAvatar: avtar,
    room: "ROOM-101",
    isActive: true,
  },
  {
    id: 2,
    subject: "English",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    professorName: "Prof. Michael Chen",
    professorAvatar: avtar,
    room: "ROOM-101",
    isActive: true,
  },
];
const TimetableSection: React.FC = () => {
  return (
    <section className="flex flex-col gap-3 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">Today's Timetable</h2>
        <button className="text-sm font-bold text-[#090958] flex items-center gap-0.5 hover:text-cyan-600 transition-colors">
          View Weekly
          <span className="text-base leading-none ml-1">›</span>
        </button>
      </div>
      {/* Cards Row */}
      <div className="flex gap-4 w-full">
        {timetableData.map((item) => (
          <TimetableCard
            key={item.id}
            subject={item.subject}
            startTime={item.startTime}
            endTime={item.endTime}
            professorName={item.professorName}
            professorAvatar={item.professorAvatar}
            room={item.room}
          />
        ))}
      </div>
    </section>
  );
};
export default TimetableSection;
