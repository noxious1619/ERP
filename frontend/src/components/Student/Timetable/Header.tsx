import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import search from "../../../assets/Student/Dashboard/TopBar/search.svg";
import notification from "../../../assets/Student/Dashboard/TopBar/notification.svg";
import profileImage from "../../../assets/Student/Timetable/Header/profile.png";
import NotificationDropdown from "../../../components/Student/Dashboard/NotificationDropdown";
const TimetableHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
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
        <h1 className="text-[44px] font-bold leading-[52px] text-[#3851F7]">
          My Timetable
        </h1>
        <p className="mt-2 text-[16px] font-medium text-[#6B6B6B]">
          Today is Monday, Jan 12th
        </p>
      </div>
      {/* Right Controls */}
      <div className="flex items-center gap-6 pt-2">
        {/* Toggle */}
        <div className="flex items-center rounded-full bg-[#F2F2F2] p-[4px] shadow-sm">
          {/* Daily */}
          <button
            onClick={() => navigate("/student/timetable")}
            className={`rounded-full px-7 py-2 text-[16px] font-semibold transition-all duration-300
              ${
                !isWeekly
                  ? "bg-white text-[#3F5BF6] shadow-sm"
                  : "text-[#5E5E5E]"
              }
            `}
          >
            Daily
          </button>
          {/* Weekly */}
          <button
            onClick={() => navigate("/student/timetable/weekly")}
            className={`rounded-full px-7 py-2 text-[16px] font-semibold transition-all duration-300
              ${
                isWeekly
                  ? "bg-white text-[#3F5BF6] shadow-sm"
                  : "text-[#5E5E5E]"
              }
            `}
          >
            Weekly
          </button>
        </div>
        {/* Search */}
        <button className="text-[#5C5C5C] transition-colors hover:text-[#3F5BF6]">
          <img src={search} alt="Search" className="h-6 w-6" />
        </button>
        {/* Notification */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="text-[#5C5C5C] transition-colors hover:text-[#3F5BF6] "
          >
            <img src={notification} alt="Notification" className="h-6 w-6" />

            {/* Dot */}
            <div className="absolute right-[1px] top-[2px] h-[8px] w-[8px] rounded-full bg-[#FF4B6E]" />
          </button>
          {/* Dropdown */}
          {showNotifications && <NotificationDropdown />}
        </div>
        {/* Profile */}
        <div className="h-[52px] w-[52px] overflow-hidden rounded-full border-[3px] border-white shadow-md">
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
