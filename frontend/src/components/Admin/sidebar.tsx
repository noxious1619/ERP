"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Bell,
  ChevronDown,
} from "lucide-react";

interface NavItemChild {
  label: string;
  href: string;
  children?: NavItemChild[];
}

interface NavItem {
  label: string;
  icon: any;
  href: string;
  defaultOpen?: boolean;
  children: NavItemChild[];
}

const NAV: NavItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    children: [],
  },
  {
    label: "Academics",
    icon: GraduationCap,
    href: "#",
    defaultOpen: true,
    children: [
      { label: "Students", href: "/admin/academics/students" },
      { label: "Staff", href: "/admin/academics/staff" },
      { label: "Teachers", href: "/admin/academics/teachers" },
      { label: "Academic Years", href: "/admin/academics/academic-years" },
      { label: "Classes & Sections", href: "/admin/academics/classes" },
      { label: "Subjects", href: "/admin/academics/subjects" },
      { label: "Timetable", href: "/admin/academics/timetable" },
      { label: "Attendance", href: "/admin/academics/attendance" },
      {
        label: "Exams",
        href: "#",
        children: [
          { label: "Date sheet", href: "/admin/academics/exams/datesheet" },
        ],
      },
    ],
  },
  {
    label: "Communication",
    icon: Bell,
    href: "#",
    children: [{ label: "Notices", href: "/admin/communication/notices" }],
  },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(true);

  const [activeParent, setActiveParent] = useState("Academics");
  const [activeChild, setActiveChild] = useState("Date sheet");

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        NAV.filter((item) => item.defaultOpen).map((item) => [
          item.label,
          true,
        ]),
      ),
  );

  const [openSubSections, setOpenSubSections] = useState<
    Record<string, boolean>
  >({
    Exams: true, // Exams section default open as shown in mockup
  });

  // Track active page routes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      NAV.forEach((item) => {
        if (item.href === path) {
          setActiveParent(item.label);
          setActiveChild("");
        }
        item.children.forEach((child) => {
          if (child.href === path) {
            setActiveParent(item.label);
            setActiveChild(child.label);
          }
          if (child.children) {
            child.children.forEach((sub) => {
              if (sub.href === path) {
                setActiveParent(item.label);
                setActiveChild(sub.label);
                setOpenSubSections((prev) => ({
                  ...prev,
                  [child.label]: true,
                }));
              }
            });
          }
        });
      });
    }
  }, []);

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const toggleSubSection = (label: string) => {
    setOpenSubSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={[
        "group flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-200 ease-linear z-30",
        collapsed ? "w-[3.5rem]" : "w-[16rem]",
      ].join(" ")}
    >
      <div className="flex h-16 items-center gap-2.5 border-b border-gray-100 px-3">
        <svg
          width="43"
          height="40"
          viewBox="0 0 43 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <rect
            x="1.5"
            width="40"
            height="40"
            rx="20"
            fill="url(#paint0_linear_639_721)"
          />
          <path
            d="M21.5 29L14.5 25.2V19.2L10.5 17L21.5 11L32.5 17V25H30.5V18.1L28.5 19.2V25.2L21.5 29ZM21.5 20.7L28.35 17L21.5 13.3L14.65 17L21.5 20.7ZM21.5 26.725L26.5 24.025V20.25L21.5 23L16.5 20.25V24.025L21.5 26.725Z"
            fill="#F8F9FE"
          />
          <defs>
            <linearGradient
              id="paint0_linear_639_721"
              x1="1.5"
              y1="0"
              x2="41.5"
              y2="40"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.408654" stopColor="#4285F4" />
              <stop offset="1" stopColor="white" />
            </linearGradient>
          </defs>
        </svg>

        {!collapsed && (
          <div className="overflow-hidden">
            <p className="truncate text-lg font-bold text-[#4285F4]">EdaOS</p>
            <p className="truncate text-[11px] text-gray-500">Admin Portal</p>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden px-2 py-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children.length > 0;
          const isOpen = openSections[item.label] ?? false;

          return (
            <div key={item.label}>
              {hasChildren ? (
                <button
                  onClick={() => {
                    setActiveParent(item.label);
                    toggleSection(item.label);
                  }}
                  title={collapsed ? item.label : undefined}
                  className={[
                    "flex w-full items-center gap-2.5 rounded-3xl px-2.5 py-2 text-sm font-medium transition-colors cursor-pointer",
                    activeParent === item.label
                      ? "bg-[#4285F4] text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4 shrink-0" />

                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate text-left">
                        {item.label}
                      </span>

                      <ChevronDown
                        className={[
                          "h-4 w-4 shrink-0 transition-transform duration-200",
                          isOpen ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </>
                  )}
                </button>
              ) : (
                <a
                  href={item.href}
                  onClick={() => {
                    setActiveParent(item.label);
                  }}
                  title={collapsed ? item.label : undefined}
                  className={[
                    "flex w-full items-center gap-2.5 rounded-3xl px-2.5 py-2 text-sm font-medium transition-colors cursor-pointer",
                    activeParent === item.label
                      ? "bg-[#4285F4] text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4 shrink-0" />

                  {!collapsed && (
                    <span className="flex-1 truncate text-left">
                      {item.label}
                    </span>
                  )}
                </a>
              )}

              {hasChildren && !collapsed && isOpen && (
                <ul className="ml-[1.65rem] mt-0.5 border-l border-gray-200 py-0.5 flex flex-col gap-0.5">
                  {item.children.map((child) => {
                    const hasSubChildren =
                      child.children && child.children.length > 0;
                    const isSubOpen = openSubSections[child.label] ?? false;

                    if (hasSubChildren) {
                      return (
                        <li key={child.label} className="mt-0.5">
                          <button
                            onClick={() => toggleSubSection(child.label)}
                            className="flex w-full items-center justify-between py-1.5 pl-3 pr-2 text-sm text-gray-500 hover:text-[#4285F4] transition-colors focus:outline-none cursor-pointer font-medium"
                          >
                            <span className="truncate">{child.label}</span>
                            <ChevronDown
                              className={[
                                "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                                isSubOpen ? "rotate-180" : "",
                              ].join(" ")}
                            />
                          </button>
                          {isSubOpen && (
                            <ul className="ml-[0.75rem] mt-0.5 border-l border-gray-200 py-0.5 flex flex-col gap-0.5">
                              {child.children!.map((subChild) => (
                                <li key={subChild.label}>
                                  <a
                                    href={subChild.href}
                                    onClick={() => {
                                      setActiveParent(item.label);
                                      setActiveChild(subChild.label);
                                    }}
                                    className={[
                                      "block py-1.5 pl-3 text-sm transition-colors rounded-lg",
                                      activeChild === subChild.label
                                        ? "font-bold text-[#4285F4]"
                                        : "text-gray-500 hover:text-[#4285F4]",
                                    ].join(" ")}
                                  >
                                    {subChild.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    }

                    return (
                      <li key={child.label}>
                        <a
                          href={child.href}
                          onClick={() => {
                            setActiveParent(item.label);
                            setActiveChild(child.label);
                          }}
                          className={[
                            "block py-1.5 pl-3 text-sm transition-colors rounded-lg",
                            activeChild === child.label
                              ? "font-bold text-[#4285F4]"
                              : "text-gray-500 hover:text-[#4285F4]",
                          ].join(" ")}
                        >
                          {child.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
