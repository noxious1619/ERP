const statsCards = [
  {
    id: 1,
    title: "PENDING",
    value: "3",
    bg: "bg-white",
    border: "border border-transparent",
    titleColor: "text-[#5C5C5C]",
    valueColor: "text-[#2E3338]",
  },
  {
    id: 2,
    title: "COMPLETED",
    value: "12",
    bg: "bg-white",
    border: "border border-transparent",
    titleColor: "text-[#5C5C5C]",
    valueColor: "text-[#2E3338]",
  },
  {
    id: 3,
    title: "OVERDUE",
    value: "1",
    bg: "bg-rose-400/20",
    border: "border border-[#F97386]/10",
    titleColor: "text-[#A8364B]",
    valueColor: "text-[#A8364B]",
  },
  {
    id: 4,
    title: "DUE TODAY",
    value: "1",
    bg: "bg-pink-200/30",
    border: "border border-stone-500/10",
    titleColor: "text-[#7C5270]",
    valueColor: "text-[#7C5270]",
  },
];

const HomeworkStatsCards = () => {
  return (
    <div className="mt-2 flex items-center  gap-6">
      {statsCards.map((card) => (
        <div
          key={card.id}
          className={`
            flex
            w-full
            py-6
            px-8
            rounded-3xl
            flex-col
            items-center
            justify-center
             shadow-[0px_4px_24px_0px_rgba(110,59,216,0.04)]
            ${card.bg}
            ${card.border}
          `}
        >
          {/* Title */}
          <span
            className={`
              text-sm
              font-bold
              tracking-[1.6px]
              ${card.titleColor}
            `}
          >
            {card.title}
          </span>

          {/* Value */}
          <h2
            className={`
              mt-3
              text-3xl
              font-bold
              leading-none
              ${card.valueColor}
            `}
          >
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default HomeworkStatsCards;
