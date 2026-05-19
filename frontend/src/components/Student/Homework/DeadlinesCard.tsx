import { ChevronLeft } from "lucide-react";

interface DeadlinesCardProps {
  onBack: () => void;
}

const DeadlinesCard = ({ onBack }: DeadlinesCardProps) => {
  const deadlines = [
    {
      title: "Math Quiz",
      time: "Today, 2:00 PM",
      color: "bg-[#B33A57]",
    },
    {
      title: "Physics Lab",
      time: "Tomorrow, 10:30 AM",
      color: "bg-[#7D4B72]",
    },
    {
      title: "Literature Essay",
      time: "Friday, 11:59 PM",
      color: "bg-[#11106F]",
    },
  ];

  return (
    <div
      className="
        w-full
        rounded-[34px]
        bg-white
        px-4
        py-4
        shadow-[0px_8px_30px_rgba(0,0,0,0.03)]
      "
    >
      {/* Heading */}
      <h2
        className="
          text-[20px]
          font-bold
          text-[#303030]
          text-center
         
        "
      >
        Upcoming Deadlines
      </h2>

      {/* List + Arrow row */}
      <div className="mt-10 flex items-center ">
        {/* Back arrow — vertically centered beside the list */}
        <button
          onClick={onBack}
          className="
            flex
            h-[38px]
            w-[38px]
            shrink-0
            items-center
            justify-center
            rounded-full
            transition-all
            hover:bg-gray-100
          "
        >
          <ChevronLeft size={22} className="text-[#2B2B2B]" strokeWidth={2.5} />
        </button>

        {/* Deadline List */}
        <div className="flex flex-col justify-center gap-7 pl-4">
          {deadlines.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              {/* Dot */}
              <div
                className={`
                  mt-[8px]
                  h-[10px]
                  w-[10px]
                  shrink-0
                  rounded-full
                  ${item.color}
                `}
              />

              {/* Text */}
              <div>
                <h3
                  className="
                    text-[18px]
                    font-[700]
                    leading-none
                    text-[#2B2B2B]
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-2
                    text-[15px]
                    font-[500]
                    text-[#7B7B7B]
                  "
                >
                  {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeadlinesCard;
