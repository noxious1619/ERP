import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import notification from "../../../assets/Student/Dashboard/TopBar/notification.svg";
import profileImage from "../../../assets/Student/Timetable/Header/profile.png";
import NotificationDropdown from "../../../components/Student/Dashboard/NotificationDropdown";
import { getDynamicHeaderDate } from "../../../utils/dateHelpers";

const TimetableHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const isWeekly = location.pathname === "/student/timetable/weekly";

  return (
    <div className="flex items-start justify-between">
      {/* Left Content */}
      <div>
        <h1 className="text-[44px] font-bold leading-[52px] text-[#2D3335]">
          My Timetable
        </h1>
        <p className="text-sm font-semibold text-gray-400 mt-1">
          {getDynamicHeaderDate()}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-10 pt-2">
        {/* Toggle */}
        <div className="flex items-center rounded-full bg-[#F2F2F2] p-[4px] shadow-sm">
          <button
            onClick={() => navigate("/student/timetable")}
            className={`rounded-full px-7 py-2 text-[16px] font-semibold transition-all duration-300
              ${!isWeekly ? "bg-white text-[#3F5BF6] shadow-sm" : "text-[#5E5E5E]"}`}
          >
            Daily
          </button>
          <button
            onClick={() => navigate("/student/timetable/weekly")}
            className={`rounded-full px-7 py-2 text-[16px] font-semibold transition-all duration-300
              ${isWeekly ? "bg-white text-[#3F5BF6] shadow-sm" : "text-[#5E5E5E]"}`}
          >
            Weekly
          </button>
        </div>

        {/*  Notification  */}
        {/* <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="text-[#5C5C5C] transition-colors hover:text-[#3F5BF6] cursor-pointer"
          >
            <img src={notification} alt="Notification" className="h-6 w-6" />
            <div className="absolute right-[1px] top-[2px] h-[8px] w-[8px] rounded-full bg-[#FF4B6E]" />
          </button>
          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div> */}

        {/* Profile */}
        <div
          onClick={() => navigate("/student/profile")}
          className="h-[52px] w-[52px] overflow-hidden rounded-full border-[3px] border-white shadow-md cursor-pointer"
        >
          <img
            src={profileImage}
            alt="Student"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default TimetableHeader;
