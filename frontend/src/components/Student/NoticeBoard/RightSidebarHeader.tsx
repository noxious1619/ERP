import { useState, useRef, useEffect } from "react";
import notification from "../../../assets/Student/Dashboard/TopBar/notification.svg";
import question from "../../../assets/Student/Dashboard/TopBar/question.svg";
import setting from "../../../assets/Student/Dashboard/TopBar/setting.png";
import NotificationDropdown from "../../../components/Student/Dashboard/NotificationDropdown";

const RightSidebarHeader = () => {
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
    <div className="flex items-center justify-end gap-7">
      {/* Notification */}

      <div
        onClick={() => setShowNotifications((prev) => !prev)}
        className="relative cursor-pointer"
      >
        <img
          src={notification}
          alt="Notification"
          className="h-[24px] w-[24px] cursor-pointer"
        />
        {/* Dropdown */}
        {showNotifications && <NotificationDropdown />}

        <div className="absolute right-0 top-0 h-[8px] w-[8px] rounded-full bg-[#E54866]" />
      </div>

      {/* Help */}
      <img
        src={question}
        alt="Help"
        className="h-[24px] w-[24px] cursor-pointer"
      />

      {/* Settings */}
      <img
        src={setting}
        alt="Settings"
        className="h-[24px] w-[24px] cursor-pointer"
      />
    </div>
  );
};

export default RightSidebarHeader;
