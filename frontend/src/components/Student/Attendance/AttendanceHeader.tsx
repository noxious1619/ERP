import { useState, useRef, useEffect } from "react";
import search from "../../../assets/Student/Dashboard/TopBar/search.svg";
import notification from "../../../assets/Student/Dashboard/TopBar/notification.svg";
import studentAvatar from "../../../assets/Student/Timetable/Header/profile.png";
import NotificationDropdown from "../../../components/Student/Dashboard/NotificationDropdown";
import { getDynamicHeaderDate } from "../../../utils/dateHelpers";
import { useNavigate } from "react-router";

interface AttendanceHeaderProps {
  title: string;
  subtitle?: string;
  onProfileClick?: () => void;
}

const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({
  title,
  subtitle,
  onProfileClick,
}) => {
  const navigate = useNavigate();
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
    <div className="flex items-start justify-between">
      {/* Left Side */}
      <div>
        <h1 className="text-[44px] font-bold leading-none text-[#2D3335]">
          {title}
        </h1>
        <p className="text-sm font-semibold text-gray-400 mt-1">
          {subtitle ?? getDynamicHeaderDate()}
        </p>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-10 pt-2">
        {/* Notification */}
        <div className="relative " ref={notificationRef}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative flex items-center justify-center cursor-pointer"
          >
            <img
              src={notification}
              alt="Notifications"
              className="h-[24px] w-[24px] object-contain"
            />
            <span className="absolute right-[-2px] top-[1px] h-[7px] w-[7px] rounded-full bg-[#D9475C]" />
          </button>
          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* Profile Avatar */}
        <button
          onClick={onProfileClick ?? (() => navigate("/student/profile"))}
          className="overflow-hidden rounded-full cursor-pointer"
        >
          <img
            src={studentAvatar}
            alt="Student"
            className="h-[52px] w-[52px] rounded-full object-cover"
          />
        </button>
      </div>
    </div>
  );
};

export default AttendanceHeader;
