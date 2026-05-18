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
      <div className="flex flex-1 h-screen">
        {/* LEFT CONTENT */}
        <div className="flex flex-1 flex-col h-screen">
          {/* Sticky Left Header + Filters */}
          <div className="px-14 pt-10 shrink-0 bg-[#F7F7F7]">
            <NoticeBoardHeader />
            <Filters />
          </div>
          {/* Scrollable Left Body */}
          <div className="flex-1 overflow-y-auto px-14 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <NoticeCards />
          </div>
        </div>
        {/* RIGHT SIDEBAR */}
        <div className="w-[360px] shrink-0 bg-gray-100 mr-2 ml-2 sticky top-0 h-screen flex flex-col">
          {/* Sticky Right Header */}
          <div className="px-2 py-4 pt-8 shrink-0">
            <RightSidebarHeader />
          </div>
          {/* Scrollable Right Body */}
          <div className="flex-1 overflow-y-auto px-6 pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col gap-6">
              <Calendar />
              <CalendarMessageCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
