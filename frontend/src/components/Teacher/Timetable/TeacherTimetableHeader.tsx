import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { getDynamicHeaderDate } from "../../../utils/dateHelpers";

export type TeacherFilterMode = "class" | "mySubject";

export interface TeacherSection {
  id: string;
  name: string;
  academicClass: { id: string; name: string };
}

interface TeacherTimetableHeaderProps {
  filterMode: TeacherFilterMode;
  onFilterChange: (mode: TeacherFilterMode) => void;
  sections: TeacherSection[];
  selectedSection: TeacherSection | null;
  onSectionChange: (section: TeacherSection) => void;
}

const TeacherTimetableHeader: React.FC<TeacherTimetableHeaderProps> = ({
  filterMode,
  onFilterChange,
  sections,
  selectedSection,
  onSectionChange,
}) => {
  // const [showNotifications, setShowNotifications] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  // const notificationRef = useRef<HTMLDivElement>(null);
  const classDropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isWeekly = location.pathname.includes("weekly");

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       notificationRef.current &&
  //       !notificationRef.current.contains(event.target as Node)
  //     ) {
  //       setShowNotifications(false);
  //     }
  //     if (
  //       classDropdownRef.current &&
  //       !classDropdownRef.current.contains(event.target as Node)
  //     ) {
  //       setShowClassDropdown(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  // Format section label: "Class 10 - Section A"
  const getSectionLabel = (section: TeacherSection) =>
    `${section.academicClass.name} - ${section.name}`;

  const selectedLabel = selectedSection
    ? getSectionLabel(selectedSection)
    : "Select Class";

  return (
    <div className="flex items-start justify-between">
      {/* Left */}
      <div>
        <h1 className="text-[44px] font-bold leading-[52px] text-[#2D3335]">
          My Timetable
        </h1>
        <p className="text-sm font-semibold text-gray-400 mt-1">
          {getDynamicHeaderDate()}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-8 pt-2">
        {/* ── Filter Pills ── */}
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
              {selectedLabel}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${showClassDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showClassDropdown && sections.length > 0 && (
              <div className="absolute left-0 top-full mt-2 z-50 min-w-[200px] rounded-2xl border border-gray-100 bg-white shadow-lg py-1.5">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      onSectionChange(section);
                      setShowClassDropdown(false);
                      onFilterChange("class");
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors hover:bg-[#EEF0FF] hover:text-[#3F5BF6]
                      ${selectedSection?.id === section.id ? "text-[#3F5BF6] bg-[#EEF0FF]" : "text-gray-700"}`}
                  >
                    {getSectionLabel(section)}
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

        {/* Notification */}
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
          onClick={() => navigate("/teacher/profile")}
          className="h-[52px] w-[52px] overflow-hidden rounded-full border-[3px] border-white shadow-md cursor-pointer flex items-center justify-center bg-blue-500 text-white text-lg font-bold"
        >
          P
        </div>
      </div>
    </div>
  );
};

export default TeacherTimetableHeader;
