import React, { useState, useRef, useEffect } from "react";
import SearchBar from "../../../components/Student/Dashboard/SearchBar";
import NotificationDropdown from "../../../components/Student/Dashboard/NotificationDropdown";
import notification from "../../../assets/Student/Dashboard/TopBar/notification.svg";
import question from "../../../assets/Student/Dashboard/TopBar/question.svg";
import setting from "../../../assets/Student/Dashboard/TopBar/setting.png";
const TopBar: React.FC = () => {
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
  return (
    <div className="relative flex items-center justify-between px-6 py-4">
      {/* Search Bar */}
      <SearchBar />
      {/* Right Side Icons */}
      <div
        className="relative ml-4 flex items-center gap-3"
        ref={notificationRef}
      >
        {/* Notification Bell */}
        <button
          onClick={() => setShowNotifications((prev) => !prev)}
          className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-50 cursor-pointer"
        >
          <img src={notification} alt="Notifications" className="h-6 w-6" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        {/* Help */}
        <button className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-50 cursor-pointer">
          <img src={question} alt="Help" className="h-6 w-6" />
        </button>
        {/* Settings */}
        <button className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-50 cursor-pointer">
          <img src={setting} alt="Settings" className="h-6 w-6" />
        </button>
        {showNotifications && (
          <NotificationDropdown onClose={() => setShowNotifications(false)} />
        )}
      </div>
    </div>
  );
};
export default TopBar;
