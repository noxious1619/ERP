import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import search from "../../../assets/Student/Dashboard/TopBar/search.svg";
import notification from "../../../assets/Student/Dashboard/TopBar/notification.svg";
import profileImage from "../../../assets/Student/Timetable/Header/profile.png";
import NotificationDropdown from "../../../components/Student/Dashboard/NotificationDropdown";
import { getDynamicHeaderDate } from "../../../utils/dateHelpers";

// Filter mode type — consumed by parent to switch schedule data
export type TeacherFilterMode = "class" | "mySubject";

interface TeacherTimetableHeaderProps {
  filterMode: TeacherFilterMode;
  onFilterChange: (mode: TeacherFilterMode) => void;
}

// Static class list — replace with API data when backend is ready
const CLASS_OPTIONS = [
  "Class X(A)",
  "Class X(B)",
  "Class XI(A)",
  "Class XI(B)",
  "Class XII(E)",
];

const TeacherTimetableHeader: React.FC<TeacherTimetableHeaderProps> = ({
  filterMode,
  onFilterChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [selectedClass, setSelectedClass] = useState("Class X(A)");

  const notificationRef = useRef<HTMLDivElement>(null);
  const classDropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isWeekly = location.pathname.includes("weekly");

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        classDropdownRef.current &&
        !classDropdownRef.current.contains(event.target as Node)
      ) {
        setShowClassDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-start justify-between">
      {/* Left Content */}
      <div>
        <h1 className="text-[44px] font-bold leading-[52px] text-[#2D3335]">
          My Timetable
        </h1>
        <p className="text-sm font-semibold text-gray-400 mt-1">
          {getDynamicHeaderDate()}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4 pt-2">
        {/* ── Filter Pill: Class Selector OR My Subject ── */}
        <div className="flex items-center gap-2">
          {/* Class dropdown pill */}
          <div className="relative" ref={classDropdownRef}>
            <button
              onClick={() => {
                onFilterChange("class");
                setShowClassDropdown((prev) => !prev);
              }}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-[14px] font-semibold transition-all duration-200
                ${
                  filterMode === "class"
                    ? "border-[#3F5BF6] bg-white text-[#3F5BF6] shadow-sm"
                    : "border-gray-200 bg-[#F2F2F2] text-[#5E5E5E] hover:border-gray-300"
                }`}
            >
              {selectedClass}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  showClassDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown list */}
            {showClassDropdown && (
              <div className="absolute left-0 top-full mt-2 z-50 min-w-[160px] rounded-2xl border border-gray-100 bg-white shadow-lg py-1.5">
                {CLASS_OPTIONS.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => {
                      setSelectedClass(cls);
                      setShowClassDropdown(false);
                      onFilterChange("class");
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors hover:bg-[#EEF0FF] hover:text-[#3F5BF6]
                      ${selectedClass === cls ? "text-[#3F5BF6] bg-[#EEF0FF]" : "text-gray-700"}`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* My Subject pill */}
          <button
            onClick={() => onFilterChange("mySubject")}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-[14px] font-semibold transition-all duration-200
              ${
                filterMode === "mySubject"
                  ? "border-[#3F5BF6] bg-white text-[#3F5BF6] shadow-sm"
                  : "border-gray-200 bg-[#F2F2F2] text-[#5E5E5E] hover:border-gray-300"
              }`}
          >
            My Subject
          </button>
        </div>

        {/* Daily / Weekly Toggle */}
        <div className="flex items-center rounded-full bg-[#F2F2F2] p-[4px] shadow-sm">
          <button
            onClick={() => navigate("/teacher/timetable")}
            className={`rounded-full px-7 py-2 text-[16px] font-semibold transition-all duration-300
              ${!isWeekly ? "bg-white text-[#3F5BF6] shadow-sm" : "text-[#5E5E5E]"}`}
          >
            Daily
          </button>
          <button
            onClick={() => navigate("/teacher/timetable/weekly")}
            className={`rounded-full px-7 py-2 text-[16px] font-semibold transition-all duration-300
              ${isWeekly ? "bg-white text-[#3F5BF6] shadow-sm" : "text-[#5E5E5E]"}`}
          >
            Weekly
          </button>
        </div>

        {/* Search */}
        <button className="text-[#5C5C5C] transition-colors hover:text-[#3F5BF6]">
          <img src={search} alt="Search" className="h-6 w-6" />
        </button>

        {/* Notification */}
        <div className="relative" ref={notificationRef}>
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
        </div>

        {/* Profile */}
        <div
          onClick={() => navigate("/teacher/profile")}
          className="h-[52px] w-[52px] overflow-hidden rounded-full border-[3px] border-white shadow-md cursor-pointer"
        >
          <img
            src={profileImage}
            alt="Teacher"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default TeacherTimetableHeader;
