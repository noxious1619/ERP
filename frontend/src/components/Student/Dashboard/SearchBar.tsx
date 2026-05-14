import React from "react";
import search from "../../../assets/Student/Dashboard/TopBar/search.svg";
const SearchBar: React.FC = () => {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 w-full  bg-slate-100/20 rounded-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] outline-zinc-600/40">
      <img src={search} alt="Search" className="w-4 h-4 text-gray-500" />
      <input
        type="text"
        placeholder="Search courses, teachers..."
        className="bg-transparent outline-none text-md text-gray-500 placeholder:text-gray-400 w-full pl-4"
      />
    </div>
  );
};
export default SearchBar;
