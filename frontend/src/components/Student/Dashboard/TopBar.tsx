import React, { useState, useRef, useEffect } from "react";
import SearchBar from "../../../components/Student/Dashboard/SearchBar";
import NotificationDropdown from "../../../components/Student/Dashboard/NotificationDropdown";
import notification from "../../../assets/Student/Dashboard/TopBar/notification.svg";
import question from "../../../assets/Student/Dashboard/TopBar/question.svg";
import setting from "../../../assets/Student/Dashboard/TopBar/setting.png";
const TopBar: React.FC = () => {
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
  return (
    <div className="relative flex items-center justify-between px-6 py-4">
      {/* Search Bar */}
      <SearchBar />
      {/* Right Side Icons */}
      <div className="relative ml-4 flex items-center gap-3" ref={dropdownRef}>
        {/* Notification Bell */}
        <button
          onClick={() => setShowNotifications((prev) => !prev)}
          className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-50"
        >
          <img src={notification} alt="Notifications" className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        {/* Help */}
        <button className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-50">
          <img src={question} alt="Help" className="h-4 w-4" />
        </button>
        {/* Settings */}
        <button className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-50">
          <img src={setting} alt="Settings" className="h-4 w-4" />
        </button>
        {/* Dropdown */}
        {showNotifications && <NotificationDropdown />}
      </div>
    </div>
  );
};
export default TopBar;
