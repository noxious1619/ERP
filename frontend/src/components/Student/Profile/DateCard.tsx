const DateCard = () => {
  const now = new Date();

  const day = now.toLocaleDateString("en-US", { weekday: "short" }); // "Mon"
  const date = now.getDate(); // 24
  const month = now.toLocaleDateString("en-US", { month: "short" }); // "Aug"

  return (
    <div className="relative h-[96px] w-[170px] overflow-hidden bg-[#5F8BFD]">
      {/* Horizontal Divider */}
      <div className="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 bg-white/35" />

      {/* Vertical Divider */}
      <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-white/35" />

      <div className="flex h-full">
        {/* Left — Day number + Day name */}
        <div className="relative w-1/2 px-5 py-3">
          <h2 className="mt-2 text-[44px] font-semibold leading-[42px] tracking-[-2px] text-white">
            {date}
          </h2>
          <p className="absolute bottom-1 left-2 text-[14px] font-medium text-white">
            {day}
          </p>
        </div>

        {/* Right — Month number + Month name */}
        <div className="relative w-1/2 px-5 py-3">
          <h2 className="mt-2 text-right text-[44px] font-semibold leading-[42px] tracking-[-2px] text-white">
            {String(now.getMonth() + 1).padStart(2, "0")}
          </h2>
          <p className="absolute bottom-1 right-2 text-[14px] font-medium text-white">
            {month}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DateCard;
