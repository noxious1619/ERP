import { useState } from "react";
import SearchBar from "../../../components/Student/Dashboard/SearchBar";
import filterIcon from "../../../assets/Student/Homework/filter.svg";
import sortIcon from "../../../assets/Student/Homework/sort.svg";

const tabs = ["All", "Pending", "Completed", "Overdue"];

const HomeworkFilters = () => {
  const [activeTab, setActiveTab] = useState("Pending");

  return (
    <div className="mt-14">
      {/* Tabs */}
      <div className="flex items-center gap-10 border-b border-[#E8E8E8] pb-5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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

      {/* Search + Actions */}
      <div className="mt-7 flex w-full items-center gap-5">
        {/* Search */}
        <div className="flex-1">
          <SearchBar />
        </div>

        {/* Filter */}
        <button
          className="
      flex
      h-[62px]
      min-w-[120px]
      items-center
      justify-center
      gap-3
      px-4  bg-gray-100/20 rounded-3xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)] 
    "
        >
          <img src={filterIcon} alt="Filter" className="h-[18px] w-[18px]" />

          <span className="text-[18px] font-medium text-[#5D5D5D]">Filter</span>
        </button>

        {/* Sort */}
        <button
          className="
      flex
      h-[62px]
      min-w-[120px]
      items-center
      justify-center
      gap-3
      px-4  bg-gray-100/20 rounded-3xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)] 
    "
        >
          <img src={sortIcon} alt="Sort" className="h-[18px] w-[18px]" />

          <span className="text-[18px] font-medium text-[#5D5D5D]">Sort</span>
        </button>
      </div>
    </div>
  );
};

export default HomeworkFilters;
