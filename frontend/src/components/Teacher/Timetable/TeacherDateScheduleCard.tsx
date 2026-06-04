import { Download } from "lucide-react";
import type { TeacherFilterMode } from "../Timetable/TeacherTimetableHeader";
// ─── Class mode data (static — backend flow pending) ─────────────────────────
const CLASS_SCHEDULE_DATA = [
  {
    id: "1",
    primary: "Maths",
    sub: null,
    time: "09:00",
    teacher: "Prof. Sheetal Shah",
  },
  {
    id: "2",
    primary: "English",
    sub: null,
    time: "10:00",
    teacher: "Prof. Sheetal Shah",
  },
  {
    id: "3",
    primary: "P.T",
    sub: null,
    time: "11:30",
    teacher: "Prof. Sheetal Shah",
  },
  {
    id: "4",
    primary: "Science",
    sub: null,
    time: "12:30",
    teacher: "Prof. Sheetal Shah",
  },
  {
    id: "5",
    primary: "Geography",
    sub: null,
    time: "13:30",
    teacher: "Prof. Sheetal Shah",
  },
];

// ─── Shape of a single My Subject schedule item ───────────────────────────────
export interface MySubjectScheduleItem {
  id: string;
  primary: string; // class name e.g. "Class 10 - Section A"
  sub: string; // subject name e.g. "English"
  time: string; // e.g. "10:00"
  teacher: string; // teacher name
}

interface DateScheduleCardProps {
  filterMode?: TeacherFilterMode;
  mySubjectData?: MySubjectScheduleItem[];
}

const DateScheduleCard = ({
  filterMode = "class",
  mySubjectData = [],
}: DateScheduleCardProps) => {
  const scheduleData =
    filterMode === "mySubject" ? mySubjectData : CLASS_SCHEDULE_DATA;

  return (
    <div className="mt-6 w-[340px]">
      <h3 className="text-center text-[13px] font-extrabold uppercase tracking-[2px] text-[#1F1F1F]">
        Today's Schedule
      </h3>

      <div className="relative mt-6 flex flex-col gap-6">
        <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-[#D9DEE8]" />

        {scheduleData.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">
            No classes today.
          </p>
        ) : (
          scheduleData.map((item) => (
            <div
              key={item.id}
              className="relative z-10 flex py-2 items-center rounded-[14px] border border-[#D7DAE4] bg-white px-4 shadow-[0px_2px_6px_rgba(0,0,0,0.03)]"
            >
              <div className="flex flex-1 flex-col justify-center">
                <h4 className="text-[18px] font-medium text-[#1F1F1F]">
                  {item.primary}
                </h4>
                {item.sub && (
                  <p className="mt-0.5 text-[12px] font-medium text-[#8A8A8A]">
                    {item.sub}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end justify-center">
                <span className="text-[11px] font-medium tracking-[1px] text-[#8A8A8A]">
                  {item.time}
                </span>
                <p className="mt-2 text-[14px] text-[#6F6F6F]">
                  {item.teacher}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="mt-6 flex h-[58px] w-full items-center justify-center gap-3 rounded-full bg-[#3F69FF] text-[20px] font-semibold text-white shadow-[0px_12px_24px_rgba(63,105,255,0.35)] transition-all duration-300 hover:scale-[1.02]">
        <Download size={22} strokeWidth={2.5} />
        Download Timetable
      </button>

      <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-[2px] text-[#A3A3A3]">
        Updated 2 Hours Ago
      </p>
    </div>
  );
};

export default DateScheduleCard;
