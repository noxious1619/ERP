import arrow from "../../../assets/Student/Attendance/arrow.svg";

const monthlyBars = [
  [72, 84],
  [80, 90],
  [96, 88],
  [72, 72],
  [94, 90],
  [0, 86],
  [82, 92],
  [80, 96],
  [92, 72],
  [0, 0],
  [0, 0],
  [0, 0],
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const AttendanceYearlyChart = () => {
  return (
    <div className="w-full bg-neutral-100/10 rounded-3xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.05)] px-8 pb-8 pt-7 mt-16">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h2 className="text-[18px] font-semibold text-[#1F1F1F]">
          Attendance throughout the year
        </h2>

        {/* Expand Icon */}
        <img src={arrow} alt="Expand" className="size-4 cursor-pointer" />
      </div>

      {/* Chart */}
      <div className="mt-10 flex justify-center">
        <div className="flex items-end gap-[20px]">
          {monthlyBars.map((bars, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Bars */}
              <div className="flex h-[120px] items-end gap-[8px]">
                {[0, 1].map((barIndex) => {
                  const value = bars[barIndex];

                  return (
                    <div
                      key={barIndex}
                      className={`w-[3px] rounded-full ${
                        value === 0 ? "bg-[#E3E3E3]" : "bg-[#3F6CF6]"
                      }`}
                      style={{
                        height: `${value === 0 ? 102 : value}px`,
                      }}
                    />
                  );
                })}
              </div>

              {/* Month */}
              <span className="mt-5 text-[13px] font-medium text-[#8D8D8D]">
                {months[index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mt-4 h-[1px] w-full bg-[#EFEFEF]" />

      {/* Footer */}
      <div className="mt-4 text-center">
        <p className="text-[14px] font-medium text-[#8B8B8B]">
          Your attendance has increased by
        </p>

        <p className="text-[12px] font-medium text-[#8B8B8B]">
          <span className="font-bold text-[#2436A8]">4.2%</span> compared to
          last month.
        </p>
      </div>
    </div>
  );
};

export default AttendanceYearlyChart;
