import { useLocation, useNavigate } from "react-router-dom";
import { getDynamicHeaderDate } from "../../../utils/dateHelpers";
interface TimetableHeaderProps {
  sectionLabel?: string;
  profilePath?: string;
  profileImageUrl?: string;
}

const TimetableHeader = ({
  sectionLabel,
  profilePath = "/student/profile",
  profileImageUrl,
}: TimetableHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isWeekly = location.pathname === "/student/timetable/weekly";

  return (
    <div className="flex items-start justify-between">
      {/* Left Content */}
      <div>
        <h1 className="text-[44px] font-bold leading-[52px] text-[#2D3335]">
          My Timetable
        </h1>
        <p className="text-sm font-semibold text-gray-400 mt-1">
          {sectionLabel ? `${sectionLabel} · ` : ""}
          {getDynamicHeaderDate()}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-10 pt-2">
        {/* Toggle */}
        <div className="flex items-center rounded-full bg-[#F2F2F2] p-[4px] shadow-sm">
          <button
            onClick={() => navigate("/student/timetable")}
            className={`rounded-full px-7 py-2 text-[16px] font-semibold transition-all duration-300
              ${!isWeekly ? "bg-white text-[#3F5BF6] shadow-sm" : "text-[#5E5E5E]"}`}
          >
            Daily
          </button>
          <button
            onClick={() => navigate("/student/timetable/weekly")}
            className={`rounded-full px-7 py-2 text-[16px] font-semibold transition-all duration-300
              ${isWeekly ? "bg-white text-[#3F5BF6] shadow-sm" : "text-[#5E5E5E]"}`}
          >
            Weekly
          </button>
        </div>

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

export default TimetableHeader;
