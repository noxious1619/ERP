import SearchBar from "../../../components/Student/Dashboard/SearchBar";
import filterIcon from "../../../assets/Student/Homework/filter.svg";
import sortIcon from "../../../assets/Student/Homework/sort.svg";

const tabs = ["All", "Pending", "Completed", "Overdue"];

// 1. Add an interface to accept the state and the updater function from the parent
interface HomeworkFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const HomeworkFilters: React.FC<HomeworkFiltersProps> = ({ activeTab, onTabChange }) => {
  // 2. We removed the internal useState. This component is now fully controlled by its parent!
  
  return (
    <div className="mt-14">
      {/* Search Bar Only */}
      <div className="w-full">
        <SearchBar />
      </div>
      {/* Tabs + Actions Row */}
      <div className="mt-8 flex items-center justify-between border-b border-[#E8E8E8] ">
        {/* Tabs */}
        <div className="flex items-center gap-14">
          {tabs.map((tab) => (
            <button
              key={tab}
              // 3. Trigger the parent's function when clicked
              onClick={() => onTabChange(tab)}
              className={`
                relative
                text-[18px]
                font-semibold
                transition-all
                duration-200
                cursor-pointer
                ${activeTab === tab ? "text-[#171B7A]" : "text-[#626262]"}
              `}
            >
              {tab}

              {/* Active Underline */}
              {activeTab === tab && (
                <div
                  className="
                    absolute
                    left-0
                    top-[42px]
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
        
        {/* Right Actions */}
        <div className="flex items-center gap-5">
          {/* Filter */}
          <button
            className="
              flex h-[58px] min-w-[110px] items-center justify-center gap-3 rounded-[20px] bg-white px-5 mb-2 shadow-[0px_4px_10px_rgba(0,0,0,0.08)]
            "
          >
            <img src={filterIcon} alt="Filter" className="h-[18px] w-[18px]" />
            <span className="text-[18px] font-medium text-[#5D5D5D]">Filter</span>
          </button>

          {/* Sort */}
          <button
            className="
              flex h-[58px] min-w-[110px] items-center justify-center gap-3 rounded-[20px] bg-white px-5 shadow-[0px_4px_10px_rgba(0,0,0,0.08)]
            "
          >
            <img src={sortIcon} alt="Sort" className="h-[18px] w-[18px]" />
            <span className="text-[18px] font-medium text-[#5D5D5D]">Sort</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeworkFilters;