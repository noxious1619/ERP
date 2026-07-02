// import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDynamicHeaderDate } from "../../../utils/dateHelpers";
interface HomeworkHeaderProps {
  title?: string;
  subtitle?: string;
  profileRoute?: string;
}
const HomeworkHeader = ({
  title = "Homework & Tasks",
  subtitle,
  profileRoute = "/student/profile",
}: HomeworkHeaderProps) => {
  // const [showNotifications, setShowNotifications] = useState(false);
  // const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       notificationRef.current &&
  //       !notificationRef.current.contains(event.target as Node)
  //     ) {
  //       setShowNotifications(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  return (
    <div className="flex w-full items-start">
      {/* Left Section */}
      <div>
        <h1 className="text-[44px] font-bold leading-[64px] tracking-[-2px] text-[#2D3335]">
          {title}
        </h1>
        <p className="text-sm font-semibold text-gray-400 mt-1">
          {subtitle ?? getDynamicHeaderDate()}
        </p>
      </div>

      {/* Right Section */}
      <div className="ml-auto flex items-center gap-10 pt-3 pr-2">
        {/* Notification */}
        {/* <div className="relative" ref={notificationRef}>
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
          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
          <div className="absolute right-[1px] top-[2px] h-[9px] w-[9px] rounded-full bg-[#E54866]" />
        </div> */}

        {/* Profile */}
        <div
          onClick={() => navigate(profileRoute)}
          className="h-[58px] w-[58px] overflow-hidden rounded-full border-[3px] border-white shadow-[0px_4px_14px_rgba(0,0,0,0.12)] cursor-pointer"
        >
          <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white text-lg font-bold">
            P
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeworkHeader;
