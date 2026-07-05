import React from "react";

interface Performer {
  rank: number;
  name: string;
  rollNo: string;
  marks: string;
}

const performers: Performer[] = [
  { rank: 1, name: "Diya Patel", rollNo: "002", marks: "20/20" },
  { rank: 2, name: "Kavya Mehta", rollNo: "017", marks: "19/20" },
  { rank: 3, name: "Vihaan Kumar", rollNo: "005", marks: "17/20" },
];

const TeacherTopPerformersCard: React.FC = () => {
  return (
    <div className="bg-white rounded-[24px] border border-[#FDE858]/60 p-5 shadow-sm w-full">
      {/* Centered Header */}
      <div className="text-center mb-4">
        <h4 className="text-[14px] font-bold text-[#D97706] tracking-wide uppercase">
          Top Performers
        </h4>
      </div>

      {/* Performers Rows */}
      <div className="flex flex-col gap-3">
        {performers.map((p, idx) => (
          <div 
            key={idx} 
            className="relative overflow-hidden flex items-center justify-between p-4 pl-10 rounded-2xl bg-[#FFFDF0] border border-[#FEF08A]/40"
          >
            {/* Corner Badge */}
            <div className="absolute top-0 left-0 w-8 h-8 overflow-hidden pointer-events-none">
              <div className={`absolute top-[-14px] left-[-14px] w-10 h-10 rotate-45 ${
                p.rank === 1 ? "bg-[#FBBF24]" : p.rank === 2 ? "bg-[#9CA3AF]" : "bg-[#D97706]"
              }`} />
              <span className="absolute top-[1.5px] left-[4px] text-[9px] font-black text-white z-10">
                {p.rank}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <p className="text-[14px] font-bold text-gray-800 leading-tight">
                  {p.name}
                </p>
                <span className="text-[10px] font-semibold text-gray-400">
                  {p.rollNo}
                </span>
              </div>
            </div>

            {/* Score */}
            <span className="text-[14px] font-extrabold text-[#D97706]">
              {p.marks}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherTopPerformersCard;
