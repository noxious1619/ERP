import React from "react";
import TimetableScheduleCard from "../../../components/Student/Timetable/ScheduleCard";
const scheduleItems = [
  {
    id: 1,
    time: "09:00 AM",
    isActive: true,
    room: "Room 402B",
    subject: "Advanced Mathematics",
    professor: "Dr. Sarah Smith",
  },
  {
    id: 2,
    time: "10:00 AM",
    room: "Room 105",
    subject: "Theoretical Physics",
    professor: "Prof. James Miller",
    duration: "45 Minutes",
  },
  {
    id: 3,
    time: "11:00 AM",
    isBreak: true,
    breakLabel: "Coffee Break & Social",
  },
  {
    id: 4,
    time: "12:00 PM",
    room: "Lab 3",
    subject: "Organic Chemistry Lab",
    professor: "Dr. Elena Rodriguez",
    duration: "90 Minutes",
  },
  {
    id: 5,
    time: "02:00 PM",
    room: "Main Hall",
    subject: "Introduction to Ethics",
    professor: "Prof. Marcus Thorne",
    duration: "60 Minutes",
  },
  {
    id: 6,
    time: "03:00 PM",
    room: "Seminar Room 1",
    subject: "Data Structures",
    professor: "Dr. Alan T.",
    duration: "45 Minutes",
  },
];
const TimetableSchedule: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      {scheduleItems.map((item) => (
        <TimetableScheduleCard
          key={item.id}
          time={item.time}
          isActive={item.isActive}
          isBreak={item.isBreak}
          breakLabel={item.breakLabel}
          room={item.room}
          subject={item.subject}
          professor={item.professor}
          duration={item.duration}
        />
      ))}
    </div>
  );
};
export default TimetableSchedule;
