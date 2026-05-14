import { Download } from "lucide-react";
type ScheduleItem = {
  subject: string;
  time: string;
  teacher: string;
};
const scheduleData: ScheduleItem[] = [
  {
    subject: "Maths",
    time: "09:00",
    teacher: "Prof. Sheetal Shah",
  },
  {
    subject: "English",
    time: "10:00",
    teacher: "Prof. Sheetal Shah",
  },
  {
    subject: "P.T",
    time: "11:30",
    teacher: "Prof. Sheetal Shah",
  },
  {
    subject: "Science",
    time: "12:30",
    teacher: "Prof. Sheetal Shah",
  },
  {
    subject: "Geography",
    time: "13:30",
    teacher: "Prof. Sheetal Shah",
  },
];
const DateScheduleCard = () => {
  return (
    <div className="mt-6 w-[340px]">
      {/* Heading */}
      <h3 className="text-center text-[13px] font-extrabold uppercase tracking-[2px] text-[#1F1F1F]">
        16th Jan Schedule
      </h3>

      {/* Schedule Cards */}
      <div className="relative mt-6 flex flex-col gap-6">
        {/* Vertical Center Line */}
        <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-[#D9DEE8]" />

        {scheduleData.map((item) => (
          <div
            key={item.subject}
            className="relative z-10 flex py-2 items-center rounded-[14px] border border-[#D7DAE4] bg-white px-4 shadow-[0px_2px_6px_rgba(0,0,0,0.03)]"
          >
            {/* Left Subject */}
            <div className="flex flex-1 items-center">
              <h4 className="text-[18px] font-medium text-[#1F1F1F]">
                {item.subject}
              </h4>
            </div>
            {/* Right Content */}
            <div className="flex flex-col items-end justify-center">
              {/* Time */}
              <span className="text-[11px] font-medium tracking-[1px] text-[#8A8A8A]">
                {item.time}
              </span>
              {/* Teacher */}
              <p className="mt-2 text-[14px] text-[#6F6F6F]">{item.teacher}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Download Button */}
      <button className="mt-6 flex h-[58px] w-full items-center justify-center gap-3 rounded-full bg-[#3F69FF] text-[20px] font-semibold text-white shadow-[0px_12px_24px_rgba(63,105,255,0.35)] transition-all duration-300 hover:scale-[1.02]">
        <Download size={22} strokeWidth={2.5} />
        Download Timetable
      </button>
      {/* Footer */}
      <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-[2px] text-[#A3A3A3]">
        Updated 2 Hours Ago
      </p>
    </div>
  );
};
export default DateScheduleCard;
