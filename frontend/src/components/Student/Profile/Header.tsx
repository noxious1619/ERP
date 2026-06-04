import { useState, useRef, useEffect } from "react";
import notification from "../../../assets/Student/Dashboard/TopBar/notification.svg";
import search from "../../../assets/Student/Dashboard/TopBar/search.svg";
import profileImage from "../../../assets/Student/Timetable/Header/profile.png";
import NotificationDropdown from "../../Student/Dashboard/NotificationDropdown";
import { getDynamicHeaderDate } from "../../../utils/dateHelpers";
const ProfileHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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
  return (
    <div className="flex items-start justify-between">
      {/* Left Content */}
      <div>
        <h1 className="text-[50px] font-bold leading-[60px] tracking-[-2px] text-[#2D3335] px-4">
          Profile
        </h1>
        <p className=" text-sm font-semibold text-gray-400 mt-1 px-4">
          {getDynamicHeaderDate()}
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-8 pt-2">
        {/* Search */}
        <button className="transition-transform duration-200 hover:scale-105 cursor-pointer">
          <img src={search} alt="Search" className="h-[26px] w-[26px]" />
        </button>

        {/* Notification */}
        <div className="relative">
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
        <div className="h-[58px] w-[58px] overflow-hidden rounded-full border-[3px] border-white shadow-[0px_4px_14px_rgba(0,0,0,0.12)] cursor-pointer ">
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

export default ProfileHeader;
