const DateCard = () => {
  return (
    <div className="relative h-[96px] w-[170px] overflow-hidden bg-[#5F8BFD]">
      {/* Horizontal Divider */}
      <div className="absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 bg-white/35" />

      {/* Vertical Divider */}
      <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-white/35" />

      <div className="flex h-full">
        {/* Left */}
        <div className="relative w-1/2 px-5 py-3">
          <h2 className="mt-2 text-[44px] font-semibold leading-[42px] tracking-[-2px] text-white">
            24
          </h2>

          <p className="absolute bottom-1 left-2 text-[14px] font-medium text-white">
            Mon
          </p>
        </div>

        {/* Right */}
        <div className="relative w-1/2 px-5 py-3">
          <h2 className="mt-2 text-right text-[44px] font-semibold leading-[42px] tracking-[-2px] text-white">
            08
          </h2>

          <p className="absolute bottom-1 right-2 text-[14px] font-medium text-white">
            Aug
          </p>
        </div>
      </div>
    </div>
  );
};

export default DateCard;
