import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import notification from "../../../assets/Student/Dashboard/TopBar/notification.svg";
import search from "../../../assets/Student/Dashboard/TopBar/search.svg";
import profileImage from "../../../assets/Student/Timetable/Header/profile.png";
import NotificationDropdown from "../../Student/Dashboard/NotificationDropdown";
const HomeworkHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
  return (
    <div className="flex w-full items-start">
      {/* Left Section */}
      <div>
        <h1 className="text-[44px] font-bold leading-[64px] tracking-[-2px] text-[#2D3335]">
          Homework & Tasks
        </h1>

        <p className="mt-3 text-[18px] font-medium text-[#6F6F6F]">
          Manage and track all your assignments
        </p>
      </div>

      {/* Right Section */}
      <div className="ml-auto flex items-center gap-8 pt-3 pr-2">
        {/* Search */}
        <button className="transition-transform duration-200 hover:scale-105 cursor-pointer">
          <img src={search} alt="Search" className="h-[26px] w-[26px]" />
        </button>

        {/* Notification */}
        <div className="relative" ref={notificationRef}>
          <button
            className="transition-transform duration-200 hover:scale-105 cursor-pointer"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <img
              src={notification}
              alt="Notification"
              className="h-[26px] w-[26px]"
            />
          </button>
          {/* Dropdown */}
          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}

          {/* Red Dot */}
          <div className="absolute right-[1px] top-[2px] h-[9px] w-[9px] rounded-full bg-[#E54866]" />
        </div>

        {/* Profile */}
        <div
          onClick={() => navigate("/student/profile")}
          className="h-[58px] w-[58px] overflow-hidden rounded-full border-[3px] border-white shadow-[0px_4px_14px_rgba(0,0,0,0.12)] cursor-pointer "
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

export default HomeworkHeader;
