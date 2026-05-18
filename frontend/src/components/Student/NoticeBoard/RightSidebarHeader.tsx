import { useState, useRef, useEffect } from "react";
import notification from "../../../assets/Student/Dashboard/TopBar/notification.svg";
import profileImage from "../../../assets/Student/Timetable/Header/profile.png";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "../../../components/Student/Dashboard/NotificationDropdown";

const RightSidebarHeader = () => {
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
    <div className="flex items-center justify-end gap-7 ">
      {/*  Notification  */}
      <div className="relative" ref={notificationRef}>
        <button
          onClick={() => setShowNotifications((prev) => !prev)}
          className="text-[#5C5C5C] transition-colors hover:text-[#3F5BF6] cursor-pointer"
        >
          <img src={notification} alt="Notification" className="h-6 w-6" />
          {/* Unread dot */}
          <div className="absolute right-[1px] top-[2px] h-[8px] w-[8px] rounded-full bg-[#FF4B6E]" />
        </button>
        {showNotifications && (
          <NotificationDropdown onClose={() => setShowNotifications(false)} />
        )}
      </div>
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
  );
};

export default RightSidebarHeader;
