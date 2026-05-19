import sigmaIcon from "../../../assets/Student/Homework/physics.svg";
import biologyIcon from "../../../assets/Student/Homework/biology.svg";
import chemistryIcon from "../../../assets/Student/Homework/chemistry.svg";
import attachment from "../../../assets/Student/Homework/attachment.svg";

const tasks = [
  {
    id: 1,
    icon: sigmaIcon,
    title: "Quantum Mechanics Problem Set",
    subject: "Physics",
    attachments: "2 attachments",
    status: "OVERDUE",
    statusClass: "bg-rose-400/20 text-[#A8364B]",
  },
  {
    id: 2,
    icon: biologyIcon,
    title: "Cell Structure Diagram",
    subject: "Biology",
    attachments: "1 attachment",
    status: "DUE TODAY",
    statusClass: " bg-pink-200/30 text-[#7C5270]",
  },
  {
    id: 3,
    icon: chemistryIcon,
    title: "Organic Synthesis Report",
    subject: "Chemistry",
    attachments: "No attachments",
    status: "DUE TOMORROW",
    statusClass: "bg-gray-200 text-zinc-600",
  },
  {
    id: 4,
    icon: chemistryIcon,
    title: "Organic Synthesis Report",
    subject: "Chemistry",
    attachments: "No attachments",
    status: "DUE TOMORROW",
    statusClass: "bg-gray-200 text-zinc-600",
  },
  {
    id: 5,
    icon: chemistryIcon,
    title: "Organic Synthesis Report",
    subject: "Chemistry",
    attachments: "No attachments",
    status: "DUE TOMORROW",
    statusClass: "bg-gray-200 text-zinc-600",
  },
];

const HomeworkTaskList = () => {
  return (
    <div className="mt-7 flex w-full flex-col gap-5">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="
            flex
            h-[96px]
            items-center
            justify-between
            rounded-[26px]
            bg-white
            px-6
            shadow-[0px_4px_12px_rgba(0,0,0,0.04)]
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-5">
            {/* Icon */}
            <div
              className="
                flex
                h-[48px]
                w-[48px]
                items-center
                justify-center
                rounded-full
                bg-[#F4EFFB]
              "
            >
              <img
                src={task.icon}
                alt={task.title}
                className="h-[22px] w-[22px]"
              />
            </div>

            {/* Text */}
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-[14px] font-bold text-gray-800">
                  {task.title}
                </h3>

                <span
                  className={`
                    rounded-full
                    px-3
                    py-[4px]
                    text-[11px]
                    font-semibold
                    tracking-[0.5px]
                    ${task.statusClass}
                  `}
                >
                  {task.status}
                </span>
              </div>

              <p className="mt-[4px] text-zinc-600 text-sm">
                {task.subject} •{" "}
                <img
                  src={attachment}
                  alt="Attachments"
                  className="inline-block h-[14px] w-[14px] mr-1"
                />{" "}
                {task.attachments}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-8">
            <button
              className="
                text-[14px]
                font-semibold
                text-[#090958]
              "
            >
              View Details
            </button>

            <button
              className="
                flex
                h-[40px]
                min-w-[90px]
                items-center
                justify-center
                bg-[#3A71FF]
                rounded-full
                px-7
                text-[18px]
                font-semibold
                text-white
           rounded-3xl shadow-[0px_4px_6px_-4px_rgba(110,59,216,0.20)] shadow-[0px_10px_15px_-3px_rgba(110,59,216,0.20)]
              "
            >
              Upload
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeworkTaskList;
