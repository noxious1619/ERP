import { ArrowRight, Sigma, Microscope, Languages } from "lucide-react";
const homeworkData = [
  {
    id: 1,
    subject: "Biology Lab",
    due: "Due: Today,",
    time: "12:00 AM",
    icon: <Microscope size={18} className="text-pink-600" />,
    bg: "bg-pink-100",
  },
  {
    id: 2,
    subject: "Maths",
    due: "Due: 9th May,",
    time: "10:00 AM",
    icon: <Sigma size={18} className="text-indigo-700" />,
    bg: "bg-indigo-100",
  },
  {
    id: 3,
    subject: "English",
    due: "Due: 9th May,",
    time: "11:00 AM",
    icon: <Languages size={18} className="text-blue-600" />,
    bg: "bg-blue-100",
  },
];

const HomeworkSection = () => {
  return (
    <div className="w-full rounded-3xl bg-white  px-5 py-5  shadow-[0px_15px_25px_10px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex items-center  ">
        <h2 className="text-[20px] mx-auto font-bold text-black">Homework</h2>

        <div className="rounded-full bg-pink-800/10 px-2 py-[2px] flex items-end ">
          <span className="text-[11px] font-semibold text-[#AC3149]">
            2 New
          </span>
        </div>
      </div>
      {/* Tabs */}
      <div className="mt-4 flex items-center justify-center gap-10 border-b border-[#ECECEC]">
        <button className="border-b-2 border-[#141B7A] pb-2 text-[14px] font-semibold text-[#141B7A]">
          Pending
        </button>
        <button className="pb-2 text-[14px] font-medium text-[#8B8B8B]">
          Overdue
        </button>
      </div>
      {/* Homework Cards */}
      <div className="mt-2 flex flex-col gap-2">
        {homeworkData.map((item) => (
          <div
            key={item.id}
            className="flex h-[70px] items-center justify-between rounded-[20px] bg-[#F7F7FA] px-6"
          >
            {/* Left Content */}
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className={`flex h-[28px] w-[28px] items-center justify-center rounded-full ${item.bg}`}
              >
                {item.icon}
              </div>

              {/* Text */}
              <div className="flex flex-col">
                <h3 className="text-[14px] font-semibold leading-[20px] text-[#1E1E1E]">
                  {item.subject}
                </h3>

                <p className=" text-[10px] leading-[16px] text-[#7A7A7A]">
                  {item.due}
                </p>

                <p className=" text-[10px] leading-[16px] text-[#7A7A7A]">
                  {item.time}
                </p>
              </div>
            </div>
            {/* Arrow */}
            <button className="flex h-[20px] w-[20px] items-center justify-center rounded-full border border-[#D8D8D8] bg-white">
              <ArrowRight
                size={22}
                strokeWidth={1.8}
                className="text-[#4A4A4A]"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default HomeworkSection;
