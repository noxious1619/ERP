import { ChevronRight } from "lucide-react";

interface StatusCardProps {
  onOpenDeadlines: () => void;
}

const StatusCard = ({ onOpenDeadlines }: StatusCardProps) => {
  const statusData = [
    {
      label: "OVERDUE",
      count: 1,
      dot: "bg-[#D8072E]",
      text: "text-[#D8072E]",
    },
    {
      label: "DUE TODAY",
      count: 2,
      dot: "bg-[#A8364B]",
      text: "text-[#A8364B]",
    },
    {
      label: "PENDING",
      count: 3,
      dot: "bg-[#7C5270]",
      text: "text-[#7C5270]",
    },
    {
      label: "COMPLETED",
      count: 14,
      dot: "bg-[#0032B4]",
      text: "text-[#0032B4]",
    },
  ];

  return (
    <div
      className="
        w-full
        rounded-[34px]
        bg-white
        px-8
        py-9
        shadow-[0px_8px_30px_rgba(0,0,0,0.03)]
      "
    >
      <div className="flex items-center gap-4">
        {/* Status List — takes all available space */}
        <div className="flex flex-1 flex-col gap-7">
          {statusData.map((item, index) => (
            <div key={index} className="flex items-center">
              {/* Dot */}
              <div
                className={`
                  h-[9px]
                  w-[9px]
                  shrink-0
                  rounded-full
                  ${item.dot}
                `}
              />

              {/* Label — grows to push count to the right */}
              <p
                className={`
                  ml-4
                  flex-1
                  text-[18px]
                  font-[700]
                  tracking-wide
                  ${item.text}
                `}
              >
                {item.label}
              </p>

              {/* Count box — fixed size, always right-aligned */}
              <div
                style={{
                  width: 34,
                  height: 34,
                  border: "1.5px solid #D1D5DB",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#ffffff",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#2B2B2B",
                  flexShrink: 0,
                }}
              >
                {item.count}
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={onOpenDeadlines}
          className="
            flex
            h-[40px]
            w-[40px]
            shrink-0
            items-center
            justify-center
            rounded-full
            transition-all
            hover:bg-gray-100
          "
        >
          <ChevronRight
            size={22}
            className="text-[#2B2B2B] ml-4"
            strokeWidth={2.5}
          />
        </button>
      </div>
    </div>
  );
};

export default StatusCard;
