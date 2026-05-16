import React from "react";

const CurrentStatusCard: React.FC = () => {
  return (
    <div className="relative w-full rounded-3xl bg-white px-8 py-13 shadow-[0px_15px_25px_10px_rgba(0,0,0,0.04)]">
      {/* Status Badge */}
      <div className="absolute right-4 top-4  bg-violet-700/10 rounded-full  px-4 py-1">
        <p className="text-[14px] font-semibold uppercase tracking-wide text-[#090958] ">
          CURRENT STATUS
        </p>
      </div>

      {/* Circular Progress */}
      <div className="mt-10 flex justify-center">
        <div className="relative flex h-[128px] w-[128px] items-center justify-center rounded-full bg-[conic-gradient(#3A71FF_0deg_277deg,#FF002F_277deg_360deg)]">
          {/* Inner White Circle */}
          <div className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-white">
            <span className="text-[26px] font-bold text-black">77%</span>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="mt-12 flex items-center justify-between gap-4">
        {/* Present */}
        <div className="flex h-15 px-4 pt-4 pb-4 flex-1 flex-col items-center justify-center rounded-2xl bg-[#3A71FF]">
          <h3 className="text-xl font-bold leading-none text-white">112</h3>

          <p className="mt-2 text-[10px] font-semibold tracking-wide text-white/90">
            DAYS PRESENT
          </p>
        </div>

        {/* Absent */}
        <div className="flex h-15 px-4 pt-4 pb-4 flex-1 flex-col items-center justify-center rounded-2xl bg-[#B70828]">
          <h3 className="text-xl font-bold leading-none text-white">15</h3>

          <p className="mt-2 text-[10px] font-semibold tracking-wide text-white/90">
            DAYS ABSENT
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentStatusCard;
