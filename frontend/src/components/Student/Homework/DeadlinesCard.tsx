const DeadlinesCard = () => {
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
        px-8
        py-9
        shadow-[0px_8px_30px_rgba(0,0,0,0.03)]
      "
    >
      {/* Heading */}
      <h2
        className="
          text-[22px]
          font-[700]
          text-[#2B2B2B]
        "
      >
        Upcoming Deadlines
      </h2>

      {/* Deadline List */}
      <div className="mt-10 flex flex-col gap-10">
        {deadlines.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            {/* Dot */}
            <div
              className={`
                mt-[8px]
                h-[10px]
                w-[10px]
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
  );
};

export default DeadlinesCard;