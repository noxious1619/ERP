import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../../components/Student/Dashboard/SearchBar";
import NotificationDropdown from "../../../components/Student/Dashboard/NotificationDropdown";
import notification from "../../../assets/Student/Dashboard/TopBar/notification.svg";
import question from "../../../assets/Student/Dashboard/TopBar/question.svg";
import setting from "../../../assets/Student/Dashboard/TopBar/setting.png";

interface TopBarProps {
  /** 
   * URL of the logged-in user's profile image.
   * When dynamic: pass teacher.profileImage or student.profileImage from your auth/API context.
   */
  profileImageUrl?: string;
  /**
   * Where the avatar click navigates to.
   * Student dashboard  → "/student/profile"
   * Teacher dashboard  → "/teacher/profile"
   */
  profilePath?: string;
}

const TopBar: React.FC<TopBarProps> = ({
  profileImageUrl,
  profilePath = "/student/profile", // safe default — won't break existing student usage
}) => {
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center justify-between px-6 py-4">
      {/* Search Bar */}
      {/* <SearchBar /> */}

      {/* Right Side Icons */}
      <div
        className="relative ml-auto flex gap-3"
        ref={notificationRef}
      >
        {/* Notification Bell */}
        {/* <button
          onClick={() => setShowNotifications((prev) => !prev)}
          className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-50 cursor-pointer"
        >
          <img src={notification} alt="Notifications" className="h-6 w-6" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button> */}

        {/* Help */}
        {/* <button className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-50 cursor-pointer">
          <img src={question} alt="Help" className="h-6 w-6" />
        </button> */}

        {/* Settings */}
        {/* <button className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-50 cursor-pointer">
          <img src={setting} alt="Settings" className="h-6 w-6" />
        </button> */}

        {/* Profile Avatar — navigates to the path passed via prop */}
        <button
          onClick={() => navigate(profilePath)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full overflow-hidden
                     ring-2 ring-white shadow-sm hover:ring-blue-300 transition-all cursor-pointer"
          aria-label="Go to profile"
        >
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            // Fallback: solid blue circle with first initial — replace when API is wired
            <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white text-sm font-bold">
              P
            </div>
          )}
        </button>

        {/* Notification Dropdown */}
        {showNotifications && (
          <NotificationDropdown onClose={() => setShowNotifications(false)} />
        )}
      </div>
    </div>
  );
};

export default TopBar;