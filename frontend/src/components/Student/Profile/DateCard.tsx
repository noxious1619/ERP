const DateCard = () => {
  return (
    <div className="overflow-hidden rounded-[2px] bg-[#090958] shadow-md">
      <div className="flex">
        {/* Left */}
        <div className="flex h-[86px] w-[78px] flex-col justify-between border-r border-white/20 px-3 py-2">
          <h2 className="text-[28px] font-semibold leading-none text-white">
            24
          </h2>

          <p className="text-[13px] font-medium text-white">Mon</p>
        </div>

        {/* Right */}
        <div className="flex h-[86px] w-[78px] flex-col justify-between px-3 py-2 text-right">
          <h2 className="text-[28px] font-semibold leading-none text-white">
            08
          </h2>

          <p className="text-[13px] font-medium text-white">Aug</p>
        </div>
      </div>
    </div>
  );
};

export default DateCard;
