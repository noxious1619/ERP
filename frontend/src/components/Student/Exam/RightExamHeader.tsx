import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "../../../components/Student/Dashboard/NotificationDropdown";
import notification from "../../../assets/Student/Dashboard/TopBar/notification.svg";
import search from "../../../assets/Student/Dashboard/TopBar/search.svg";
import profileImage from "../../../assets/Student/Timetable/Header/profile.png";

const RightHeader = () => {
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
    <div className="flex items-center justify-end gap-8 items-start ">
    
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
        className="h-[52px] w-[52px] overflow-hidden rounded-full border-[3px] border-white shadow-md cursor-pointer flex items-center justify-end items-start mt-[-12px]"
      >
        <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white text-sm font-bold">
              P
        </div>
      </div>
    </div>
  );
};

export default RightHeader;
