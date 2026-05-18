import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoIcon from "../../../assets/Student/Dashboard/Navbar/logoIcon.png";
import dashboard from "../../../assets/Student/Dashboard/Navbar/dashboard.png";
import timetable from "../../../assets/Student/Dashboard/Navbar/timetable.png";
import homework from "../../../assets/Student/Dashboard/Navbar/homework.png";
import attendance from "../../../assets/Student/Dashboard/Navbar/attendance.png";
import exams from "../../../assets/Student/Dashboard/Navbar/exams.png";
import setting from "../../../assets/Student/Dashboard/Navbar/setting.png";
import notification from "../../../assets/Student/Dashboard/Navbar/notification.svg";
import profileImage from "../../../assets/Student/Timetable/Header/profile.png";

type NavItem = {
  label: string;
  icon: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: dashboard, href: "/student/dashboard" },
  { label: "Timetable", icon: timetable, href: "/student/timetable" },
  { label: "Homework", icon: homework, href: "/student/homework" },
  { label: "Exams", icon: exams, href: "/student/exams" },
  { label: "Attendance ", icon: attendance, href: "/student/attendance" },
  { label: "Notices", icon: notification, href: "/student/notices" },
  { label: "Settings", icon: setting, href: "/student/settings" },
  { label: "Profile", icon: profileImage, href: "/student/profile" },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { pathname } = useLocation(); // ← reads the current URL path

  return (
    <aside
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={`
        min-h-screen bg-[#F8FAFC] border-r border-gray-200
        shrink-0 flex flex-col pt-5 pb-8
        transition-all duration-300 ease-in-out overflow-hidden
        ${collapsed ? "w-[86px] px-3" : "w-[210px] px-4"}
      `}
    >
      {/* Logo */}
      <div
        className={`
          flex items-center mb-8 transition-all duration-300
          ${collapsed ? "justify-center" : "gap-3 px-2"}
        `}
      >
        <div className="w-10 h-10 rounded-full bg-[linear-gradient(135deg,#2B3674_0%,#5C63C7_55%,#A8AEFF_100%)] flex items-center justify-center shrink-0">
          <img src={logoIcon} alt="EdaOS Logo" className="w-5 h-5" />
        </div>

        <div
          className={`
            flex flex-col leading-tight whitespace-nowrap transition-all duration-300
            ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}
          `}
        >
          <span className="text-[#090958] font-bold text-lg leading-5">
            EdaOS
          </span>
          <span className="text-[#5A5F67] text-xs">Student Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href; // ← dynamic per route

          return (
            <Link
              key={item.label}
              to={item.href}
              className={`
                flex items-center rounded-3xl text-sm
                transition-all duration-300 h-[46px]
                ${collapsed ? "justify-center px-0" : "gap-3 px-3"}
                ${
                  isActive
                    ? "bg-rgba(255, 255, 255, 0.1) text-[#2d2f6b] rounded-3xl shadow-[0px_1px_5px_0px_rgba(0,0,0,0.10)] font-semibold"
                    : "text-[#8a92a6] hover:bg-gray-200 hover:text-[#2d2f6b]"
                }
              `}
            >
              <img
                src={item.icon}
                alt={item.label}
                className={`
    shrink-0 
    ${
      item.label === "Profile"
        ? "w-10 h-10 rounded-full border-2 border-white shadow-sm"
        : "w-6 h-6"
    }
  `}
              />

              <span
                className={`
                  whitespace-nowrap transition-all duration-300
                  ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
