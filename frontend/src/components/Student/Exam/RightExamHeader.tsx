import { useState, useRef, useEffect } from "react";
import NotificationDropdown from "../../../components/Student/Dashboard/NotificationDropdown";
import notification from "../../../assets/Student/Dashboard/TopBar/notification.svg";
import question from "../../../assets/Student/Dashboard/TopBar/question.svg";
import setting from "../../../assets/Student/Dashboard/TopBar/setting.png";

const RightHeader = () => {
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
    <div className="flex items-center justify-end gap-8">
      {/* Notification */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications((prev) => !prev)}
          className="transition-transform duration-200 hover:scale-105 cursor-pointer"
        >
          <img
            src={notification}
            alt="Notification"
            className="h-[24px] w-[24px]"
          />
        </button>
        {/* Dropdown */}
        {showNotifications && <NotificationDropdown />}

        {/* Red Dot */}
        <div
          className="
            absolute
            right-0
            top-[1px]
            h-[8px]
            w-[8px]
            rounded-full
            bg-[#E54866]
          "
        />
      </div>

      {/* Help */}
      <button className="transition-transform duration-200 hover:scale-105">
        <img src={question} alt="Help" className="h-[24px] w-[24px]" />
      </button>

      {/* Settings */}
      <button className="transition-transform duration-200 hover:scale-105">
        <img src={setting} alt="Settings" className="h-[24px] w-[24px]" />
      </button>
    </div>
  );
};

export default RightHeader;
