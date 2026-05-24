const Attendance = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full h-[350px] rounded-[30px] bg-white shadow-[0px_15px_25px_10px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* Current Status Badge */}
        <div className="absolute top-5 right-5 bg-violet-700/10 text-[#090958] text-[12px] font-semibold px-4 py-1 rounded-full tracking-wide">
          CURRENT STATUS
        </div>

        {/* Circle using SVG for precise thin arc strokes */}
        <div className="absolute top-[105px] left-1/2 -translate-x-1/2 w-[145px] h-[145px]">
          <svg width="145" height="145" viewBox="0 0 145 145">
            {/* Blue arc — full circle base */}
            <circle
              cx="72.5"
              cy="72.5"
              r="69"
              fill="none"
              stroke="#3d63ff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Red arc — rotated to sit at top-left near Absent card (~10 o'clock to 1 o'clock) */}
            <circle
              cx="72.5"
              cy="72.5"
              r="69"
              fill="none"
              stroke="#ff003c"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="108 325.5"
              strokeDashoffset="0"
              transform="rotate(-200 72.5 72.5)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-[36px] font-normal leading-none text-black">
              75%
            </h1>
            <p className="text-[10px] text-black mt-2 tracking-wide">
              ATTENDANCE
            </p>
          </div>
        </div>

        {/* Days Absent Card */}
        <div
          className="absolute w-24 h-18 rounded-full bg-[#FFE2E2] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center"
          style={{ top: "88px", left: "calc(50% - 140px)" }}
        >
          <p className="text-[10px] uppercase text-[#FF4646] font-medium">
            DAYS ABSENT
          </p>
          <h2 className="text-2xl leading-none font-light text-[#D90128] mt-1">
            15
          </h2>
        </div>

        {/* Days Present Card */}
        <div
          className="absolute w-24 h-18 rounded-full bg-[#E6EFFF] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center"
          style={{ top: "212px", left: "calc(50% + 28px)" }}
        >
          <p className="text-[10px] uppercase text-[#667DE9] font-medium">
            DAYS PRESENT
          </p>
          <h2 className="text-2xl leading-none font-light text-[#3A71FF] mt-1">
            112
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
