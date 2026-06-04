const statsData = { missing: 1, late: 3, submitted: 50 };

const TeacherStatsCard = () => {
  return (
    <div className="rounded-[18px] bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.07)] border border-[#EAECF0] overflow-hidden">
      {/* Class label pill */}
      <div className="flex justify-center pt-4 pb-3 border-b border-[#F2F4F7]">
        <span className="text-[14px] font-semibold text-[#4F52A3]">
          Class X
        </span>
      </div>

      {/* Stats rows */}
      <div className="px-5 py-4 flex flex-col gap-4">
        {/* Missing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            <span className="text-[13px] font-bold text-red-500 tracking-wide">
              MISSING
            </span>
          </div>
          <span className="text-[15px] font-bold text-gray-800">
            {statsData.missing}
          </span>
        </div>

        {/* Late */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-500 inline-block" />
            <span className="text-[13px] font-bold text-gray-600 tracking-wide">
              LATE
            </span>
          </div>
          <span className="text-[15px] font-bold text-gray-800">
            {statsData.late}
          </span>
        </div>

        {/* Submitted */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            <span className="text-[13px] font-bold text-blue-600 tracking-wide">
              SUBMITTED
            </span>
          </div>
          <span className="text-[15px] font-bold text-gray-800">
            {statsData.submitted}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeacherStatsCard;
