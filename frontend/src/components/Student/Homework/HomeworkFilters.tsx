const tabs = ["All", "Pending", "Completed", "Overdue"];

interface HomeworkFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const HomeworkFilters: React.FC<HomeworkFiltersProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="mt-14">
      {/* Tabs + Actions Row */}
      <div className="mt-8 flex items-center justify-between border-b border-[#E8E8E8]">
        {/* Tabs */}
        <div className="flex items-center gap-14">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className="relative flex flex-col items-center pb-[15px] cursor-pointer"
            >
              <span
                className={`
                  text-[18px]
                  font-semibold
                  whitespace-nowrap
                  transition-all
                  duration-200
                  ${activeTab === tab ? "text-[#171B7A]" : "text-[#626262]"}
                `}
              >
                {tab}
              </span>

              {/* Active Underline */}
              {activeTab === tab && (
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    h-[3px]
                    w-full
                    rounded-full
                    bg-[#171B7A]
                  "
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeworkFilters;
