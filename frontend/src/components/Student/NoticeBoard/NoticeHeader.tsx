import search from "../../../assets/Student/Dashboard/TopBar/search.svg";
import { getDynamicHeaderDate } from "../../../utils/dateHelpers";

const NoticeBoardHeader = () => {
  return (
    <div className="flex items-start justify-between pb-8">
      <div>
        <h1
          className="
          text-[44px]
          font-[700]
          leading-[54px]
          tracking-[-1.8px]
          text-[#2D3335]
        "
        >
          Notice Board
        </h1>
        <p className=" text-sm font-semibold text-gray-400 mt-1">
          {getDynamicHeaderDate()}
        </p>
      </div>

      {/* Search Only */}
      <button className="pt-2 transition-transform duration-200 hover:scale-105 cursor-pointer">
        <img src={search} alt="Search" className="h-[24px] w-[24px]" />
      </button>
    </div>
  );
};

export default NoticeBoardHeader;
