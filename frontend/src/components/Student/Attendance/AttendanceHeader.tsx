import studentAvatar from "../../../assets/Student/Timetable/Header/profile.png";
import { getDynamicHeaderDate } from "../../../utils/dateHelpers";
import { useNavigate } from "react-router";
interface AttendanceHeaderProps {
  title: string;
  subtitle?: string;
  onProfileClick?: () => void;
  profilePath?: string;
  profileImageUrl?: string;
}

const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({
  title,
  subtitle,
  onProfileClick,
  profilePath = "/student/profile",
  profileImageUrl,
}) => {
  const navigate = useNavigate();
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
        {/* <div className="relative " ref={notificationRef}>
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
        </div> */}

        {/* Profile Avatar — navigates to the path passed via prop */}
        <button
          onClick={() => navigate(profilePath)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full overflow-hidden
                     ring-2 ring-white shadow-sm hover:ring-blue-300 transition-all cursor-pointer"
          aria-label="Go to profile"
        >
          {profileImageUrl && localStorage.getItem("role") !== "TEACHER" ? (
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
      </div>
    </div>
  );
};

export default AttendanceHeader;
