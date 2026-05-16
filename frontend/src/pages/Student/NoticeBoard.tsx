import Navbar from "../../components/Student/Dashboard/Navbar";
import NoticeBoardHeader from "../../components/Student/NoticeBoard/NoticeHeader";
import Filters from "../../components/Student/NoticeBoard/Filter";
import NoticeCards from "../../components/Student/NoticeBoard/NoticeCards";
import Calendar from "../.../../../components/Student/Dashboard/Calendar";
import CalendarMessageCard from "../.../../../components/Student/Dashboard/CalendarMessageCard";
import RightSidebarHeader from "../../components/Student/NoticeBoard/RightSidebarHeader";

const NoticeBoard = () => {
  return (
    <div className="flex min-h-screen bg-[#F7F7F7]">
      <Navbar />
      {/* MAIN LAYOUT */}
      <div className="flex flex-1  h-screen overflow-y-auto">
        {/* LEFT CONTENT */}
        <div className="flex-1 px-14 py-10 ">
          <NoticeBoardHeader />
          <Filters />
          <NoticeCards />
        </div>
        {/* RIGHT SIDEBAR */}
        <div
          className="
      w-[360px]
        shrink-0
        bg-gray-100
        px-6
    py-10
    mr-2
    ml-2
      "
        >
          <RightSidebarHeader />
          <div className="flex flex-col gap-8 mt-26">
            <Calendar />
            <CalendarMessageCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
