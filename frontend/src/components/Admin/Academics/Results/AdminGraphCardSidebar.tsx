import React from "react";

interface SubjectData {
  label: string;
  pct: number;
}

const subjectsComparison: SubjectData[] = [
  { label: "MATH", pct: 55 },
  { label: "GEO", pct: 55 },
  { label: "BIO", pct: 80 },
  { label: "CHEM", pct: 45 },
  { label: "PHY", pct: 90 },
  { label: "ENG", pct: 55 },
];

interface AdminGraphCardSidebarProps {
  onClick: () => void;
}

const AdminGraphCardSidebar: React.FC<AdminGraphCardSidebarProps> = ({ onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[24px] border border-[#EAECF0] p-6 shadow-sm w-full flex items-center justify-between gap-4 cursor-pointer hover:border-[#4D8DFF] hover:shadow-md transition-all active:scale-[0.99]"
    >
      {/* Left side text info */}
      <div className="flex flex-col justify-between h-[110px] w-[120px] shrink-0 text-left">
        <div>
          <h4 className="text-[11px] font-bold text-gray-500 leading-tight">
            Result Comapred to<br />Other Subjects
          </h4>
        </div>
        <div className="mt-auto">
          <h3 className="text-[22px] font-extrabold text-gray-800 leading-none">
            CLASS - X
          </h3>
          <span className="text-[12px] font-semibold text-gray-400 mt-1 block">
            Section - A
          </span>
        </div>
      </div>

      {/* Right side bar chart */}
      <div className="flex-1 flex justify-between items-end h-[110px] relative px-1">
        {subjectsComparison.map((sub, idx) => {
          const isEng = sub.label === "ENG";
          return (
            <div key={idx} className="flex flex-col items-center justify-end h-full flex-1">
              {/* Visual Bar Wrapper */}
              <div className="h-[85px] w-full flex items-end justify-center">
                <div 
                  style={{ height: `${sub.pct}%` }}
                  className={`w-[18px] rounded-[6px] transition-all hover:opacity-85 ${
                    isEng ? "bg-[#4D8DFF]" : "bg-[#B2CCFF]"
                  }`}
                  title={`${sub.label}: ${sub.pct}%`}
                />
              </div>

              {/* Label */}
              <span className="text-[8px] font-bold text-gray-400 mt-2">
                {sub.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminGraphCardSidebar;
