import WeeklyClassCard from "../Timetable/WeeklyCard";
const days = [
  { day: "Monday", date: "16" },
  { day: "Tuesday", date: "17" },
  { day: "Wednesday", date: "18" },
  { day: "Thursday", date: "19" },
  { day: "Friday", date: "20" },
  { day: "Saturday", date: "21" },
];
const timeSlots = ["08:00", "10:00", "12:00", "01:00", "03:00"];
const classes = [
  // MONDAY
  {
    day: 0,
    row: 0,
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    location: "Comp Lab 3",
    accentColor: "#0060AE",
  },
  {
    day: 0,
    row: 1,
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    location: "Comp Lab 3",
    accentColor: "#0060AE",
  },
  {
    day: 0,
    row: 3,
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    location: "Comp Lab 3",
    accentColor: "#0060AE",
  },
  {
    day: 0,
    row: 4,
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    location: "Comp Lab 3",
    accentColor: "#0060AE",
  },
  // TUESDAY
  {
    day: 1,
    row: 0,
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    location: "Comp Lab 3",
    accentColor: "#0060AE",
  },
  {
    day: 1,
    row: 1,
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    location: "Comp Lab 3",
    accentColor: "#0060AE",
  },
  {
    day: 1,
    row: 3,
    code: "AI-400",
    subject: "Intro to AI & ML",
    teacher: "Dr. Michael Grey",
    location: "Auditorium 1",
    accentColor: "#0060AE",
  },
  {
    day: 1,
    row: 4,
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    location: "Comp Lab 3",
    accentColor: "#0060AE",
  },
  // WEDNESDAY
  {
    day: 2,
    row: 0,
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    location: "Comp Lab 3",
    accentColor: "#0060AE",
  },
  {
    day: 2,
    row: 1,
    code: "PHL-101",
    subject: "Modern Ethics",
    teacher: "Dr. Alan Moore",
    location: "Main Hall",
    accentColor: "#BB0060",
  },
  {
    day: 2,
    row: 3,
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    location: "Comp Lab 3",
    accentColor: "#0060AE",
  },
  {
    day: 2,
    row: 4,
    code: "MTH-201",
    subject: "Discrete Math",
    teacher: "Dr. Peter Parker",
    location: "Seminar Room 2",
    accentColor: "#5538F7",
  },
  // THURSDAY
  {
    day: 3,
    row: 0,
    code: "PHY-301",
    subject: "Quantum Physics",
    teacher: "Prof. Robert Chen",
    location: "Lab 12, Science Wing",
    accentColor: "#5538F7",
  },
  {
    day: 3,
    row: 1,
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    location: "Comp Lab 3",
    accentColor: "#0060AE",
  },
  {
    day: 3,
    row: 3,
    code: "MTH-402",
    subject: "Advanced Calculus",
    teacher: "Dr. Sarah Jenkins",
    location: "Room 402, Block B",
    accentColor: "#4924EB",
  },
  {
    day: 3,
    row: 4,
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    location: "Comp Lab 3",
    accentColor: "#0060AE",
  },
  // FRIDAY
  {
    day: 4,
    row: 0,
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    location: "Comp Lab 3",
    accentColor: "#0060AE",
  },
  {
    day: 4,
    row: 1,
    code: "CSC-305",
    subject: "Computer Networks",
    teacher: "Prof. Lisa Wang",
    location: "Lab 08",
    accentColor: "#5538F7",
  },
  {
    day: 4,
    row: 3,
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    location: "Comp Lab 3",
    accentColor: "#0060AE",
  },
  {
    day: 4,
    row: 4,
    code: "CSC-202",
    subject: "Data Structures",
    teacher: "James Wilson",
    location: "Comp Lab 3",
    accentColor: "#0060AE",
  },
  //SATURDAY
  {
    day: 5,
    row: 0,
    code: "ART-101",
    subject: "Creative Design",
    teacher: "Prof. Emily Stone",
    location: "Art Studio 2",
    accentColor: "#0060AE",
  },
  {
    day: 5,
    row: 1,
    code: "MUS-201",
    subject: "Music Theory",
    teacher: "Dr. Kevin Hart",
    location: "Music Hall",
    accentColor: "#0060AE",
  },
  {
    day: 5,
    row: 3,
    code: "ENG-301",
    subject: "Public Speaking",
    teacher: "Dr. Nancy Drew",
    location: "Seminar Hall",
    accentColor: "#0060AE",
  },
];
const WeeklyTimetableGrid = () => {
  return (
    <div className="mt-10 rounded-[38px] bg-rgba(228, 232, 240, 0.3) py-6">
      {/* Header Days */}
      <div className="ml-[72px] grid grid-cols-6 gap-[12px]">
        {days.map((item) => (
          <div
            key={item.day}
            className="flex h-[54px] flex-col items-center justify-center rounded-full bg-slate-200 "
          >
            <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#666B78]">
              {item.day}
            </span>
            <span className="text-[16px] font-bold leading-[18px] text-[#2B2F38]">
              {item.date}
            </span>
          </div>
        ))}
      </div>
      {/* Grid Layout */}
      <div className="mt-2 flex">
        {/* Time Labels */}
        <div className="flex w-[72px] flex-col">
          {timeSlots.map((time) => (
            <div
              key={time}
              className="flex h-[132px] items-start pt-7 text-[16px] font-medium text-[#8A8FA1]"
            >
              {time}
            </div>
          ))}
        </div>
        {/* Right Grid */}
        <div className="relative grid flex-1 grid-cols-6 border-l border-t border-[#E6EAF2]">
          {/* Background Cells */}
          {Array.from({ length: 30 }).map((_, index) => (
            <div
              key={index}
              className="h-[132px] border-r border-b border-[#E6EAF2]"
            />
          ))}
          {/* Lunch Break */}
          <div className="absolute left-0 top-[310px] z-10 flex w-full items-center justify-center">
            <div className="bg-[#F3F5FA] px-6 text-[11px] font-bold uppercase tracking-[4px]  text-gray-600">
              Institutional Lunch Break
            </div>
          </div>
          {/* Cards */}
          {classes.map((item, index) => (
            <div
              key={index}
              className="absolute p-[8px]"
              style={{
                left: `calc(${item.day} * 16.6667%)`,
                top: `${item.row * 132}px`,
                width: "16.6667%",
              }}
            >
              <WeeklyClassCard
                code={item.code}
                subject={item.subject}
                teacher={item.teacher}
                location={item.location}
                accentColor={item.accentColor}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyTimetableGrid;
